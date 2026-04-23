-- CreateTable
CREATE TABLE "TwilioCredentials" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "assistantId" UUID NOT NULL,
    "accountSid" VARCHAR(255) NOT NULL,
    "authToken" VARCHAR(255) NOT NULL,
    "smsNumber" VARCHAR(20) NOT NULL,
    "whatsappNumber" VARCHAR(20),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "TwilioCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwilioCredentials_assistantId_key" ON "TwilioCredentials"("assistantId");

-- CreateIndex
CREATE INDEX "idx_twilio_credentials_assistantId" ON "TwilioCredentials"("assistantId");

-- CreateIndex
CREATE INDEX "idx_twilio_credentials_active" ON "TwilioCredentials"("isActive");

-- AddForeignKey
ALTER TABLE "TwilioCredentials" ADD CONSTRAINT "TwilioCredentials_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
