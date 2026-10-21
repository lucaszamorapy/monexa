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
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { createUser } from "@/app/_actions/auth";
import { useRouter } from "next/navigation";
import { toFormData } from "@/app/utils/functions/global";

const formSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório."),
    email: z
      .string()
      .min(1, "O e-mail é obrigatório.")
      .email("Insira um e-mail válido."),
    password: z.string().min(1, "A senha é obrigatória."),
    confirmPassword: z.string().min(1, "Confirmação de senha obrigatória."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof formSchema>;

const SignupForm = () => {
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const res = await createUser(toFormData(payload));
      toast.success(res.message);
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro ao criar a conta.");
      }
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-6"
        id="form-signup"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Crie sua conta</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Preencha o formulário abaixo para começar
            </p>
          </div>

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Seu Nome"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <PasswordInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite sua senha"
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
                  placeholder="Repita sua senha"
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
            {form.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>

          <Button asChild variant="link" className="w-full">
            <Link href="/auth/login">Já tem uma conta? Entrar</Link>
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default SignupForm;
