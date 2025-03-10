/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "instrument" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);
