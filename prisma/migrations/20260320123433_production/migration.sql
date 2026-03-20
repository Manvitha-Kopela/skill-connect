/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Community` table. All the data in the column will be lost.
  - The primary key for the `CommunityMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `CommunityMember` table. All the data in the column will be lost.
  - The `role` column on the `CommunityMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Discussion` table. All the data in the column will be lost.
  - The primary key for the `Enrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,communityId]` on the table `CommunityMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,courseId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `CommunityMember` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Enrollment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `duration` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'SIGNUP_BONUS';
ALTER TYPE "TransactionType" ADD VALUE 'DAILY_REWARD';
ALTER TYPE "TransactionType" ADD VALUE 'PURCHASE';
ALTER TYPE "TransactionType" ADD VALUE 'REFUND';

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "updatedAt",
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "Community" DROP COLUMN "updatedAt",
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CommunityMember" DROP CONSTRAINT "CommunityMember_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'LEARNER',
ADD CONSTRAINT "CommunityMember_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "title",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_pkey",
DROP COLUMN "updatedAt",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "updatedAt",
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DEFAULT '0:00';

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
ADD COLUMN     "lastSeenAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "CommunityRole";

-- CreateTable
CREATE TABLE "DiscussionLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscussionLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionLike_userId_discussionId_key" ON "DiscussionLike"("userId", "discussionId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityMember_userId_communityId_key" ON "CommunityMember"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
