-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "subscriptionId" TEXT,
    "customerId" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL,
    "canceledAt" TIMESTAMP(3),
    "coaches" TEXT,
    "analytics" TEXT,
    "allowedIntegration" BOOLEAN,
    "trialDays" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_customerId_key" ON "Subscription"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "idx_subscription_user_id" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
