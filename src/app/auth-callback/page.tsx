"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isLoading, error } = trpc.authCallBack.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
          <h3 className="font-semibold text-xl">Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    if (error.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    } else {
      console.error("Error:", error);
    }
    return null;
  }

  // Handle success state
  if (data && data.success) {
    router.push(origin ? `/${origin}` : "/dashboard");
  }

  // If none of the above conditions are met, render null or a fallback component
  return null;
};
export default Page;
