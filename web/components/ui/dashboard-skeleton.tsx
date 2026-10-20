const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 h-16 flex items-center px-4" />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-pulse">
        <div className="h-24 bg-card rounded-xl border border-border" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-28 bg-card rounded-xl border border-border" />
          <div className="h-28 bg-card rounded-xl border border-border" />
          <div className="h-28 bg-card rounded-xl border border-border" />
          <div className="h-28 bg-card rounded-xl border border-border" />
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
