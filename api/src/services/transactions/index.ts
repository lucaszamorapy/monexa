import moment from "moment";
import { IMessageOutputDto } from "../../dto/global/index.js";
import { ICreateTransactionInputDto, IGetAllTransactionsInputDto, ITransaction, IUpdateTransactionInputDto } from "../../dto/transactions/index.js";
import { CustomError } from "../../errors/index.js";
import { prisma } from "../../lib/db.js";
import { GeralService } from "../global/index.js";

export class TransactionsService {
  async getAllTransactions(token: string, dto: IGetAllTransactionsInputDto): Promise<ITransaction[]> {
    const user = await GeralService.getUserFromToken(token);
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (dto.dateInitial) {
      dateFilter.gte = moment(dto.dateInitial, "YYYY-MM-DD").toDate();
    }
    if (dto.dateFinal) {
      dateFilter.lte = moment(dto.dateFinal, "YYYY-MM-DD").toDate();
    }
    if (Object.keys(dateFilter).length > 0 && dateFilter.gte && dateFilter.lte && dateFilter.gte > dateFilter.lte) {
      throw new CustomError("A data inicial não pode ser maior que a data final", "BAD_REQUEST")
    }

    const transactions = await prisma.transactions.findMany({
      where: {
        date: dateFilter,
        userId: user.userId,
        ...(dto.type && { type: dto.type }),
        ...(dto.category && { category: dto.category }),
        ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
        ...(dto.situation && { situation: dto.situation }),
      },
      orderBy: [
        {
          date: "desc",
        },
        {
          installmentNumber: "asc",
        },
      ],
      include: {
        father: true,
        children: true,
      }
    });
    return transactions;
  }
  async getTransactionById(transactionId: string): Promise<ITransaction> {
    const transaction = await prisma.transactions.findFirst({
      where: { transactionId: transactionId }, include: {
        father: true,
        children: true,
      }
    })
    if (!transaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }
    return transaction;
  }
  async createTransaction(
    dto: ICreateTransactionInputDto,
    token: string
  ): Promise<IMessageOutputDto> {
    const user = await GeralService.getUserFromToken(token);

    const date = moment(dto.date, "YYYY-MM-DD").toDate();

    if (dto.installment && dto.installment > 1) {
      let transactionFatherId: string | null = null;

      for (
        let installment = 1;
        installment <= dto.installment;
        installment++
      ) {
        const transaction: ITransaction = await prisma.transactions.create({
          data: {
            ...dto,
            installmentNumber: installment,
            date,
            transactionFatherId,
            amount: dto.amount / dto.installment,
            totalAmountIntallment: dto.amount,
            userId: user.userId,
          },
        });
        if (installment === 1) {
          transactionFatherId = transaction.transactionId;
        }
      }
    } else {
      await prisma.transactions.create({
        data: {
          ...dto,
          date,
          userId: user.userId,
        },
      });
    }

    return {
      message: "Transação criada com sucesso!",
    };
  }
  async updateTransaction(dto: IUpdateTransactionInputDto, transactionId: string): Promise<IMessageOutputDto> {
    const findTransaction = await prisma.transactions.findFirst({ where: { transactionId } })
    if (!findTransaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }
    const date = moment(dto.date, "YYYY-MM-DD").toDate();
    await prisma.transactions.update({
      where: { transactionId: findTransaction.transactionId },
      data: {
        ...dto,
        date
      },
    });
    return {
      message: `Transação editada com sucesso!`,
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