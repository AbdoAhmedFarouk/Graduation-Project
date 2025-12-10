import { notFound } from "next/navigation";

import LeftSidebar from "@/app/_components/LeftSidebar";
import RightSidebar from "@/app/_components/RightSidebar";
import DeisgnPageWrapper from "@/app/_components/Wrappers/DeisgnPageWrapper";

type Params = Promise<{ designId: string }>;

export default async function page({ params }: { params: Params }) {
  const { designId } = await params;
  if (!designId) notFound();

  return (
    <div className="h-screen relative overflow-hidden ">
      <DeisgnPageWrapper />
      <LeftSidebar />
      <RightSidebar />
    </div>
  );
}
