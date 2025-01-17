"use client"

import Image from 'next/image';
import React, { useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import LockOpenIcon from '@mui/icons-material/LockOpen';


const LoginPage = () => {

  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [errorMessage,setErrorMessage] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect : false,
      email,
      password
    });

    if(res?.error){
      setErrorMessage(res.error);
    }else{
      router.push("/homepage")
    }
  }

  return (
    <main>
        <section>
          <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
            <Link href='/auth' className="cursor-pointer" ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
              <div className='w-full' >
                <h1 className='text-center text-xl font-semibold' >Login</h1>
              </div>
          </div> 
          
          <div className='flex items-center justify-center mt-10' >

            <form onSubmit={handleSubmit} className='px-10 md:px-20' >
              <p className='text-center text-sm text-sub_text_2 mt-5'>Please enter your valid phone number. We will send you a code to verify your account. </p>

              <div className="input flex items-center justify-center gap-2 mt-10" >
                <Image src='/assets/us-flag.svg' alt='us-flag' height={40} width={40}/>
                <p className='text-xl text-sub_text_2' >|</p>
                <input type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full text-sm placeholder:text-sm placeholder:text-sub_text_2 mt-1" />                         
              </div>

              <div className="input flex items-center justify-center gap-2 mt-10" >
                <LockOpenIcon />
                <p className='text-xl text-sub_text_2' >|</p>
                <input type='text' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full text-sm placeholder:text-sm placeholder:text-sub_text_2 mt-1" />                         
              </div>

              <p className='text-sm text-center text-sub_text_2 mt-10' >By logging in, you agree with our 
                <Link href="/terms" className="text-us_blue underline"> Terms & Conditions.</Link> Learn how we process your data in our <Link href="/privacy" className="text-us_blue underline"> Privacy Policy.</Link></p>

              {errorMessage && <p className='text-red-500 text-md mt-5 text-center' >{errorMessage}</p>}

              <div className='mt-10 flex items-center justify-center' >
                  <button type='submit' className='blue-button'>CONTINUE</button>
              </div>  
            </form>
          </div>
        </section>
    </main>
  )
}

export default LoginPage
