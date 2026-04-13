/*
  Warnings:

  - The values [quoted,accepted,rejected] on the enum `quote_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "quote_status_new" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'noshow');
ALTER TABLE "public"."quote_requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "quote_requests" ALTER COLUMN "status" TYPE "quote_status_new" USING ("status"::text::"quote_status_new");
ALTER TYPE "quote_status" RENAME TO "quote_status_old";
ALTER TYPE "quote_status_new" RENAME TO "quote_status";
DROP TYPE "public"."quote_status_old";
ALTER TABLE "quote_requests" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
