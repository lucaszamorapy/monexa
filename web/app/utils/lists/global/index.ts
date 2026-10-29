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