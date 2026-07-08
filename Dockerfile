FROM node:20-alpine
WORKDIR /app

# Install compilation and runtime packages (g++, Java OpenJDK, and Python)
RUN apk add --no-cache libc6-compat g++ openjdk17-jre openjdk17 python3

# Copy dependency files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client (specified output: ../lib/generated/prisma)
RUN npx prisma generate

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Start the application
EXPOSE 3000
CMD ["npm", "run", "start"]
