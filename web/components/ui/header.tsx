import { Button } from "./button";
import { LogOut, User } from "lucide-react";
import { auth, signOut } from "@/auth";
import Image from "next/image";

const Header = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Image
          src={"/images/logo-prin-black.png"}
          width={110}
          height={110}
          alt="Logo Monexa"
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <div className="relative size-8 rounded-full overflow-hidden border border-border">
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
                <User className="size-4" />
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none">
                {user?.name || "Usuário"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/auth/login" });
            }}
          >
            <Button
              variant="outline"
              size="sm"
              type="submit"
              className="gap-1.5"
            >
              <LogOut />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
