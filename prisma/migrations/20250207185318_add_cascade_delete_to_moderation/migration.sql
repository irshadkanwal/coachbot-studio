-- DropForeignKey
ALTER TABLE "ModerationRule" DROP CONSTRAINT "ModerationRule_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ModerationTemplate" DROP CONSTRAINT "ModerationTemplate_rule_id_fkey";

-- AddForeignKey
ALTER TABLE "ModerationRule" ADD CONSTRAINT "ModerationRule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ModerationTemplate" ADD CONSTRAINT "ModerationTemplate_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "ModerationRule"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
