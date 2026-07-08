import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Helper to run command with timeout and stdin
const runProcessWithStdin = (
    command: string,
    args: string[],
    stdinData: string,
    timeoutMs: number = 3000
): Promise<{ stdout: string; stderr: string; error: string | null; timeout: boolean }> => {
    return new Promise((resolve) => {
        const child = spawn(command, args);
        let stdout = "";
        let stderr = "";
        let isFinished = false;

        const timer = setTimeout(() => {
            if (!isFinished) {
                isFinished = true;
                child.kill("SIGKILL");
                resolve({ stdout, stderr, error: "Time Limit Exceeded", timeout: true });
            }
        }, timeoutMs);

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", (err) => {
            if (!isFinished) {
                isFinished = true;
                clearTimeout(timer);
                resolve({ stdout, stderr, error: err.message, timeout: false });
            }
        });

        child.on("close", (code) => {
            if (!isFinished) {
                isFinished = true;
                clearTimeout(timer);
                resolve({ stdout, stderr, error: code !== 0 ? `Exit code ${code}` : null, timeout: false });
            }
        });

        // Write input data to process stdin
        child.stdin.write(stdinData + "\n");
        child.stdin.end();
    });
};

// Promisified exec for compilation
const execPromise = (cmd: string, options: any = {}) => {
    return new Promise<{ stdout: string; stderr: string; error: any }>((resolve) => {
        exec(cmd, options, (error, stdout, stderr) => {
            resolve({ stdout, stderr, error });
        });
    });
};

// Helper to normalize outputs for comparison (3Sum specific)
const normalizeThreeSum = (outputStr: string): string => {
    try {
        const arr = JSON.parse(outputStr);
        if (!Array.isArray(arr)) return JSON.stringify(arr);
        return JSON.stringify(
            arr.map((a: any) => Array.isArray(a) ? [...a].sort((x, y) => x - y) : a)
               .sort((a: any, b: any) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
        );
    } catch (e) {
        return outputStr.trim();
    }
};

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;
        const { code, language } = await req.json();

        if (!code || !language) {
            return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
        }

        // Fetch problem and its test cases
        const problem = await prisma.problem.findUnique({
            where: { slug },
            include: { testCases: true },
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        // Create temporary directory for compilation & execution
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "starkscripts-"));
        
        let evalResults: any[] = [];
        let runtimeError: string | null = null;

        try {
            if (language === "cpp") {
                // Wrapper for C++
                const cppDriver = `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <cctype>

// --- User Code Start ---
${code}
// --- User Code End ---

std::vector<int> parseVector(const std::string& str) {
    std::vector<int> res;
    std::string temp = "";
    for (char c : str) {
        if (c == '-' || std::isdigit(c)) {
            temp += c;
        } else if (c == ',' || c == ']') {
            if (!temp.empty()) {
                res.push_back(std::stoi(temp));
                temp = "";
            }
        }
    }
    return res;
}

int main() {
    std::string line;
    if (std::getline(std::cin, line)) {
        std::vector<int> nums = parseVector(line);
        Solution sol;
        std::vector<std::vector<int>> ans = sol.threeSum(nums);
        std::cout << "[";
        for (size_t i = 0; i < ans.size(); ++i) {
            std::cout << "[";
            for (size_t j = 0; j < ans[i].size(); ++j) {
                std::cout << ans[i][j];
                if (j + 1 < ans[i].size()) std::cout << ",";
            }
            std::cout << "]";
            if (i + 1 < ans.size()) std::cout << ",";
        }
        std::cout << "]" << std::endl;
    }
    return 0;
}
                `;
                const sourcePath = path.join(tempDir, "Solution.cpp");
                const binaryPath = path.join(tempDir, process.platform === "win32" ? "Solution.exe" : "Solution");
                
                fs.writeFileSync(sourcePath, cppDriver);

                // Compile C++ code
                const compileRes = await execPromise(`g++ -O3 -std=c++17 "${sourcePath}" -o "${binaryPath}"`);
                if (compileRes.error) {
                    runtimeError = `Compilation Error:\n${compileRes.stderr || compileRes.stdout}`;
                } else {
                    // Execute each testcase
                    for (const tc of problem.testCases) {
                        const start = performance.now();
                        const execRes = await runProcessWithStdin(binaryPath, [], tc.input);
                        const elapsed = performance.now() - start;

                        if (execRes.timeout) {
                            evalResults.push({ pass: false, output: "Time Limit Exceeded", expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                        } else if (execRes.error && !execRes.stdout) {
                            evalResults.push({ pass: false, output: `Runtime Error: ${execRes.stderr || execRes.error}`, expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                        } else {
                            const expectedNorm = normalizeThreeSum(tc.output);
                            const actualNorm = normalizeThreeSum(execRes.stdout);
                            const pass = actualNorm === expectedNorm;
                            let parsedOut = execRes.stdout;
                            try { parsedOut = JSON.parse(execRes.stdout); } catch (e) {}

                            evalResults.push({
                                pass,
                                output: parsedOut,
                                expected: JSON.parse(tc.output),
                                time: elapsed.toFixed(2),
                                input: JSON.parse(tc.input),
                            });
                        }
                    }
                }

            } else if (language === "java") {
                // Wrapper for Java
                const javaDriver = `
import java.util.*;
import java.io.*;

public class Main {
    private static int[] parseVector(String str) {
        str = str.replace("[", "").replace("]", "").trim();
        if (str.isEmpty()) return new int[0];
        String[] parts = str.split(",");
        int[] res = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            res[i] = Integer.parseInt(parts[i].trim());
        }
        return res;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line = reader.readLine();
        if (line == null) return;
        int[] nums = parseVector(line);
        Solution sol = new Solution();
        List<List<Integer>> ans = sol.threeSum(nums);
        
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < ans.size(); i++) {
            sb.append("[");
            List<Integer> list = ans.get(i);
            for (int j = 0; j < list.size(); j++) {
                sb.append(list.get(j));
                if (j + 1 < list.size()) sb.append(",");
            }
            sb.append("]");
            if (i + 1 < ans.size()) sb.append(",");
        }
        sb.append("]");
        System.out.println(sb.toString());
    }
}
                `;
                const mainPath = path.join(tempDir, "Main.java");
                const solutionPath = path.join(tempDir, "Solution.java");

                fs.writeFileSync(mainPath, javaDriver);
                fs.writeFileSync(solutionPath, code);

                // Compile Java code
                const compileRes = await execPromise(`javac -d "${tempDir}" "${mainPath}" "${solutionPath}"`);
                if (compileRes.error) {
                    runtimeError = `Compilation Error:\n${compileRes.stderr || compileRes.stdout}`;
                } else {
                    // Execute each testcase
                    for (const tc of problem.testCases) {
                        const start = performance.now();
                        const execRes = await runProcessWithStdin("java", ["-cp", tempDir, "Main"], tc.input);
                        const elapsed = performance.now() - start;

                        if (execRes.timeout) {
                            evalResults.push({ pass: false, output: "Time Limit Exceeded", expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                        } else if (execRes.error && !execRes.stdout) {
                            evalResults.push({ pass: false, output: `Runtime Error: ${execRes.stderr || execRes.error}`, expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                        } else {
                            const expectedNorm = normalizeThreeSum(tc.output);
                            const actualNorm = normalizeThreeSum(execRes.stdout);
                            const pass = actualNorm === expectedNorm;
                            let parsedOut = execRes.stdout;
                            try { parsedOut = JSON.parse(execRes.stdout); } catch (e) {}

                            evalResults.push({
                                pass,
                                output: parsedOut,
                                expected: JSON.parse(tc.output),
                                time: elapsed.toFixed(2),
                                input: JSON.parse(tc.input),
                            });
                        }
                    }
                }

            } else if (language === "python") {
                // Wrapper for Python
                const pythonDriver = `
import sys
import json
from typing import *

# --- User Code Start ---
${code}
# --- User Code End ---

try:
    line = sys.stdin.readline().strip()
    if line:
        nums = json.loads(line)
        sol = Solution()
        res = sol.threeSum(nums)
        print(json.dumps(res))
except Exception as e:
    import traceback
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
                `;
                const scriptPath = path.join(tempDir, "solution.py");
                fs.writeFileSync(scriptPath, pythonDriver);

                for (const tc of problem.testCases) {
                    const start = performance.now();
                    const execRes = await runProcessWithStdin(process.platform === "win32" ? "python" : "python3", [scriptPath], tc.input);
                    const elapsed = performance.now() - start;

                    if (execRes.timeout) {
                        evalResults.push({ pass: false, output: "Time Limit Exceeded", expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                    } else if (execRes.error && !execRes.stdout) {
                        evalResults.push({ pass: false, output: `Runtime Error:\n${execRes.stderr}`, expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                    } else {
                        const expectedNorm = normalizeThreeSum(tc.output);
                        const actualNorm = normalizeThreeSum(execRes.stdout);
                        const pass = actualNorm === expectedNorm;
                        let parsedOut = execRes.stdout;
                        try { parsedOut = JSON.parse(execRes.stdout); } catch (e) {}

                        evalResults.push({
                            pass,
                            output: parsedOut,
                            expected: JSON.parse(tc.output),
                            time: elapsed.toFixed(2),
                            input: JSON.parse(tc.input),
                        });
                    }
                }

            } else if (language === "javascript" || language === "typescript") {
                // Node.js Execution
                const jsDriver = `
const fs = require('fs');

// --- User Code Start ---
${code}
// --- User Code End ---

try {
    const line = fs.readFileSync(0, 'utf-8').trim();
    if (line) {
        const nums = JSON.parse(line);
        // Find threeSum function (either var threeSum or function threeSum)
        const func = typeof threeSum !== 'undefined' ? threeSum : null;
        if (!func) {
            console.error("Error: Function 'threeSum' not found.");
            process.exit(1);
        }
        const res = func(nums);
        console.log(JSON.stringify(res));
    }
} catch (err) {
    console.error(err.stack || err);
    process.exit(1);
}
                `;
                const scriptPath = path.join(tempDir, "solution.js");
                fs.writeFileSync(scriptPath, jsDriver);

                for (const tc of problem.testCases) {
                    const start = performance.now();
                    const execRes = await runProcessWithStdin("node", [scriptPath], tc.input);
                    const elapsed = performance.now() - start;

                    if (execRes.timeout) {
                        evalResults.push({ pass: false, output: "Time Limit Exceeded", expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                    } else if (execRes.error && !execRes.stdout) {
                        evalResults.push({ pass: false, output: `Runtime Error:\n${execRes.stderr}`, expected: JSON.parse(tc.output), time: elapsed.toFixed(2), input: JSON.parse(tc.input) });
                    } else {
                        const expectedNorm = normalizeThreeSum(tc.output);
                        const actualNorm = normalizeThreeSum(execRes.stdout);
                        const pass = actualNorm === expectedNorm;
                        let parsedOut = execRes.stdout;
                        try { parsedOut = JSON.parse(execRes.stdout); } catch (e) {}

                        evalResults.push({
                            pass,
                            output: parsedOut,
                            expected: JSON.parse(tc.output),
                            time: elapsed.toFixed(2),
                            input: JSON.parse(tc.input),
                        });
                    }
                }
            } else {
                return NextResponse.json({ error: `Language ${language} not supported` }, { status: 400 });
            }

        } finally {
            // Clean up temp directory
            try {
                fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (err) {
                console.error("Failed to clean up temp directory:", err);
            }
        }

        return NextResponse.json({ evalResults, runtimeError });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
