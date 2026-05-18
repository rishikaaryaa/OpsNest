-- Rename core tables for Tech9Labs domain
ALTER TABLE "Todo" RENAME TO "Entry";
ALTER TABLE "User" RENAME TO "Account";

-- Rename columns to match new domain language
ALTER TABLE "Entry" RENAME COLUMN "task" TO "title";
ALTER TABLE "Entry" RENAME COLUMN "userId" TO "accountId";

ALTER TABLE "Account" RENAME COLUMN "username" TO "email";
ALTER TABLE "Account" RENAME COLUMN "password" TO "passwordHash";

-- Update index/constraint names
ALTER INDEX "User_username_key" RENAME TO "Account_email_key";

ALTER TABLE "Entry" DROP CONSTRAINT "Todo_userId_fkey";
ALTER TABLE "Entry"
  ADD CONSTRAINT "Entry_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add contact submissions
CREATE TABLE "ContactSubmission" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "accountId" INTEGER,

  CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ContactSubmission"
  ADD CONSTRAINT "ContactSubmission_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
