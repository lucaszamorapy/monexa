"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { forgotPasswordEmail } from "@/app/_actions/users";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Insira um e-mail válido."),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
interface IForgortPasswordFormProps {
  nextStep: () => void;
  setUserEmail: (email: string) => void;
}

const ForgotPasswordEmailForm = ({
  nextStep,
  setUserEmail,
}: IForgortPasswordFormProps) => {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const res = await forgotPasswordEmail(data.email);
      toast.success(res.message);
      setUserEmail(data.email);
      nextStep();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h2>Esqueci minha senha</h2>
            <span className="text-muted-foreground">
              Informe o e-mail de sua conta{" "}
              <b className="text-primary">Monexa</b> para enviarmos seu código
              de verificação
            </span>
          </div>

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  aria-invalid={fieldState.invalid}
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
            {form.formState.isSubmitting ? "Enviando..." : "Enviar"}
          </Button>

          <Button asChild variant="link" className="w-full">
            <Link href="/auth/login">Lembrou da senha? Entre agora mesmo!</Link>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default ForgotPasswordEmailForm;
