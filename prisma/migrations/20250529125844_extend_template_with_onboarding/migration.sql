-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "onboarding" TEXT NOT NULL DEFAULT 'New client onboarding instructions',
ADD COLUMN     "onboardingAnalyzer" TEXT NOT NULL DEFAULT 'Onboarding evaluation/transition analysis instructions';
