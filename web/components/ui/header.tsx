import { Button } from "./button";
import { LogOut, Menu, User, X } from "lucide-react";
import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/app/utils/lists/global";

const Header = async () => {
  const session = await auth();
  const user = session?.user;

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/auth/login" });
  };

  const avatar = user?.image ? (
    <div className="relative size-8 shrink-0 rounded-full overflow-hidden border border-border">
      <Image
        src={user.image}
        alt={user.name || "Avatar"}
        fill
        className="object-cover"
      />
    </div>
  ) : (
    <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
      <User className="size-4" />
    </div>
  );

  const userText = (
    <>
      <p className="text-xs font-semibold leading-none truncate">
        {user?.name || "Usuário"}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
        {user?.email}
      </p>
    </>
  );

  const signOutForm = (
    <form action={handleSignOut}>
      <Button variant="outline" type="submit" className="gap-1.5">
        <LogOut />
        Sair
      </Button>
    </form>
  );

  return (
    <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Image
          src={"/images/logo-prin-black.png"}
          width={110}
          height={110}
          alt="Logo Monexa"
        />

        <ul className="hidden md:flex items-center gap-6">
          {ROUTES.map((r) => (
            <li key={r.path}>
              <Link
                href={r.path}
                className="relative py-1 text-sm font-medium uppercase tracking-wide text-primary/70 transition-colors duration-200 hover:text-primary focus-visible:text-primary focus-visible:outline-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:transition-none motion-reduce:after:transition-none"
              >
                {r.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {avatar}
            <div className="hidden lg:block text-left min-w-0">{userText}</div>
          </div>
          {signOutForm}
        </div>

        <input id="menu-toggle" type="checkbox" className="peer sr-only" />

        <label
          htmlFor="menu-toggle"
          className="md:hidden inline-flex size-10 cursor-pointer items-center justify-center rounded-md text-primary transition-colors hover:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-checked:[&_.icon-menu]:hidden peer-checked:[&_.icon-close]:block"
        >
          <span className="sr-only">Abrir ou fechar menu</span>
          <Menu className="icon-menu size-5" />
          <X className="icon-close hidden size-5" />
        </label>

        <div className="md:hidden invisible absolute inset-x-0 top-full grid grid-rows-[0fr] border-b border-border bg-card/95 backdrop-blur transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none peer-checked:visible peer-checked:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <ul className="flex flex-col gap-1">
                {ROUTES.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      className="block rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide text-primary/70 transition-colors duration-200 hover:bg-accent hover:text-primary focus-visible:bg-accent focus-visible:text-primary focus-visible:outline-none"
                    >
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-3 min-w-0">
                  {avatar}
                  <div className="text-left min-w-0">{userText}</div>
                </div>
                {signOutForm}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
