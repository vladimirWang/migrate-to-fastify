/*
  Warnings:

  - You are about to drop the column `createdById` on the `ExportTrolley` table. All the data in the column will be lost.
  - Added the required column `createdUserId` to the `ExportTrolley` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ExportTrolley` DROP FOREIGN KEY `ExportTrolley_createdById_fkey`;

-- DropIndex
DROP INDEX `ExportTrolley_createdById_key` ON `ExportTrolley`;

-- AlterTable
ALTER TABLE `ExportTrolley` DROP COLUMN `createdById`,
    ADD COLUMN `createdUserId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ExportTrolley` ADD CONSTRAINT `ExportTrolley_createdUserId_fkey` FOREIGN KEY (`createdUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
