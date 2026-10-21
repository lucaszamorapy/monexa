"use client";

import { WalletCards, ShieldCheck, TrendingUp } from "lucide-react";
import Image from "next/image";
import ForgotPasswordSteps from "./components/forgot-password-steps";

const ForgotPasswordPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Image
          src={"/images/logo-prin-black.png"}
          width={110}
          height={110}
          alt="Logo Monexa"
        />
        <div className="flex flex-1 items-center justify-center">
          <ForgotPasswordSteps />
        </div>
      </div>

      <div className="relative hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between dark:border-l border-zinc-800">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Image
            src={"/images/logo-prin-white.png"}
            width={110}
            height={110}
            alt="Logo Monexa"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
            <TrendingUp className="size-5 text-primary mb-2" />
            <h4 className="font-semibold text-white">
              Controle Total das Suas Finanças
            </h4>
            <span className=" text-zinc-400">
              Acompanhe entradas, despesas, parcelamentos e tenha uma visão
              clara do seu futuro financeiro em tempo real.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <ShieldCheck className="size-5 text-primary mb-2" />
              <h4 className="font-semibold">Segurança Máxima</h4>
              <span className="text-zinc-400 mt-1">
                Sessões protegidas com tokens criptografados e renovação
                automática.
              </span>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <WalletCards className="size-5 text-primary mb-2" />
              <h4 className="font-semibold">Gestão de Parcelas</h4>
              <span className="text-zinc-400 mt-1">
                Controle intuitivo de cartões, Pix, débito e cobranças
                recorrentes.
              </span>
            </div>
          </div>
        </div>

        <small className="text-zinc-500">
          © 2026 Monexa. Todos os direitos reservados.
        </small>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
