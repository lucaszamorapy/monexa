"use client";

import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { PencilIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoneyInput } from "@/components/ui/money-input";
import { DatePicker } from "@/components/ui/date-picker";

import {
  createTransaction,
  getTransactionById,
  updateTransaction,
} from "@/app/_actions/transactions";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_PAYMENT_METHODS,
  TRANSACTION_SITUATIONS,
  TRANSACTION_TYPES,
} from "@/app/utils/lists/transactions";
import {
  ICreateTransactionBody,
  ITransaction,
  IUpdateTransactionBody,
} from "@/app/utils/types/transactions";
import Loader from "@/components/ui/loader";
import { toDate } from "@/app/utils/functions/global";

const formSchema = z
  .object({
    type: z.enum(["Despesa", "Entrada"] as const, {
      required_error: "O tipo de transação é obrigatório.",
      invalid_type_error: "Selecione um tipo de transação válido.",
    }),
    amount: z
      .number({
        required_error: "O valor é obrigatório.",
        invalid_type_error: "Informe um valor válido.",
      })
      .positive("O valor deve ser maior que zero."),
    category: z.enum(
      [
        "Alimentação",
        "Aluguel",
        "Contas",
        "Educação",
        "Lazer",
        "Moradia",
        "Outros",
        "Saúde",
        "Transporte",
        "Salário",
        "Investimentos",
      ] as const,
      {
        required_error: "A categoria é obrigatória.",
        invalid_type_error: "Selecione uma categoria válida.",
      },
    ),
    situation: z.enum(["Pago", "Pendente"] as const, {
      required_error: "A situação é obrigatória.",
      invalid_type_error: "Selecione uma situação válida.",
    }),
    paymentMethod: z.enum(["Pix", "Débito", "Crédito"] as const, {
      required_error: "O método de pagamento é obrigatório.",
      invalid_type_error: "Selecione um método de pagamento válido.",
    }),
    date: z.date({
      required_error: "A data é obrigatória.",
      invalid_type_error: "Selecione ou informe uma data válida.",
    }),
    isInstallment: z.boolean(),
    installment: z
      .number()
      .int("A quantidade de parcelas deve ser um número inteiro.")
      .positive("A quantidade de parcelas deve ser positiva.")
      .nullable()
      .optional(),
    description: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.isInstallment) {
        return (
          data.installment !== null &&
          data.installment !== undefined &&
          data.installment >= 2
        );
      }
      return true;
    },
    {
      message: "Informe a quantidade de parcelas (mínimo 2).",
      path: ["installment"],
    },
  );

type TransactionFormData = z.infer<typeof formSchema>;

const defaultValues: Partial<TransactionFormData> = {
  type: "Despesa",
  amount: undefined,
  category: "Alimentação",
  situation: "Pendente",
  paymentMethod: "Pix",
  date: new Date(),
  isInstallment: false,
  installment: null,
  description: null,
};

export interface ITransactionFormProps {
  transactionId?: string;
}

const TransactionForm = ({ transactionId }: ITransactionFormProps) => {
  const [fetchedTransaction, setFetchedTransaction] = useState<
    ITransaction | undefined
  >(undefined);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const disableInstallment = Boolean(
    fetchedTransaction?.transactionId && fetchedTransaction?.installment,
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const { reset } = form;

  const isInstallment = useWatch({
    control: form.control,
    name: "isInstallment",
  });

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
        setFetchedTransaction(undefined);
        reset(defaultValues as TransactionFormData);
      }
    },
    [reset],
  );

  useEffect(() => {
    if (dialogOpen && transactionId) {
      const fetchTransaction = async () => {
        try {
          setIsLoadingTransaction(true);
          const data = await getTransactionById(transactionId);
          setFetchedTransaction(data);
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
            handleOpenChange(false);
          } else {
            toast.error("Erro ao carregar dados da transação.");
          }
        } finally {
          setIsLoadingTransaction(false);
        }
      };
      fetchTransaction();
    }
  }, [transactionId, dialogOpen, handleOpenChange]);

  useEffect(() => {
    if (fetchedTransaction) {
      const isInst = Boolean(
        fetchedTransaction.installment && fetchedTransaction.installment > 1,
      );

      reset({
        type: fetchedTransaction.type,
        amount: fetchedTransaction.amount,
        category: fetchedTransaction.category,
        situation: fetchedTransaction.situation,
        paymentMethod: fetchedTransaction.paymentMethod,
        date: toDate(fetchedTransaction.date),
        isInstallment: isInst,
        installment: fetchedTransaction.installment ?? null,
        description: fetchedTransaction.description ?? null,
      });
    } else if (!transactionId) {
      reset(defaultValues as TransactionFormData);
    }
  }, [fetchedTransaction, transactionId, reset]);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const base = {
        type: data.type,
        category: data.category,
        situation: data.situation,
        paymentMethod: data.paymentMethod,
        amount: data.amount,
        installment: data.installment || null,
        date: format(data.date, "yyyy-MM-dd"),
        description: data.description || null,
      };

      const res = fetchedTransaction
        ? await updateTransaction(fetchedTransaction.transactionId, {
            ...fetchedTransaction,
            ...base,
          } as IUpdateTransactionBody)
        : await createTransaction({
            ...base,
          } as ICreateTransactionBody);

      toast.success(res.message);
      setDialogOpen(false);
      reset(defaultValues as TransactionFormData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado. Tente novamente.",
      );
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {transactionId ? (
          <Button variant="ghost" size="icon-sm" title="Editar transação">
            <PencilIcon size={14} />
          </Button>
        ) : (
          <Button>
            <PlusIcon size={14} />
            Transação
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <h2>{transactionId ? "Editar transação" : "Nova transação"}</h2>
          <span className="text-muted-foreground">
            {transactionId
              ? "Atualize as informações da transação selecionada."
              : "Preencha o formulário abaixo para criar uma transação."}
          </span>
        </DialogHeader>

        {isLoadingTransaction ? (
          <Loader />
        ) : (
          <form
            className="flex flex-col gap-6"
            id="form-transaction"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="type">Tipo</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="type"
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSACTION_TYPES.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="amount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="amount">Valor</FieldLabel>
                      <MoneyInput
                        disabled={disableInstallment}
                        {...field}
                        id="amount"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="category">Categoria</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="category"
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSACTION_CATEGORIES.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="situation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="situation">Situação</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="situation"
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSACTION_SITUATIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="paymentMethod"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="paymentMethod">
                        Método de pagamento
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="paymentMethod"
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                        >
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSACTION_PAYMENT_METHODS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="date"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="date">Data</FieldLabel>
                      <DatePicker
                        disabled={disableInstallment}
                        {...field}
                        id="date"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 border border-input/40 p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="isInstallment"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Transação parcelada?
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Habilite para registrar uma compra parcelada.
                    </p>
                  </div>
                  <Controller
                    name="isInstallment"
                    control={form.control}
                    render={({ field }) => (
                      <Switch
                        id="isInstallment"
                        disabled={disableInstallment}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) {
                            form.setValue("installment", null);
                            form.clearErrors("installment");
                          }
                        }}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="installment"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="installment">
                        Quantidade de parcelas
                      </FieldLabel>
                      <Input
                        {...field}
                        id="installment"
                        type="number"
                        placeholder={
                          isInstallment
                            ? "Mínimo 2 parcelas"
                            : "Parcelamento desativado"
                        }
                        disabled={!isInstallment || disableInstallment}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value);
                          field.onChange(val);
                        }}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Descrição</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Adicione uma descrição para esta transação (opcional)"
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      rows={3}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting
                  ? transactionId
                    ? "Salvando alterações..."
                    : "Criando transação..."
                  : transactionId
                    ? "Salvar alterações"
                    : "Criar transação"}
              </Button>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
