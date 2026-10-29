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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyCodeVerification } from "@/app/_actions/users";

const forgotPasswordSchema = z.object({
  code: z.string().min(1, "Insira o código de verificação."),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
interface IForgortPasswordCodeProps {
  nextStep: () => void;
  goBackStep: () => void;
  email: string;
}

const ForgotPasswordCodeVerificationForm = ({
  nextStep,
  goBackStep,
  email,
}: IForgortPasswordCodeProps) => {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const res = await verifyCodeVerification({
        email: email,
        code: Number(data.code),
      });
      if (!res.valid) return;
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
            <h2>Código de verificação</h2>
            <span className="text-muted-foreground">
              Preencha o código de verificação que enviamos a você
            </span>
          </div>

          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code">Código de verificação</FieldLabel>
                <InputOTP {...field} id="code" maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
            {form.formState.isSubmitting ? "Verificando..." : "Verificar"}
          </Button>
        </FieldGroup>
      </form>
      <Button className="w-full mt-5" variant="outline" onClick={goBackStep}>
        Voltar
      </Button>
    </div>
  );
};

export default ForgotPasswordCodeVerificationForm;
