-- CreateEnum
CREATE TYPE "user_role_type" AS ENUM ('user', 'admin', 'technician');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "user_role_type" NOT NULL DEFAULT 'user';
