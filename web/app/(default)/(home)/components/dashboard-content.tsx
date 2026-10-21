import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  Wallet,
} from "lucide-react";

const DashboardContent = () => {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Saldo Total
            </CardTitle>
            <Wallet className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 14.850,00</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Entradas (Mês)
            </CardTitle>
            <ArrowUpCircle className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              + R$ 6.200,00
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Salários e investimentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Despesas (Mês)
            </CardTitle>
            <ArrowDownCircle className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              - R$ 2.450,80
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Moradia, alimentação, contas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Faturas & Cartões
            </CardTitle>
            <CreditCard className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.120,40</div>
            <p className="text-xs text-muted-foreground mt-1">
              Próximo vencimento em 10 dias
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardContent;
