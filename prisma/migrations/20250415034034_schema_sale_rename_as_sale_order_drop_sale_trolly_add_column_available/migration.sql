-- CreateTable
CREATE TABLE `Vendor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isDel` BOOLEAN NOT NULL DEFAULT false,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `img` VARCHAR(191) NULL,

    UNIQUE INDEX `Vendor_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isDel` BOOLEAN NOT NULL DEFAULT false,
    `remark` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `purchaseDate` DATE NOT NULL,
    `totalCost` INTEGER NULL,
    `purchaseStatus` ENUM('WAITING', 'FINISHED') NOT NULL DEFAULT 'WAITING',
    `userId` INTEGER NOT NULL,
    `confirmDate` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NULL,
    `vendorId` INTEGER NOT NULL,
    `remark` VARCHAR(191) NULL,
    `balance` SMALLINT UNSIGNED NULL DEFAULT 0,
    `isDel` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `price` SMALLINT UNSIGNED NULL,
    `cost` SMALLINT UNSIGNED NULL,

    INDEX `Product_brandId_fkey`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'staff',
    `isDel` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductJoinPurchase` (
    `productId` INTEGER NOT NULL,
    `purchaseId` INTEGER NOT NULL,
    `cost` SMALLINT UNSIGNED NOT NULL,
    `count` SMALLINT UNSIGNED NOT NULL,

    PRIMARY KEY (`productId`, `purchaseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trolley` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `remark` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Trolley_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrolleyJoinProduct` (
    `trolleyId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `count` SMALLINT UNSIGNED NOT NULL,
    `cost` SMALLINT UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (`trolleyId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalPrice` SMALLINT UNSIGNED NULL,
    `purchaseDate` DATE NOT NULL,
    `confirmDate` DATE NULL,
    `platformId` INTEGER NULL,
    `platformOrderNo` VARCHAR(191) NULL,
    `clientId` INTEGER NULL,
    `remark` VARCHAR(191) NULL,
    `status` ENUM('TO_SHIP', 'TO_RECEIVE', 'CONFIRMED') NOT NULL DEFAULT 'TO_SHIP',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expressId` INTEGER NULL,
    `expressNo` VARCHAR(191) NULL,
    `expressFee` TINYINT NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleOrderJoinProduct` (
    `saleOrderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `price` SMALLINT UNSIGNED NOT NULL,
    `count` SMALLINT UNSIGNED NOT NULL,

    PRIMARY KEY (`saleOrderId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NOT NULL,
    `remark` VARCHAR(191) NULL,
    `badGuy` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Platform` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Express` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductJoinPurchase` ADD CONSTRAINT `ProductJoinPurchase_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductJoinPurchase` ADD CONSTRAINT `ProductJoinPurchase_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trolley` ADD CONSTRAINT `Trolley_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrolleyJoinProduct` ADD CONSTRAINT `TrolleyJoinProduct_trolleyId_fkey` FOREIGN KEY (`trolleyId`) REFERENCES `Trolley`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrolleyJoinProduct` ADD CONSTRAINT `TrolleyJoinProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleOrder` ADD CONSTRAINT `SaleOrder_platformId_fkey` FOREIGN KEY (`platformId`) REFERENCES `Platform`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleOrder` ADD CONSTRAINT `SaleOrder_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleOrder` ADD CONSTRAINT `SaleOrder_expressId_fkey` FOREIGN KEY (`expressId`) REFERENCES `Express`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleOrder` ADD CONSTRAINT `SaleOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleOrderJoinProduct` ADD CONSTRAINT `SaleOrderJoinProduct_saleOrderId_fkey` FOREIGN KEY (`saleOrderId`) REFERENCES `SaleOrder`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `SaleOrderJoinProduct` ADD CONSTRAINT `SaleOrderJoinProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
