"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login/signup page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/auth"); // Redirect to /login
    }, 3000);

    // Cleanup the timer to prevent memory leaks
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-screen custom-background" >
      <div className="w-full h-screen" style={{backgroundImage : 'url(/assets/welcome-img.svg)'}}>
      <div className="content" >
            <div className="flex flex-col gap-5 items-center justify-center p-10" >
                <Image src='/assets/usa-nikkah-logo.svg' alt="logo" height={200} width={200} />
                <Image src="/assets/text-logo.svg" alt="logo" height={400} width={400} />
            </div>
        </div>
      </div>
        
    </div>
  );
}
