import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";

import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight, Github } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
// import UserAccountNav from './UserAccountNav'
// import MobileNav from './MobileNav'

const NavBar = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>SimplifyAI</span>
          </Link>
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                target="_blank"
                href="https://github.com/rohitt-gupta/chatpdf-saas"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <Github className="w-5 h-5" />
              </Link>
              <LoginLink
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Sign in
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get started <ArrowRight className="ml-1.5 h-5 w-5" />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
export default NavBar;
