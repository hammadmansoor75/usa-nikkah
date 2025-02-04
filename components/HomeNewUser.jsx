"use client"

import { calculateAge } from '@/utils/utilFunctions'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const HomeNewUser = ({userProfile}) => {

    const [profilePhoto,setProfilePhoto] = useState()
    const router = useRouter();

useEffect(() => {
    const fetchProfilePhoto = async () => {
        const response = await axios.get(`/api/user/photos?userId=${userProfile.id}`)
        if(response.status === 200){
            setProfilePhoto(response.data.profilePhoto);
        }
    }
    fetchProfilePhoto();
}, [])

const handleProfileView = () => {
    router.push(`/profile-view-user/${userProfile.id}`)
}

  return (
    <div className='flex flex-col items-center justify-center mb-10' >
        <div className='overflow-hidden rounded-full border-2 border-us_blue w-20 h-20' >
            {profilePhoto && (
                <Image onClick={handleProfileView} className='object-cover w-full h-full' src={profilePhoto} alt='profile' width={100} height={100}/>
            )}
        </div>
        <h2 className='text-us_blue text-md mt-2 capitalize'  >{userProfile.name}</h2>
        <h2 className='text-us_blue text-sm capitalize ' >{userProfile.city}</h2>
    </div>
  )
}

export default HomeNewUser