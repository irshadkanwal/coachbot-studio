-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "creted_by" TEXT NOT NULL,
    "coach_name" TEXT NOT NULL,
    "step1_a" TEXT NOT NULL,
    "step2_a" TEXT NOT NULL,
    "step3_a" TEXT NOT NULL,
    "step4_a" TEXT NOT NULL,
    "step5_a" TEXT NOT NULL,
    "step6_a" TEXT[],
    "step7_a" TEXT[],
    "step8_a" TEXT NOT NULL,
    "step9_a" TEXT NOT NULL,
    "step10_a" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);
