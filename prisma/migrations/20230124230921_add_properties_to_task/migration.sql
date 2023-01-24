-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "is_daily" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "trackable" BOOLEAN NOT NULL DEFAULT true;
