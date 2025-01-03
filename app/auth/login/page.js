"use client"
import Image from 'next/image';
import React, { useState } from 'react'

import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import OtpVerificationLogin from '@/components/OtpVerificationLogin';
import { supabase } from '@/utils/supabaseClient';

const loginSchema = z.object({
  phone : z.string()
  .nonempty({ message: "Phone number is required" })
  .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
})

const LoginPage = () => {
  const [step,setStep] = useState(1);
  const [phone , setPhone] = useState('');
  const [otpSendingLoading, setOtpSendingLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
});


const sendOtp = async (formData) => {
  try {
    setOtpSendingLoading(true)
    setPhone(formData.phone)

    const {data, error} = await supabase.auth.signInWithOtp({
      phone : formData.phone,
    })
    if(data){
        setStep(2);
    }

  }catch(error){
    console.log(error)
  }finally{
    setOtpSendingLoading(false);
  }
}

  return (
    <main>
      {step === 1 && (
        <section>
          <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
            <Link href='/auth' className="cursor-pointer" ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
              <div className='w-full' >
                <h1 className='text-center text-xl font-medium' >My Mobile</h1>
              </div>
          </div>
          
          <div className='flex items-center justify-center mt-10' >

            <form onSubmit={handleSubmit(sendOtp)} className='px-10 md:px-20' >
              <p className='text-center text-sm text-sub_text_2 mt-5'>Please enter your valid phone number. We will send you a code to verify your account. </p>

              <div className="input flex items-center justify-center gap-2 mt-10" >
                <Image src='/assets/us-flag.svg' alt='us-flag' height={40} width={40}/>
                <p className='text-xl text-sub_text_2' >|</p>
                <input {...register("phone")} placeholder="Phone Number" className="w-full text-sm placeholder:text-sm placeholder:text-sub_text_2 mt-1" />                         
              </div>

              <p className='text-sm text-center text-sub_text_2 mt-10' >By logging in, you agree with our 
                <Link href="/terms" className="text-us_blue underline"> Terms & Conditions.</Link> Learn how we process your data in our <Link href="/privacy" className="text-us_blue underline"> Privacy Policy.</Link></p>

              <div className='mt-10 flex items-center justify-center' >
                  <button className='blue-button'>CONTINUE</button>
              </div>  
            </form>
          </div>
        </section>
      )}


      {step === 2 && (
        <OtpVerificationLogin phone={phone}/>
      )}
    </main>
  )
}

export default LoginPage
