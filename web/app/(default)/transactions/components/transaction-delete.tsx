import { deleteTransaction } from "@/app/_actions/transactions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ITransactionDeleteProps {
  transactionId: string;
}

const TransactionDelete = ({ transactionId }: ITransactionDeleteProps) => {
  const onDelete = async () => {
    try {
      const res = await deleteTransaction(transactionId);
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          category="delete"
          size="icon-sm"
          title="Excluir transação"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Certeza que deseja excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeita. A transação será excluída
            permanentemente junto com suas parcelas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" category="close">
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={onDelete}>
            <Button category="delete">Sim, excluir</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TransactionDelete;
