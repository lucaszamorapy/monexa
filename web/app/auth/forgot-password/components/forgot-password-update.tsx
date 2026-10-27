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
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/app/_actions/users";

const updatePasswordSchema = z
  .object({
    password: z.string().min(1, "A senha é obrigatória."),
    confirmPassword: z.string().min(1, "Confirmação de senha obrigatória."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;

interface IForgotPasswordUpdateProps {
  email: string;
  goBackStep: () => void;
}

const ForgotPasswordUpdate = ({
  email,
  goBackStep,
}: IForgotPasswordUpdateProps) => {
  const router = useRouter();

  const form = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UpdatePasswordData) => {
    try {
      const res = await updatePassword({
        email,
        password: data.password,
      });
      toast.success(res.message);
      router.push("/auth/login");
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
            <h1>Nova senha</h1>
            <span className="text-muted-foreground">
              Digite e confirme sua nova senha abaixo
            </span>
          </div>

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Nova senha</FieldLabel>
                <PasswordInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite sua nova senha"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirmar senha
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id="confirmPassword"
                  aria-invalid={fieldState.invalid}
                  placeholder="Repita sua nova senha"
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
            {form.formState.isSubmitting ? "Alterando..." : "Alterar senha"}
          </Button>

          <Button asChild variant="link" className="w-full">
            <Link href="/auth/login">Lembrou da senha? Entre agora mesmo!</Link>
          </Button>
        </FieldGroup>
      </form>
      {goBackStep && (
        <Button className="w-full mt-5" variant="outline" onClick={goBackStep}>
          Voltar
        </Button>
      )}
    </div>
  );
};

export default ForgotPasswordUpdate;
