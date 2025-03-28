/*
  Warnings:

  - You are about to drop the column `createAt` on the `ProductJoinImport` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `ProductJoinImport` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `TrolleyJoinProduct` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `TrolleyJoinProduct` table. All the data in the column will be lost.
  - Made the column `vendorId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_vendorId_fkey`;

-- AlterTable
ALTER TABLE `Product` MODIFY `vendorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ProductJoinImport` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`;

-- AlterTable
ALTER TABLE `TrolleyJoinProduct` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`;

-- CreateTable
CREATE TABLE `Export` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalPrice` SMALLINT UNSIGNED NOT NULL,
    `purchaseDate` DATE NOT NULL,
    `confirmDate` DATE NULL,
    `platform` ENUM('XIANYU', 'PINDUODUO', 'TAOBAO', 'DOUYIN', 'OTHER') NULL,
    `platformOrderNo` VARCHAR(191) NULL,
    `clientId` INTEGER NULL,
    `remark` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'DELIVERY', 'FINISHED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `express` ENUM('SHUNFENG', 'ZHONGTONG', 'SHENTONG', 'YUNDA', 'OTHER') NULL,
    `expressNo` VARCHAR(191) NULL,
    `expressFee` TINYINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExportProduct` (
    `exportId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `price` SMALLINT UNSIGNED NOT NULL,
    `count` SMALLINT UNSIGNED NOT NULL,

    PRIMARY KEY (`exportId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NOT NULL,
    `remark` VARCHAR(191) NULL,
    `badGuy` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Export` ADD CONSTRAINT `Export_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Export` ADD CONSTRAINT `Export_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExportProduct` ADD CONSTRAINT `ExportProduct_exportId_fkey` FOREIGN KEY (`exportId`) REFERENCES `Export`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExportProduct` ADD CONSTRAINT `ExportProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
