/*
  Warnings:

  - You are about to drop the column `importOrderStatus` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `latestCost` on the `ProductJoinImport` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `ProductJoinImport` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Import` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductJoinImport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProductJoinImport` DROP FOREIGN KEY `ProductJoinImport_vendorId_fkey`;

-- DropIndex
DROP INDEX `ProductJoinImport_vendorId_fkey` ON `ProductJoinImport`;

-- AlterTable
ALTER TABLE `Import` DROP COLUMN `importOrderStatus`,
    ADD COLUMN `confirmDate` DATE NULL,
    ADD COLUMN `importStatus` ENUM('WAITING', 'FINISHED') NOT NULL DEFAULT 'WAITING',
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ProductJoinImport` DROP COLUMN `latestCost`,
    DROP COLUMN `vendorId`,
    ADD COLUMN `price` SMALLINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `Import` ADD CONSTRAINT `Import_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
