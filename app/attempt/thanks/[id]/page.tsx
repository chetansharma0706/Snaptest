import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import ThankYouPage from "./Thankyou";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const attemptId = (await params).id;
    if (!session) {
        return redirect('/')
    }
    
    // Fetch the quiz/test
    const attempt = await prisma.attempt.findUnique({
        where: { id: attemptId },
    });

    // If attempt doesn't exist, show 404
    if (!attempt) {
        console.log("No attempt found");
        return notFound();
    }


    return <ThankYouPage />;
}
