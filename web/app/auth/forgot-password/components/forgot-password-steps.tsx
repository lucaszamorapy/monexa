import Loader from "@/components/ui/loader";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { cn } from "cn";
import { Suspense, useState } from "react";
import ForgotPasswordEmailForm from "./forgot-password-email-form";
import ForgotPasswordCodeVerificationForm from "./forgot-password-code-verification-form";
import ForgotPasswordUpdate from "./forgot-password-update";

const steps = [
  {
    id: "sendEmail",
    title: "Envio de código de verificação",
    description: "Informe seu e-mail abaixo",
  },
  {
    id: "codeVerification",
    title: "Código de verificação",
    description: "Preencha o código de verificação abaixo",
  },
  {
    id: "updatePassword",
    title: "Nova senha",
    description: "Digite sua nova senha",
  },
];

const ForgotPasswordSteps = () => {
  const [current, setCurrent] = useState(steps[0].id);
  const [submitted, setSubmitted] = useState(false);
  const [validSteps, setValidSteps] = useState<Record<string, boolean>>({});
  const [userEmail, setUserEmail] = useState<string>("");

  const currentIndex = steps.findIndex((s) => s.id === current);
  const goNext = () => {
    setCurrent(steps[Math.min(currentIndex + 1, steps.length - 1)].id);
  };
  const goBack = () => {
    setCurrent(steps[Math.max(currentIndex - 1, 0)].id);
  };

  const isCurrentValid = !!validSteps[current];
  return (
    <Stepper
      steps={steps}
      value={current}
      onValueChange={(v) => {
        if (submitted) return;
        if (!isCurrentValid && v !== current) return;
        setCurrent(v);
      }}
      className="flex flex-col items-center justify-center gap-6"
      orientation="horizontal"
    >
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem key={index} stepId={step.id} className="relative flex-1">
            <StepperTrigger
              className={cn(
                "flex flex-col gap-2.5",
                submitted || !isCurrentValid ? "pointer-events-none" : "",
              )}
              aria-disabled={submitted || !isCurrentValid}
            >
              <StepperIndicator
                className={
                  submitted
                    ? "group-data-[state=active]/step:ring-green-600/40 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-600 data-[state=completed]:bg-green-600/20 data-[state=completed]:text-green-600 dark:group-data-[state=active]/step:ring-green-400/40 dark:data-[state=completed]:bg-green-400/20 dark:data-[state=completed]:text-green-400"
                    : ""
                }
              >
                {index + 1}
              </StepperIndicator>
              <StepperTitle
                className={`${submitted ? "text-muted-foreground" : ""}`}
              >
                {step.title}
              </StepperTitle>
            </StepperTrigger>
            {steps.length > index + 1 && (
              <StepperSeparator
                className={cn(
                  "absolute inset-x-0 top-2 right-[calc(-50%+18px)] left-[calc(50%+18px)]",
                  submitted
                    ? "group-data-[state=completed]/step:bg-green-600/20 dark:group-data-[state=completed]/step:bg-green-400/20"
                    : "",
                )}
              />
            )}
          </StepperItem>
        ))}
      </StepperNav>
      <StepperPanel>
        {steps.map((step) => (
          <StepperContent key={step.id} value={step.id}>
            {step.id === "sendEmail" && (
              <div className="flex flex-1 mt-5 items-center justify-center">
                <div className="w-full max-w-xs">
                  <Suspense fallback={<Loader />}>
                    <ForgotPasswordEmailForm
                      nextStep={() => goNext()}
                      setUserEmail={(email: string) => setUserEmail(email)}
                    />
                  </Suspense>
                </div>
              </div>
            )}
            {step.id === "codeVerification" && (
              <div className="flex flex-1 mt-5 items-center justify-center">
                <div className="w-full max-w-xs">
                  <Suspense fallback={<Loader />}>
                    <ForgotPasswordCodeVerificationForm
                      nextStep={() => goNext()}
                      goBackStep={() => goBack()}
                      email={userEmail}
                    />
                  </Suspense>
                </div>
              </div>
            )}
            {step.id === "updatePassword" && (
              <div className="flex flex-1 mt-5 items-center justify-center">
                <div className="w-full max-w-xs">
                  <Suspense fallback={<Loader />}>
                    <ForgotPasswordUpdate
                      email={userEmail}
                      goBackStep={() => goBack()}
                    />
                  </Suspense>
                </div>
              </div>
            )}
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  );
};

export default ForgotPasswordSteps;
