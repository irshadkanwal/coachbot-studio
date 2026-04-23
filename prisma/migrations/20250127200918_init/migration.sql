-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "life_area" AS ENUM ('Health & Wellbeing', 'Finances', 'Family & Friends', 'Romance', 'Personal Growth', 'Fun & Recreation', 'Business & Career', 'Physical Environment');

-- CreateSequence for stage_id_seq
CREATE SEQUENCE "stage_id_seq" START 1;

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "currentStage" TEXT,
    "lifeAreas" JSONB,
    "sessionSummary" JSONB,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatLifeAreas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "chatId" TEXT,
    "area" "life_area" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "keywords" TEXT[],
    "context" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "messageIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT true,

    CONSTRAINT "ChatLifeAreas_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ChatLifeAreas_confidence_check" CHECK (confidence >= 0 AND confidence <= 1)
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "star" BOOLEAN,
    "role" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "type" TEXT,
    "stage" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelConfig" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "temperature" DECIMAL(3,2) NOT NULL,
    "top_p" DECIMAL(3,2) NOT NULL,
    "frequency_penalty" DECIMAL(3,2) NOT NULL,
    "presence_penalty" DECIMAL(3,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_configs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "check_temperature" CHECK (temperature >= 0 AND temperature <= 2),
    CONSTRAINT "check_top_p" CHECK (top_p >= 0 AND top_p <= 1),
    CONSTRAINT "check_frequency_penalty" CHECK (frequency_penalty >= -2 AND frequency_penalty <= 2),
    CONSTRAINT "check_presence_penalty" CHECK (presence_penalty >= -2 AND presence_penalty <= 2)
);

-- CreateTable
CREATE TABLE "ModerationRule" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "severity" VARCHAR(50),
    "instructions" JSONB NOT NULL DEFAULT '{"context": "", "triggers": [], "response_guidelines": ""}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationRule_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ModerationRule_severity_check" CHECK (severity = ANY (ARRAY['low', 'medium', 'high']::text[]))
);

-- CreateTable
CREATE TABLE "ModerationTemplate" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "category" VARCHAR(50) NOT NULL,
    "response_template" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "rule_id" UUID,

    CONSTRAINT "ModerationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL DEFAULT nextval('stage_id_seq'::regclass),
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "instructions" TEXT,
    "analyzer" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Style" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "tone" VARCHAR(50) NOT NULL,
    "emoji_frequency" VARCHAR(20) NOT NULL,
    "language_complexity" VARCHAR(20) NOT NULL,
    "greeting_templates" JSONB NOT NULL,
    "response_patterns" JSONB NOT NULL,
    "closing_templates" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,

    CONSTRAINT "tones_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "check_emoji_frequency" CHECK (emoji_frequency = ANY (ARRAY['low', 'medium', 'high']::text[])),
    CONSTRAINT "check_language_complexity" CHECK (language_complexity = ANY (ARRAY['low', 'medium', 'high']::text[]))
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chatId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "key_points" JSONB NOT NULL,
    "insights" JSONB NOT NULL,
    "emotional_state" TEXT,
    "progress_indicators" JSONB NOT NULL,
    "stage_specific" JSONB NOT NULL,
    "next_stage_recommendations" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "instructions" TEXT,
    "email" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_chat_life_areas_gin" ON "Chat" USING GIN ("lifeAreas");

-- CreateIndex
CREATE INDEX "idx_chat_summary_gin" ON "Chat" USING GIN ("sessionSummary");

-- CreateIndex
CREATE INDEX "idx_chat_life_areas" ON "ChatLifeAreas"("chatId", "area", "isActive");

-- CreateIndex
CREATE INDEX "idx_model_configs_user_id" ON "ModelConfig"("user_id");

-- CreateIndex
CREATE INDEX "idx_style_user_title" ON "Style"("user_id", "title");

-- CreateIndex
CREATE INDEX "idx_tones_user_id" ON "Style"("user_id");

-- CreateIndex
CREATE INDEX "idx_summary_chat_id" ON "Summary"("chatId");

-- AddForeignKey
ALTER TABLE "ChatLifeAreas" ADD CONSTRAINT "ChatLifeAreas_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ModelConfig" ADD CONSTRAINT "model_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ModerationRule" ADD CONSTRAINT "ModerationRule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ModerationTemplate" ADD CONSTRAINT "ModerationTemplate_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "ModerationRule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "tones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
