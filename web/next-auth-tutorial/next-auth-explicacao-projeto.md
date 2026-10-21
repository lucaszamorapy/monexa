### 🔍 Detalhamento das Camadas

#### 1. Camada de API (`web/app/api/auth/[...nextauth]`)

Localizado em [`web/app/api/auth/[...nextauth]/route.ts`](file:///c:/Projetos/monexa/web/app/api/auth/[...nextauth]/route.ts):

- **O que faz**: É a porta de entrada única (_Catch-All Route Handler_) do NextAuth v5 no App Router do Next.js.
- **Implementação**:
  ```ts
  import { handlers } from "@/auth";
  export const { GET, POST } = handlers;
  ```
- **Rotas atendidas automaticamente por esse manipulador**:
  - `GET /api/auth/csrf`: Gera e valida o token CSRF contra requisições forjadas.
  - `GET /api/auth/session`: Endpoint consultado pelo [`SessionProvider`](<file:///c:/Projetos/monexa/web/app/(global)/layout.tsx#L47>) ou hooks client-side para verificar se há usuário logado e ler a sessão atual.
  - `POST /api/auth/callback/credentials`: Recebe as credenciais enviadas por `signIn("credentials", ...)` do formulário de login, despacha para a função `authorize()` e emite o cookie de sessão criptografado.
  - `POST /api/auth/signout`: Apaga os cookies de autenticação no navegador e encerra a sessão.

---

#### 2. Configurações Centrais (`auth.config.ts` e `auth.ts`)

- [`auth.config.ts`](file:///c:/Projetos/monexa/web/auth.config.ts):
  - **`session.strategy: "jwt"`**: Todo o estado da sessão trafega criptografado em cookies seguros sem necessidade de banco de sessões no Next.js.
  - **Callback `jwt`**:
    - No login inicial, decodifica a data de expiração (`exp`) do JWT retornado pelo backend.
    - Em cada requisição subsequente, confere se o `accessToken` ainda está no prazo de validade (`Date.now() < accessTokenExpires`).
    - Se expirou, aciona [`refreshApiToken`](file:///c:/Projetos/monexa/web/app/_actions/users/index.ts#L12) silenciosamente. Em caso de falha, marca o erro `RefreshTokenError`.
  - **Callback `session`**:
    - Prepara o objeto devolvido para o front-end (`session.user.id`, `session.accessToken`).
    - **Regra de Segurança**: o `refreshToken` nunca é exposto na sessão, permanecendo restrito ao JWT no servidor.
- [`auth.ts`](file:///c:/Projetos/monexa/web/auth.ts):
  - Define o provedor **`Credentials`**.
  - O método `authorize` faz uma chamada `POST` para `users/auth/login` na API Node.js/Prisma externa (porta 8082).

---

#### 3. Proteção no Middleware (`middleware.ts`)

Localizado em [`web/middleware.ts`](file:///c:/Projetos/monexa/web/middleware.ts):

- Envolve a verificação com `export default auth((req) => { ... })`.
- **Condição de Autenticado**: `req.auth?.user` existe e não possui o erro `RefreshTokenError`.
- **Rotas Públicas (`/auth/*`)**: Se o usuário já estiver logado, redireciona para a raiz `/`.
- **Rotas Privadas**: Se o usuário não estiver logado, redireciona para `/auth/login?callbackUrl=...`.
- O `matcher` ignora arquivos estáticos e imagens, e exclui expressamente `api/auth` para permitir que o NextAuth processe suas próprias requisições sem bloqueios.

---

#### 4. Integração Cliente vs. Servidor

- **Client Components** ([`LoginForm`](file:///c:/Projetos/monexa/web/app/auth/login/components/login-form.tsx)): Dispara `signIn("credentials", { ... })` e lida com toasts de erro ou redirecionamento.
- **Server Components** ([`Header`](file:///c:/Projetos/monexa/web/components/ui/header.tsx)): Executa `await auth()` diretamente no servidor para renderizar nome, avatar e o formulário com Server Action para `signOut()`.
- **Cliente HTTP Automático** ([`Request`](file:///c:/Projetos/monexa/web/app/utils/class/api/index.ts)): Utiliza [`getServerToken()`](file:///c:/Projetos/monexa/web/app/utils/functions/auth/index.ts#L36) protegido por `AsyncLocalStorage` para injetar automaticamente o cabeçalho `Authorization: Bearer <accessToken>` em requisições feitas pelo servidor ao backend sem criar loops infinitos.
