-- AlterTable
ALTER TABLE `users` MODIFY `expirationAt` DATETIME(3) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Transactions` (
    `transactionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('Despesa', 'Entrada') NOT NULL,
    `category` ENUM('Alimentação', 'Aluguel', 'Contas', 'Educação', 'Lazer', 'Moradia', 'Outros', 'Saúde', 'Transporte', 'Salário', 'Investimentos') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATE NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
