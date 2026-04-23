-- Add new columns to ModerationRule
ALTER TABLE "ModerationRule" ADD COLUMN "input_score" DECIMAL(3,2);
ALTER TABLE "ModerationRule" ADD COLUMN "output_score" DECIMAL(3,2);  
ALTER TABLE "ModerationRule" ADD COLUMN "response_examples" TEXT;

-- Migrate existing score data to new columns
UPDATE "ModerationRule" 
SET "input_score" = "score", "output_score" = "score" 
WHERE "score" IS NOT NULL;

-- Drop the ModerationTemplate table
DROP TABLE "ModerationTemplate";

-- Drop old columns from ModerationRule
ALTER TABLE "ModerationRule" DROP COLUMN "score";
ALTER TABLE "ModerationRule" DROP COLUMN "custom";