/*
  Warnings:

  - You are about to drop the `TrollyJoinProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TrollyJoinProduct` DROP FOREIGN KEY `TrollyJoinProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `TrollyJoinProduct` DROP FOREIGN KEY `TrollyJoinProduct_trolleyId_fkey`;

-- DropTable
DROP TABLE `TrollyJoinProduct`;

-- CreateTable
CREATE TABLE `TrolleyJoinProduct` (
    `trolleyId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`trolleyId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TrolleyJoinProduct` ADD CONSTRAINT `TrolleyJoinProduct_trolleyId_fkey` FOREIGN KEY (`trolleyId`) REFERENCES `Trolley`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrolleyJoinProduct` ADD CONSTRAINT `TrolleyJoinProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
