"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomToggle from '@/components/CustomToggle';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/context/AlertContext';
import { ClipLoader } from 'react-spinners';

const SettingsPage = () => {

    const router = useRouter();

    const { data: session, status } = useSession();
    const {showAlert} = useAlert();


    const [toggleDelete, setToggleDelete] = useState(false)

    const handleToggleDelete = () => setToggleDelete(!toggleDelete);

    const handleAccountRedirect = () => {
        redirect('/account')
    }

    const handleLogout = () => {
        router.push('/auth')
    }


    const handleDeleteAccount = async () => {
        try {
            
            const response = await axios.delete(`/api/user/create-user?userId=${session?.user?.id}`)
            if(response.status == 200){
                showAlert('Account Deleted')
                router.push('/auth')
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (status === "loading") {
        return (
          <div className="flex items-center justify-center">
            <ClipLoader size={50} />
          </div>
        );
      }
    
      if (!session) {
        router.push("/auth");
      }

  return (
    <section className='mb-10 pb-10' >
        <div className='flex md:hidden' >
            <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
                <Link href='/homepage' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
                <div className='w-full' >
                    <h1 className='text-center text-us_blue text-xl font-semibold' >Settings</h1>
                </div>
            </div>
        </div>

        <div className='px-10 md:px-20' >
            <div className='flex items-center justify-center' >
                <button onClick={handleToggleDelete} className='mt-5 w-[300px] h-[48px] border border-light_gray rounded-[15px] flex items-center justify-between px-5' >
                    <span className='text-dark_text text-[16px]' >Delete Account</span>
                    <Image src='/assets/delete-icon.svg' alt='delete-icon' height={20} width={20} />
                </button>
            </div>

            <div className='mt-5' >
                <h2 className='text-[14px] text-us_blue font-semibold' >Help & Support</h2>
            </div>

            <div className='flex items-center justify-center' >
                <div className='mt-5 w-[300px] border border-light_gray rounded-[15px] px-5 py-3' >
                    <div className='flex items-center justify-between' >
                        <span className='text-dark_text text-[16px]' >About</span>
                        <span className='text-dark_text text-[13px]' >Version 1.1</span>
                    </div>
                    <div className='flex items-center justify-between mt-2' >
                        <span className='text-dark_text text-[16px]' >Rate App</span>
                        <span className='text-dark_text text-[13px]' ><ChevronRightIcon /></span>
                    </div>
                    <div className='flex items-center justify-between mt-2' >
                        <span className='text-dark_text text-[16px]' >Contact Us</span>
                        <span className='text-dark_text text-[13px]' ><ChevronRightIcon /></span>
                    </div>
                </div>
            </div>


            <div className='mt-5' >
                <h2 className='text-[14px] text-us_blue font-semibold' >Legal Notices</h2>
            </div>

            <div className='flex items-center justify-center' >
                <div className='mt-5 w-[300px] border border-light_gray rounded-[15px] px-5 py-3' >
                    <div className='flex items-center justify-between' >
                        <span className='text-dark_text text-[16px]' >Privacy Policy</span>
                        <span className='text-dark_text text-[13px]' ><ChevronRightIcon /></span>
                    </div>
                    <div className='flex items-center justify-between mt-2' >
                        <span className='text-dark_text text-[16px]' >Terms & Conditions</span>
                        <span className='text-dark_text text-[13px]' ><ChevronRightIcon /></span>
                    </div>
                    <div className='flex items-center justify-between mt-2' >
                        <span className='text-dark_text text-[16px]' >Safety Tips</span>
                        <span className='text-dark_text text-[13px]' ><ChevronRightIcon /></span>
                    </div>
                </div>
            </div>


            <div className='mt-5' >
                <h2 className='text-[14px] text-us_blue font-semibold' >Alert Settings</h2>
            </div>


            <div className='flex items-center justify-center' >
                <div className='mt-5 w-[300px] border border-light_gray rounded-[15px] px-5 py-3' >
                    <div className='flex items-center justify-between' >
                        <span className='text-dark_text text-[16px]' >New Matches</span>
                        <CustomToggle />
                    </div>
                    <div className='flex items-center justify-between mt-2' >
                        <span className='text-dark_text text-[16px]' >Shortlist</span>
                        <CustomToggle /> 
                    </div>
                    <div className='flex items-center justify-between mt-2' >
                        <span className='text-dark_text text-[16px]' >Messages</span>
                        <CustomToggle /> 
                    </div>
                    <div className='flex items-center justify-between mt-2' >
                        <span className='text-dark_text text-[16px]' >Profile Views</span>
                        <CustomToggle /> 
                    </div>
                </div>
            </div>


            <div className='flex items-center justify-center' >
                <div className='mt-5 w-[300px] border border-light_gray rounded-[15px] px-5 py-3' >
                    <div className='flex items-center justify-between' >
                    <span className='text-dark_text text-[16px]' >Freeze Account</span>
                    <CustomToggle /> 
                    </div>
                    <p className='text-dark_text text-[11px] mt-1' >Temporarily put your profile invisible to all others without losing your data.</p>
                </div>
            </div>


            <div className='flex items-center justify-center' >
                <div className='mt-7 w-[300px] border border-us_red rounded-[15px] h-[48px] px-5 py-2' >
                    <div className='flex items-center justify-between' >
                        <div className='flex items-center justify-start gap-4' >
                            <Image src='/assets/membership-icon.svg' alt='membership-icon' height={20} width={20} />
                            <h2 className='text-us_red text-[18px] font-medium' >Membership</h2>
                        </div>
                        <span className='text-us_red' ><ChevronRightIcon /></span>
                    </div>
                </div>
            </div>


            <div className='flex items-center justify-center' >
                <div onClick={handleLogout} className='mt-7 w-[300px] border border-light_gray bg-light_gray bg-opacity-40 rounded-[15px] px-5 py-2 h-[48px] flex items-center justify-between' >
                    <span className='text-dark_text text-[16px]' >Logout</span>
                    <Image src='/assets/logout-icon.svg' alt='logout-icon' height={20} width={20} />
                </div>
            </div>

            <div className='flex items-center justify-center' >
                <div className='flex items-center justify-center w-[300px] mb-5' onClick={handleAccountRedirect} >
                    <button className='mt-7 w-full  h-[48px] border border-light_gray rounded-[15px] flex items-center justify-between px-5' >
                        <span className='text-dark_text text-[16px]' >Account</span>
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>


        {toggleDelete && (
                <div className='fixed inset-0 flex items-center justify-center bg-us_blue bg-opacity-50 px-10' >
                <div className='bg-white px-6 py-12 rounded-2xl shadow-md' >
                    <p className='text-center text-dark_text text-md' >Are you sure you want to delete your account?. This action is irreversible.</p>
                    <div className='flex items-center justify-between mt-5' >
                        <button className='rounded-full bg-sub_text_2 text-white px-6 py-2' onClick={handleToggleDelete} >CANCEL</button>
                        <button className='rounded-full bg-us_blue text-white px-6 py-2' onClick={handleDeleteAccount} >YES</button>
                    </div>
                    
                </div>
            </div>
        )}


    </section>
  )
}

export default SettingsPage