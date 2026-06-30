// types/index.ts
import { Prisma } from "@/app/generated/prisma";

// 1. Validator for a Question that includes its associated attempts
const questionWithDetailsArgs = Prisma.validator<Prisma.QuestionDefaultArgs>()({
  include: {
    attempts: {
      include: {
        patterns: true,
      },
    },
  },
});

export type QuestionWithDetails = Prisma.QuestionGetPayload<typeof questionWithDetailsArgs>;

// 2. Validator for an Attempt that includes its Question and Patterns
const attemptWithQuestionArgs = Prisma.validator<Prisma.AttemptDefaultArgs>()({
  include: {
    question: true,
    patterns: true,
  },
});

export type AttemptWithQuestion = Prisma.AttemptGetPayload<typeof attemptWithQuestionArgs>;

// 3. Cleanly re-export the generated enum for our frontend forms
export { AttemptStatus } from "@/app/generated/prisma";