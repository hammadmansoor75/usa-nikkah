"use client"

import { calculateAge } from '@/utils/utilFunctions'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NightlightRoundOutlinedIcon from '@mui/icons-material/NightlightRoundOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import { useSession } from 'next-auth/react'

const AccountMainPage = () => {
    const { data: session, status } = useSession();
    const [user,setUser] = useState(null)
    const [profilePicture,setProfilePicture] = useState(null);
    const [detailedUser, setDetailedUser] = useState(null)
    const [personalDetails, setPersonalDetails] = useState(null);
  
    const router = useRouter();
    useEffect(() => {
      const getUserDetails = async () => {
        const responseImage = await axios.get(`/api/user/photos?userId=${session.user.id}`)
        if(responseImage.status === 200){
          setProfilePicture(responseImage.data.profilePhoto)
        }

        const response = await axios.get(`/api/user/create-user?userId=${session.user.id}`);
            if(response.status === 200){
                setUser(response.data);
            }else{
                console.log(response.data);
            }

        const responsePersonalDetails = await axios.get(`/api/user/add-personal-details?userId=${session.user.id}`)
        if(responsePersonalDetails.status === 200){
          setPersonalDetails(responsePersonalDetails.data);
        }
      }  

      if(status === 'authenticated' && session){
        getUserDetails();
      }
      
      
    },[status, session])

    const handleProfileView = () => {
      router.push('/account/view-profile')
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
    <section className='mb-10'>
        <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
            <Link href='/homepage' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
            <div className='w-full' >
                <h1 className='text-center text-us_blue text-xl font-semibold' >Account</h1>
            </div>
        </div>

        <div className='px-5 md:px-20' >
            <div className='flex items-center justify-center gap-5 mt-10' >
                {profilePicture && (
                    <Image src={profilePicture} className='rounded-md border-2 border-us_blue' alt='profile' height={200} width={150} />
                )}
                <div>
                    <h1 className='text-md text-us_blue font-semibold capitalize' >{user?.name}</h1>
                    <p className='text-sm text-sub_text_2 capitalize' >{user?.age} , {personalDetails?.maritalStatus}</p>
                    <p className="text-sm text-sub_text_2 capitalize" >{user?.city}</p>
                    <p className="text-sm text-sub_text_2 capitalize" >{user?.state}</p>
                    <button className='bg-us_blue text-white px-5 py-2 mt-2 rounded-full text-sm' >UPGRADE PLAN</button>
                </div>
            </div>

            <p className='text-sm text-center mt-5 text-sub_text_2' >User ID : {session?.user?.id}</p>

            <div className='flex items-center justify-center flex-col mt-5 w-full' >
                <Link href='/account/basic-details' className='border border-light_gray flex items-center justify-start px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' >
                    <BorderColorOutlinedIcon/>
                    <span className='flex items-center justify-center w-full' >Edit Basic Details</span>
                </Link>

                <Link href='/account/personal-details' className='mt-5 border border-light_gray flex items-center justify-start px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' > <AccountCircleOutlinedIcon/> <span className='flex items-center justify-center w-full' >Edit Personal Details</span></Link>

                <Link href='/account/religious-details' className='mt-5 border border-light_gray flex items-center justify-start px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' > <NightlightRoundOutlinedIcon/> <span className='flex items-center justify-center w-full' >Edit Religious Details</span></Link>

                <Link href='/account/partner-prefrences' className='mt-5 border border-light_gray flex items-center justify-start px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' > <SearchOutlinedIcon/> <span className='flex items-center justify-center w-full' >Edit Partner Prefrences</span></Link>

                <Link href='/account/photos' className='mt-5 border border-light_gray flex items-center justify-start px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' > <AddAPhotoOutlinedIcon/> <span className='flex items-center justify-center w-full' >Edit Photos & Selfie</span></Link>

                <button className='blue-button mt-10' onClick={handleProfileView} >VIEW YOUR PROFILE</button>
            </div>
        </div>
    </section>
  )
}

export default AccountMainPage
