import { Suspense } from "react";
import DashboardContent from "./components/dashboard-content";
import DashboardSkeleton from "@/components/ui/dashboard-skeleton";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
