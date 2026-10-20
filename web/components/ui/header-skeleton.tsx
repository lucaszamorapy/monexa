import { GalleryVerticalEndIcon } from "lucide-react";

const HeaderSkeleton = () => {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Monexa</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-muted animate-pulse" />
          <div className="hidden sm:block h-8 w-28 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;
