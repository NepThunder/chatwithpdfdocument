import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { trpc } from "../_trpc/client";

const Page=async()=>{

    const router=useRouter()
    const searchParams=useSearchParams()
    const origin=searchParams.get('origin')
    // const apiResponse=await fetch('api/whatever')
    // const data=await apiResponse.json()
    const {data,isLoading}= trpc.authCallBack.useQuery(undefined);
    if (!isLoading && data && data.success) {
        router.push(origin ? `/${origin}` : '/dashboard');
    }
    
}
export default Page;