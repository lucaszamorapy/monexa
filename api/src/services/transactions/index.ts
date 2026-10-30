import moment from "moment";
import { IMessageOutputDto } from "../../dto/global/index.js";
import { ICreateTransactionInputDto, IGetAllTransactionsInputDto, IPatchTransactionSituationInputDto, ITransaction, IUpdateTransactionInputDto } from "../../dto/transactions/index.js";
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
        ...(dto.description && { description: { contains: dto.description } }),
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

    const baseDate = moment(dto.date, "YYYY-MM-DD");

    await prisma.$transaction(async (tx) => {
      if (dto.installment && dto.installment > 1) {
        let transactionFatherId: string | null = null;

        for (
          let installment = 1;
          installment <= dto.installment;
          installment++
        ) {
          const installmentDate = baseDate
            .clone()
            .add(installment - 1, "months")
            .toDate();

          const transaction: ITransaction = await tx.transactions.create({
            data: {
              ...dto,
              installmentNumber: installment,
              date: installmentDate,
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
        await tx.transactions.create({
          data: {
            ...dto,
            date: baseDate.toDate(),
            userId: user.userId,
          },
        });
      }
    });

    return {
      message: "Transação criada com sucesso!",
    };
  }
  async updateTransaction(dto: IUpdateTransactionInputDto, transactionId: string): Promise<IMessageOutputDto> {
    const findTransaction = await prisma.transactions.findFirst({ where: { transactionId } })
    if (!findTransaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }


    if (findTransaction.installment) {
      let transactions: ITransaction[];

      if (!findTransaction.transactionFatherId) {
        // é o pai: ele mesmo + filhos
        transactions = await prisma.transactions.findMany({
          where: {
            OR: [
              { transactionId: findTransaction.transactionId },
              { transactionFatherId: findTransaction.transactionId },
            ],
          },
        })
      } else {
        // é filho: pai + irmãos (incluindo ele mesmo)
        transactions = await prisma.transactions.findMany({
          where: {
            OR: [
              { transactionId: findTransaction.transactionFatherId },
              { transactionFatherId: findTransaction.transactionFatherId },
            ],
          },
        })
      }

      await prisma.$transaction(async (tx) => {
        await Promise.all(
          transactions.map((transaction) =>
            tx.transactions.update({
              where: { transactionId: transaction.transactionId },
              data: {
                type: dto.type,
                category: dto.category,
                situation: transaction.transactionId === findTransaction.transactionId ? dto.situation : transaction.situation,
                description: dto.description,
              },
            })
          )
        )
      })

    } else {
      const date = moment(dto.date, "YYYY-MM-DD").toDate();
      await prisma.transactions.update({
        where: { transactionId: findTransaction.transactionId },
        data: {
          ...dto,
          date
        },
      });
    }
    return {
      message: `Transação editada com sucesso!`,
    }
  }

  async patchTransactionSituation(transactionId: string, dto: IPatchTransactionSituationInputDto): Promise<IMessageOutputDto> {
    const findTransaction = await prisma.transactions.findFirst({ where: { transactionId } })
    if (!findTransaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }
    await prisma.transactions.update({
      where: { transactionId },
      data: {
        situation: dto.situation
      }
    })
    return {
      message: `Situação da transação alterada para ${dto.situation}!`,
    }
  }

  async deleteTransaction(transactionId: string): Promise<IMessageOutputDto> {
    const findTransaction = await prisma.transactions.findFirst({ where: { transactionId } })
    if (!findTransaction) {
      throw new CustomError("Transação não encontrada", "NOT_FOUND")
    }
    if (findTransaction.installment) {
      let transactions: ITransaction[];

      if (!findTransaction.transactionFatherId) {
        // é o pai: ele mesmo + filhos
        transactions = await prisma.transactions.findMany({
          where: {
            OR: [
              { transactionId: findTransaction.transactionId },
              { transactionFatherId: findTransaction.transactionId },
            ],
          },
        })
      } else {
        // é filho: pai + irmãos (incluindo ele mesmo)
        transactions = await prisma.transactions.findMany({
          where: {
            OR: [
              { transactionId: findTransaction.transactionFatherId },
              { transactionFatherId: findTransaction.transactionFatherId },
            ],
          },
        })
      }
      await prisma.transactions.deleteMany({
        where: {
          transactionId: { in: transactions.map((t) => t.transactionId) }
        }
      })
    } else {
      await prisma.transactions.delete({ where: { transactionId } })
    }
    return {
      message: "Transação excluída com sucesso!"
    }
  }
}