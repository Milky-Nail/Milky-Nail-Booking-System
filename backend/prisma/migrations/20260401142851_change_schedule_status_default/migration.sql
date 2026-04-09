/*
  Warnings:

  - Made the column `status` on table `schedules` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';
