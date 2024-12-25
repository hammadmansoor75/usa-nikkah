"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AuthPage = () => {
  return (
    <div className="w-full custom-background" >
        <div className='content flex items-center justify-center flex-col' >
            <div className="flex flex-col gap-2 items-center justify-center" >
                <Image src='/assets/usa-nikkah-logo.svg' alt="logo" height={100} width={100} />
                <Image src="/assets/text-logo.svg" alt="logo" height={200} width={200} />
            </div>
            <div className='mt-5' >
                <Image src='/assets/login-image.svg' alt='loginImage' height={300} width={300} />
            </div>
            <div className='flex flex-col items-center justify-center gap-2 mt-5' >
                <Link href='/auth/login' ><button className='blue-button flex items-center justify-center gap-4 ' ><PhoneAndroidIcon />LOGIN WITH PHONE</button></Link>
                <Link href='/auth/signup' ><button className='white-button flex items-center justify-center gap-4' ><AccountCircleIcon />NO ACCOUNT? SIGNUP</button></Link>
            </div>
            <div className='flex items-center justify-between mt-5 w-full md:w-1/3 px-10' >
                <Link href='terms' className='text-us_blue underline' >Terms & Conditions</Link>
                <Link href='privacy' className='text-us_blue underline' >Privacy Policy</Link>
            </div>
        </div>
    </div>
  )
}

export default AuthPage;
