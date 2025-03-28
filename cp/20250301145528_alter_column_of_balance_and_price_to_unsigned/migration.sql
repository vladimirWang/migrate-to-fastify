/*
  Warnings:

  - You are about to alter the column `latestPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `latestCost` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `latestCost` on the `ProductJoinImport` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `count` on the `ProductJoinImport` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to drop the column `isDel` on the `Trolley` table. All the data in the column will be lost.
  - You are about to alter the column `totalPrice` on the `Trolley` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `count` on the `TrolleyJoinProduct` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `price` on the `TrolleyJoinProduct` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `latestPrice` SMALLINT UNSIGNED NULL,
    MODIFY `latestCost` SMALLINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `ProductJoinImport` MODIFY `latestCost` SMALLINT UNSIGNED NOT NULL,
    MODIFY `count` SMALLINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Trolley` DROP COLUMN `isDel`,
    MODIFY `totalPrice` SMALLINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `TrolleyJoinProduct` MODIFY `count` SMALLINT UNSIGNED NOT NULL,
    MODIFY `price` SMALLINT UNSIGNED NOT NULL DEFAULT 0;
