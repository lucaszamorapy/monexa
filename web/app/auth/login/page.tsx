import {
  GalleryVerticalEndIcon,
  WalletCards,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import LoginForm from "./components/login-form";
import Link from "next/link";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            Monexa
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={<div>Carregando...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="relative hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between dark:border-l border-zinc-800">
        <div className="flex items-center gap-2 text-lg font-medium">
          <GalleryVerticalEndIcon className="size-6" />
          <span>Monexa Finance</span>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
            <div className="flex items-center gap-3 text-emerald-400 mb-2 font-medium">
              <TrendingUp className="size-5" />
              Controle Total das Suas Finanças
            </div>
            <p className="text-sm text-zinc-400">
              Acompanhe entradas, despesas, parcelamentos e tenha uma visão
              clara do seu futuro financeiro em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <ShieldCheck className="size-5 text-primary mb-2" />
              <h3 className="font-semibold text-sm">Segurança Máxima</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Sessões protegidas com tokens criptografados e renovação
                automática.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <WalletCards className="size-5 text-primary mb-2" />
              <h3 className="font-semibold text-sm">Gestão de Parcelas</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Controle intuitivo de cartões, Pix, débito e cobranças
                recorrentes.
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500">
          © 2026 Monexa. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
