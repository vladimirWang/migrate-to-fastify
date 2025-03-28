/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vendor` table. All the data in the column will be lost.
  - Made the column `totalPrice` on table `Trolley` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updateAt` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Trolley` MODIFY `totalPrice` SMALLINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Vendor` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;
