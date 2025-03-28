-- AlterTable
ALTER TABLE `Export` MODIFY `purchaseDate` DATE NULL;

-- CreateTable
CREATE TABLE `ExportTrolley` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NOT NULL,

    UNIQUE INDEX `ExportTrolley_createdById_key`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExportTrolleyProduct` (
    `productId` INTEGER NOT NULL,
    `count` SMALLINT UNSIGNED NOT NULL,
    `price` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `exportTrolleyId` INTEGER NOT NULL,

    PRIMARY KEY (`exportTrolleyId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExportTrolley` ADD CONSTRAINT `ExportTrolley_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExportTrolleyProduct` ADD CONSTRAINT `ExportTrolleyProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExportTrolleyProduct` ADD CONSTRAINT `ExportTrolleyProduct_exportTrolleyId_fkey` FOREIGN KEY (`exportTrolleyId`) REFERENCES `ExportTrolley`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
