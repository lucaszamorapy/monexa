"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { FilterIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z
  .object({
    dateInitial: z.string().nullable().optional(),
    dateFinal: z.string().nullable().optional(),
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

const HomeFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultValues = useMemo(() => {
    const now = new Date();
    return {
      dateInitial:
        searchParams.get("dateInitial") ??
        format(startOfMonth(now), "yyyy-MM-dd"),
      dateFinal:
        searchParams.get("dateFinal") ?? format(endOfMonth(now), "yyyy-MM-dd"),
    };
  }, [searchParams]);
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = useCallback(
    (data: FilterFormValues) => {
      const params = new URLSearchParams();

      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        }
      });

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router],
  );

  const { reset } = form;

  useEffect(() => {
    onSubmit(form.getValues());
  }, [form, onSubmit]);

  const onClear = () => {
    const now = new Date();
    const values = {
      dateInitial: format(startOfMonth(now), "yyyy-MM-dd"),
      dateFinal: format(endOfMonth(now), "yyyy-MM-dd"),
    };
    reset(values);
    onSubmit(values);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Card>
      <CardContent>
        <form
          className="flex items-center gap-4"
          id="form-home-filter"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <div className="flex items-center gap-2 lg:flex-row flex-col">
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
                {!form.formState.isSubmitting && <FilterIcon />}
                {form.formState.isSubmitting ? "Filtrando..." : "Filtrar"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomeFilter;
