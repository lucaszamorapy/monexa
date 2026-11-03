import { updateTrasactionSituation } from "@/app/_actions/transactions";
import { TransactionSituation } from "@/app/utils/types/transactions";
import { Button } from "@/components/ui/button";
import { BanknoteCheckIcon, BanknoteXIcon } from "lucide-react";
import { toast } from "sonner";

interface ITransactionUpdateSituationProps {
  transactionId: string;
  situation: TransactionSituation;
}

const TransactionUpdateSituation = ({
  transactionId,
  situation,
}: ITransactionUpdateSituationProps) => {
  const situationText = situation === "Pago" ? "Pendente" : "Pago";
  const onUpdateSituation = async () => {
    try {
      const res = await updateTrasactionSituation(transactionId, {
        situation: situationText,
      });
      toast.success(res.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado. Tente novamente.",
      );
    }
  };
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      title={`Atualizar situação da transação para ${situationText}`}
      onClick={onUpdateSituation}
    >
      {situation === "Pago" ? (
        <BanknoteXIcon size={14} className="text-red-500" />
      ) : (
        <BanknoteCheckIcon size={14} className="text-green-500" />
      )}
    </Button>
  );
};

export default TransactionUpdateSituation;
