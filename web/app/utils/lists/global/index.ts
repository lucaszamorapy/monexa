interface IRoute {
  name: string;
  path: string;
}


export const ROUTES: IRoute[] = [
  {
    name: "Início",
    path: "/",
  },
  {
    name: "Transações",
    path: "/transactions",
  }
]

export const CHART_COLORS: Record<string, string> = {
  orange: "#f97316",
  blue: "#3b82f6",
  yellow: "#eab308",
  indigo: "#6366f1",
  pink: "#ec4899",
  cyan: "#06b6d4",
  slate: "#64748b",
  rose: "#f43f5e",
  sky: "#0ea5e9",
  emerald: "#10b981",
  purple: "#a855f7",
};