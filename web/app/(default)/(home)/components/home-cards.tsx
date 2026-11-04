import { ITransaction } from "@/app/utils/types/transactions";
import React from "react";

interface IHomeCardsProps {
  transactions: ITransaction[];
}

const HomeCards = ({ transactions }: IHomeCardsProps) => {
  return <div>{transactions.length} transações</div>;
};

export default HomeCards;
