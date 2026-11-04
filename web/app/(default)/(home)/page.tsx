import { SearchParams } from "@/app/utils/types/global";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";
import HomeContent from "./components/home-content";

const HomePage = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <Suspense fallback={<Loader />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
};

export default HomePage;
