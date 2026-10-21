import { Suspense } from "react";
import DashboardContent from "./components/dashboard-content";
import DashboardSkeleton from "@/components/ui/dashboard-skeleton";

const HomePage = () => {
  return (
    <>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  );
};

export default HomePage;
