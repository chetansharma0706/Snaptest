import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.userId || !data.quizId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const attempt = await prisma.attempt.create({
      data: {
       userId: data.userId,
       quizId: data.quizId,
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error Creating Attempt: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
