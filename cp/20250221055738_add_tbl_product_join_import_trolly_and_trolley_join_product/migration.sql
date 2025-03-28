/*
  Warnings:

  - You are about to drop the column `count` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `latestCost` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `Import` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Import` DROP FOREIGN KEY `Import_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Import` DROP FOREIGN KEY `Import_vendorId_fkey`;

-- DropIndex
DROP INDEX `Import_productId_fkey` ON `Import`;

-- DropIndex
DROP INDEX `Import_vendorId_fkey` ON `Import`;

-- AlterTable
ALTER TABLE `Import` DROP COLUMN `count`,
    DROP COLUMN `latestCost`,
    DROP COLUMN `productId`,
    DROP COLUMN `vendorId`,
    ADD COLUMN `importOrderStatus` ENUM('WAITING', 'FINISHED') NOT NULL DEFAULT 'WAITING',
    ADD COLUMN `totalPrice` INTEGER NULL;

-- CreateTable
CREATE TABLE `ProductJoinImport` (
    `productId` INTEGER NOT NULL,
    `importId` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `latestCost` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `vendorId` INTEGER NULL,

    PRIMARY KEY (`productId`, `importId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trolley` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `isDel` BOOLEAN NOT NULL DEFAULT false,
    `remark` VARCHAR(191) NULL,
    `totalPrice` INTEGER NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Trolley_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrollyJoinProduct` (
    `trolleyId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`trolleyId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductJoinImport` ADD CONSTRAINT `ProductJoinImport_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductJoinImport` ADD CONSTRAINT `ProductJoinImport_importId_fkey` FOREIGN KEY (`importId`) REFERENCES `Import`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductJoinImport` ADD CONSTRAINT `ProductJoinImport_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trolley` ADD CONSTRAINT `Trolley_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrollyJoinProduct` ADD CONSTRAINT `TrollyJoinProduct_trolleyId_fkey` FOREIGN KEY (`trolleyId`) REFERENCES `Trolley`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrollyJoinProduct` ADD CONSTRAINT `TrollyJoinProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
