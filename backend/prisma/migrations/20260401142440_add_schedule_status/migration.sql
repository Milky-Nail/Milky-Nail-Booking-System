-- CreateEnum
CREATE TYPE "schedule_status" AS ENUM ('active', 'cancelled');

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "status" "schedule_status";
