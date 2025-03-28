/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Export` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `ExportTrolley` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `ExportTrolley` table. All the data in the column will be lost.
  - Added the required column `createdUserId` to the `Export` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ExportTrolley` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Export` DROP FOREIGN KEY `Export_createdBy_fkey`;

-- DropIndex
DROP INDEX `Export_createdBy_fkey` ON `Export`;

-- AlterTable
ALTER TABLE `Export` DROP COLUMN `createdBy`,
    ADD COLUMN `createdUserId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ExportTrolley` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Export` ADD CONSTRAINT `Export_createdUserId_fkey` FOREIGN KEY (`createdUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
