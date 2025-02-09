"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { use, useState } from 'react'
import MailLockIcon from '@mui/icons-material/MailLock';
import { set } from 'zod';
import axios from 'axios';
import { useAlert } from '@/context/AlertContext';

const ForgotPasswordPage = () => {
    const [email,setEmail] = React.useState("");
    const [errorMessage,setErrorMessage] = React.useState("");
    const [loading,setLoading] = React.useState(false);
    const [emailSendingStatus, setEmailSendingStatus] = useState(false);

    const showAlert = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            
            
            const response = await axios.post('/api/send-email', { email });
            if(response.status === 200){
                console.log(response.data);
                setEmailSendingStatus(true);
            }else{
                showAlert(response.data.error);
            }
            
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false);
        }
    }
  return (
    <main>
        <section>
            <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
                <Link href='/auth/login' className="cursor-pointer" ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
                <div className='w-full' >
                    <h1 className='text-center text-xl font-semibold text-us_blue' >Forgot Password</h1>
                </div>
            </div>
            {emailSendingStatus ? (<div className='mt-10' >
                <div className='min-h-screen bg-us_blue rounded-t-3xl w-full flex items-center justify-center' >
                    <div className='flex items-center justify-center flex-col px-5' >
                        <h1 className='text-white text-center text-[24px] font-semibold tracking-wide' >Success</h1>
                        <p className='text-white mt-5 text-center text-[16px]' >Please check your email in a few minutes for link to create a new password.</p>
                        <p className='text-white tracking-wide mt-5 text-center text-[16px] font-semibold' >{"Didn't get email?"} <span className='text-green-400 underline' onClick={() => setEmailSendingStatus(false)} >Resubmit</span></p>
                    </div>
                </div>
            </div>) : (<div className='mt-10' >
                <p className='text-center text-sub_text_2 px-5' >Enter your email address and we will send you a link to reset your password</p>
                <div className='flex items-center justify-center' >
                    <div className="input flex items-center justify-center gap-2 mt-10" >
                    <MailLockIcon className="text-sub_text_2"  />
                        <p className='text-xl text-sub_text_2' >|</p>
                        <input type='email' required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-sm placeholder:text-sm placeholder:text-sub_text_2 mt-1" />                         
                    </div>
                </div>
                <div className='flex items-center justify-end px-10 mt-5' >
                    <Link href='/auth/login' className='text-us_blue text-sm underline cursor-pointer' >Remember Password? Sign In</Link>
                </div>
                <div className='flex items-center justify-center' >
                    {errorMessage && <p className='text-red-500' >{errorMessage}</p>}
                </div>
                <div className='flex items-center justify-center' >
                    <div className='mt-20' >
                        <button type='submit' onClick={handleSubmit} className='blue-button' >{loading ? 'Sending' : 'Send'}</button>
                    </div>
                </div>
            </div>)}
        </section>
    </main>
  )
}

export default ForgotPasswordPage