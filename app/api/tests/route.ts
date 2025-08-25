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

    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const test = await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        createdBy: session.user.id, // must exist in User table!
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("Error Creating Test: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
