import { ShieldCheck, TrendingUp, WalletCards } from "lucide-react";
import SignupForm from "./components/signup-form";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import Image from "next/image";

const SignupPage = () => {
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
          <div className="w-full max-w-xs">
            <Suspense fallback={<Loader />}>
              <SignupForm />
            </Suspense>
          </div>
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
              Cadastre-se para gerenciar despesas, receitas, orçamentos e
              cartões em um só lugar com alta segurança.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <ShieldCheck className="size-5 text-primary mb-2" />
              <h4 className="font-semibold">Privacidade Total</h4>
              <span className="text-zinc-400 mt-1">
                Seus dados financeiros protegidos por criptografia de ponta a
                ponta.
              </span>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <WalletCards className="size-5 text-primary mb-2" />
              <h4 className="font-semibold">Organização Simples</h4>
              <span className="text-zinc-400 mt-1">
                Categorização automática e relatórios de fluxo de caixa.
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

export default SignupPage;
