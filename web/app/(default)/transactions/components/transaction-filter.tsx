"use client";

import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_PAYMENT_METHODS,
  TRANSACTION_SITUATIONS,
  TRANSACTION_TYPES,
} from "@/app/utils/lists/transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { FilterIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z
  .object({
    dateInitial: z.string().nullable().optional(),
    dateFinal: z.string().nullable().optional(),
    type: z
      .enum(TRANSACTION_TYPES as [string, ...string[]], {
        invalid_type_error: "Selecione um tipo válido.",
      })
      .nullable()
      .optional(),
    category: z
      .enum(TRANSACTION_CATEGORIES as [string, ...string[]], {
        invalid_type_error: "Selecione uma categoria válida.",
      })
      .nullable()
      .optional(),
    situation: z
      .enum(TRANSACTION_SITUATIONS as [string, ...string[]], {
        invalid_type_error: "Selecione uma situação válida.",
      })
      .nullable()
      .optional(),
    paymentMethod: z
      .enum(TRANSACTION_PAYMENT_METHODS as [string, ...string[]], {
        invalid_type_error: "Selecione um método de pagamento válido.",
      })
      .nullable()
      .optional(),
    description: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.dateInitial && data.dateFinal) {
        return new Date(data.dateInitial) <= new Date(data.dateFinal);
      }
      return true;
    },
    {
      message: "A data inicial não pode ser maior que a data final.",
      path: ["dateFinal"],
    },
  );

type FilterFormValues = z.infer<typeof formSchema>;

const TransactionFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateInitial: searchParams.get("dateInitial"),
      dateFinal: searchParams.get("dateFinal"),
      type: searchParams.get("type") ?? null,
      category: searchParams.get("category") ?? null,
      situation: searchParams.get("situation") ?? null,
      paymentMethod: searchParams.get("paymentMethod") ?? null,
      description: searchParams.get("description"),
    },
  });

  const { reset } = form;

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const onSubmit = (data: FilterFormValues) => {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const onClear = () => {
    reset();
    router.push(pathname);
  };

  return (
    <Card>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          id="form-transaction-filter"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="type">Tipo</FieldLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v === "" ? null : v)}
                    >
                      <SelectTrigger
                        id="type"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
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
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="category">Categoria</FieldLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v === "" ? null : v)}
                    >
                      <SelectTrigger
                        id="category"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
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
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v === "" ? null : v)}
                    >
                      <SelectTrigger
                        id="situation"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione a situação" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_SITUATIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
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
                name="paymentMethod"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="paymentMethod">
                      Método de pagamento
                    </FieldLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v === "" ? null : v)}
                    >
                      <SelectTrigger
                        id="paymentMethod"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_PAYMENT_METHODS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="dateInitial"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dateInitial">Data inicial</FieldLabel>
                    <DatePicker
                      {...field}
                      id="dateInitial"
                      onChange={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : null)
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="dateFinal"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dateFinal">Data final</FieldLabel>
                    <DatePicker
                      {...field}
                      onChange={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : null)
                      }
                      id="dateFinal"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Descrição</FieldLabel>
                    <Input
                      {...field}
                      id="description"
                      placeholder="Buscar por descrição (opcional)"
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="w-full sm:w-auto"
              >
                <XIcon />
                Limpar filtros
              </Button>
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                <FilterIcon />
                {form.formState.isSubmitting ? "Filtrando..." : "Filtrar"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionFilter;
