import { IMessageOutputDto } from "../../dto/global/index.js";
import { ICreateTransactionInputDto, ITransaction, IUpdateTransactionInputDto } from "../../dto/transactions/index.js";
import { CustomError } from "../../errors/index.js";
import { prisma } from "../../lib/db.js";
import { GeralService } from "../global/index.js";

export class TransactionsService {
  async getAllTransactions(dateInitial: Date, dateFinal: Date, token: string): Promise<ITransaction[]> {
    const user = await GeralService.getUserFromToken(token);
    const transactions = await prisma.transactions.findMany({
      where: {
        date: { gte: dateInitial, lte: dateFinal },
        userId: user.userId,
      },
      orderBy: {
        date: "desc",
      },
    });
    return transactions;
  }
  async getTransactionById(transactionId: string): Promise<ITransaction> {
    const transaction = await prisma.transactions.findFirst({ where: { transactionId: transactionId } })
    if (!transaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }
    return transaction;
  }
  async createTransaction(dto: ICreateTransactionInputDto): Promise<IMessageOutputDto> {
    await prisma.transactions.create({
      data: {
        ...dto,
        createdAt: GeralService.updateCreatedAt(),
        updatedAt: GeralService.updateUpdatedAt(),
      },
    });
    return {
      message: `Transação criada com sucesso!`,
    }
  }
  async updateTransaction(dto: IUpdateTransactionInputDto): Promise<IMessageOutputDto> {
    const findTransaction = await prisma.transactions.findFirst({ where: { transactionId: dto.transactionId } })
    if (!findTransaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }
    await prisma.transactions.update({
      where: { transactionId: dto.transactionId },
      data: {
        ...dto,
        updatedAt: GeralService.updateUpdatedAt(),
      },
    });
    return {
      message: `Transação criada com sucesso!`,
    }
  }
  async deleteTransaction(transactionId: string): Promise<IMessageOutputDto> {
    const findTransaction = await prisma.transactions.findFirst({ where: { transactionId } })
    if (!findTransaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }
    await prisma.transactions.delete({ where: { transactionId } })
    return {
      message: "Transação excluída com sucesso!"
    }
  }
}