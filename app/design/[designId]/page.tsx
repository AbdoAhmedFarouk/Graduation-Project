import { notFound } from "next/navigation";

import RightSidebar from "@/app/_components/Panels/RightSidebar";
import DeisgnPageWrapper from "@/app/_components/Wrappers/DeisgnPageWrapper";
import LeftSidebar from "@/app/_components/Panels/LeftSidebar";

type Params = Promise<{ designId: string }>;

export default async function page({ params }: { params: Params }) {
  const { designId } = await params;
  if (!designId) notFound();

  return (
    <div className="h-screen relative overflow-hidden">
      <DeisgnPageWrapper />
      <LeftSidebar />
      <RightSidebar />
    </div>
  );
}
