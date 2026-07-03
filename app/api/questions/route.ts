// app/api/questions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AttemptStatus } from "@/app/generated/prisma";

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON payload
    const body = await request.json();
    const { 
      title, 
      platform, 
      questionNumber, 
      difficulty, 
      status, 
      notes, 
      patternNames // Expected as an array of strings: ["Sliding Window", "Two Pointers"]
    } = body;

    // 2. Validate required fields (Title is the absolute minimum)
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Question title is required." },
        { status: 400 }
      );
    }

    // 3. Spaced Repetition Engine: Calculate the 7-day alarm
    let nextReviewDate = null;
    if (status !== AttemptStatus.COMPLETED && status !== AttemptStatus.SKIPPED) {
      const today = new Date();
      nextReviewDate = new Date(today.setDate(today.getDate() + 7));
    }

    // 4. Format patterns for Prisma's connectOrCreate relation
    const patternConnections = (patternNames || []).map((name: string) => ({
      where: { name },
      create: { name },
    }));

    // 5. Execute the database transaction
    const newQuestion = await db.question.create({
      data: {
        title,
        platform,
        questionNumber,
        difficulty,
        attempts: {
          create: {
            status,
            notes,
            nextReviewDate,
            patterns: {
              connectOrCreate: patternConnections,
            },
          },
        },
      },
      include: {
        attempts: {
          include: {
            patterns: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: newQuestion }, { status: 201 });

  } catch (error) {
    console.error("API Error - POST /api/questions:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while saving question." },
      { status: 500 }
    );
  }
}