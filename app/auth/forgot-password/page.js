"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { use } from 'react'
import MailLockIcon from '@mui/icons-material/MailLock';
import { set } from 'zod';
import axios from 'axios';
import { useAlert } from '@/context/AlertContext';

const ForgotPasswordPage = () => {
    const [email,setEmail] = React.useState("");
    const [errorMessage,setErrorMessage] = React.useState("");
    const [loading,setLoading] = React.useState(false);

    const showAlert = useAlert();

    const handleSubmit = async (e) => {
        
        try{
            setLoading(true);
            e.preventDefault();
            const response = await axios.post('/api/send-email', { email });
            if(response.status === 200){
                console.log(response.data);
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
            <div className='mt-10' >
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
            </div>
        </section>
    </main>
  )
}

export default ForgotPasswordPage