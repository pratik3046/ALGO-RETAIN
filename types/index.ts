// types/index.ts
import { Prisma } from "@prisma/client";

// 1. A Question that includes its past attempts and the pattern tags
export type QuestionWithDetails = Prisma.QuestionGetPayload<{
  include: {
    attempts: {
      include: {
        patterns: true;
      };
    };
  };
}>;

// 2. An Attempt that includes the associated Question (useful for the Review Queue)
export type AttemptWithQuestion = Prisma.AttemptGetPayload<{
  include: {
    question: true;
    patterns: true;
  };
}>;

// 3. Re-exporting the standard Prisma enums for our frontend forms
export { AttemptStatus } from "@prisma/client";