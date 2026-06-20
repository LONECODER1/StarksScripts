import Header from '@/components/Header';
import { auth } from '@/app/lib/auth';

export default async function LandingPage() {
    const session = await auth();

    return (
        <div>
            <Header session={session} />
            <span>This is the Landing Page</span>
        </div>
    );
}
