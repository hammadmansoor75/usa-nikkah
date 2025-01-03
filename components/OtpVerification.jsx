"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useState,useEffect } from 'react'
import BackspaceIcon from '@mui/icons-material/Backspace';
import { supabase } from '@/utils/supabaseClient'
import axios from 'axios'
import { useSignupContext } from '@/providers/AccountProvider'
import { useRouter } from 'next/navigation'

const OtpVerification = ({phone}) => {
    const [otp,setOtp] = useState('');
    const [timer, setTimer] = useState(60); // Timer in seconds
    const [isTimerActive, setIsTimerActive] = useState(false);
    const router = useRouter();

    const {signupData} = useSignupContext();
    useEffect(() => {
        let interval;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false); // Stop the timer when it reaches 0
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);


    const handleOtpChange = (number) => {
        setOtp((prevOtp) => prevOtp + number);
    }

    const handleBackspace = () => {
        setOtp((prevOtp) => prevOtp.slice(0, -1));
    };

    const handleResendOtp = async () => {
        setOtp('');
        setTimer(60);
        setIsTimerActive(true);
        const { data, error } = await supabase.auth.signInWithOtp({
            phone: phone,
        })
    }

    const handleSubmit = async () => {
        if(otp.length === 6){
            const { data, error } = await supabase.auth.verifyOtp({ phone, token:otp, type: 'sms'})
            if(data){
                const response = await axios.post('/api/user/create-user', {
                    phone : phone,
                    supabaseAuthId : data.user.id,
                    name : signupData.fullName,
                    email : signupData.email,
                    city : signupData.city,
                    state : signupData.state,
                    gender : signupData.gender,
                    dob : signupData.dob,
                    profileCreatedBy : signupData.profileCreatedBy
                })
                if(response.status === 201){
                    router.push('/profile/personal-details')
                }else{
                    console.log(response.error)
                }
            }
            if(error){
                console.log(error)
            }
        }
    }

  return (
    <section>
        <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
            <Link href='/auth' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
            <div className='w-full' >
                <h1 className='text-center text-xl font-medium' >Enter OTP</h1>
            </div>
        </div>
        <div className='flex flex-col items-center justify-center mt-10' >
            <p className='text-sm text-sub_text_2 mt-5' >Type the verification code we’ve sent you.</p>
            <div className='input mt-3' >
                <input className='placeholder-sub_text_2' maxLength={6} inputMode='numeric' onChange={(e) => setOtp(e.target.value)} value={otp} placeholder='' type='text' />
            </div>

        
            <div className='flex flex-col items-center justify-center mt-5' >
                {isTimerActive ? (
                    <p className='text-sm text-sub_text_2' >Resend OTP in <strong>{timer}</strong> seconds</p>
                ) : (
                    <p className='text-us_blue underline' onClick={handleResendOtp} >Resend</p>
                )}
                <button className='blue-button mt-5' onClick={handleSubmit} >CONTINUE</button>
            </div>
        </div>
    </section>
  )
}

export default OtpVerification
