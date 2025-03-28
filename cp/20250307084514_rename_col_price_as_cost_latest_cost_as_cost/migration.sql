/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `latestCost` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `latestPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ProductJoinImport` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Trolley` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `TrolleyJoinProduct` table. All the data in the column will be lost.
  - Added the required column `cost` to the `ProductJoinImport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `Trolley` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Import` DROP COLUMN `totalPrice`,
    ADD COLUMN `totalCost` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `latestCost`,
    DROP COLUMN `latestPrice`,
    ADD COLUMN `cost` SMALLINT UNSIGNED NULL,
    ADD COLUMN `price` SMALLINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `ProductJoinImport` DROP COLUMN `price`,
    ADD COLUMN `cost` SMALLINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Trolley` DROP COLUMN `totalPrice`,
    ADD COLUMN `totalCost` SMALLINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `TrolleyJoinProduct` DROP COLUMN `price`,
    ADD COLUMN `cost` SMALLINT UNSIGNED NOT NULL DEFAULT 0;
