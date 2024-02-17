import { ReactNode } from "react"
import { cn } from "../lib/utils"

const MaxWidthWrapper=({
    className,
    children
}:{
    className?:string
    children:ReactNode
})=>{
    return(
        <div className={cn("mb-12 mt-28 sm:mt-40 flex flex-col items-center justify",className)}>
        {children}
    </div>
    )
}

export default MaxWidthWrapper