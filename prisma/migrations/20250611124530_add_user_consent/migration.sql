-- AlterTable
ALTER TABLE "User" ADD COLUMN     "consentAccepted" BOOLEAN,
ADD COLUMN     "consentAcceptedAt" TIMESTAMPTZ(6);
