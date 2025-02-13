"use client";

import { calculateAge } from '@/utils/utilFunctions';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SearchProfile = ({profile}) => {
    const [profilePhoto, setProfilePhoto] = useState();
    const { data: session, status } = useSession();

    const [randomNumber, setRandomNumber] = useState(null);

    const router = useRouter();

    const [thumbsUpOpen, setThumbsUpOpen] = useState(false);


  

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            const response = await axios.get(`/api/user/photos?userId=${profile.id}`)
            if(response.status === 200){
                setProfilePhoto(response.data.profilePhoto);
            }
        }

        const generateRandomNumber = () => {
            const random = Math.floor(Math.random() * (90 - 40 + 1)) + 40; // Random number between 40 and 90
            setRandomNumber(random);
        };

        fetchProfilePhoto();
        generateRandomNumber();
    }, [])


    const handleProfileView = () => {
      router.push(`/profile-view-user/${profile.id}`)
  }

  const handleThumbsUp = async () => {
    try {
        const response = await axios.post('/api/matching/shortlisted', {
            loggedInUserId : session.user.id,
            targetUserId : profile.id
        })
        if(response.status === 200){
            // removeFromNewUsers(profile.id)
            toggleThumbsUpOpen();
        }
    } catch (error) {
        console.log(error);
    }
}

const toggleThumbsUpOpen = () => setThumbsUpOpen(!thumbsUpOpen);

    // Function to generate a random number between 40 and 90
  

  return (
    <div className='bg-white border border-light_gray py-5 px-4 shadow-md w-full rounded-lg md:w-1/2 lg:w-1/3' >
        <div className='flex items-center justify-between gap-1' >
            <div className='overflow-hidden rounded-full border-2 border-us_blue w-20 h-20' >
                {profilePhoto && (
                    <Image onClick={handleProfileView} className='object-cover w-full h-full' src={profilePhoto} alt='profile' width={100} height={100}/>
                )}
            </div>
            <div>
                <h3 className='text-sm text-us_blue font-medium capitalize' >{profile.name}</h3>
                <p className='text-xs text-dark_text capitalize' >{calculateAge(profile.dob)} , {profile?.personalDetails?.maritalStatus} </p>
                <p className='text-xs text-dark_text' >{profile.city} , {profile.state}</p>
                <button onClick={toggleThumbsUpOpen} className='bg-us_blue flex items-center justify-between gap-2 text-white mt-2 px-3 py-2 text-sm rounded-lg cursor-pointer' ><StarOutlinedIcon className='text-yellow-400' /><span>Shortlist</span></button>
            </div>
            <div className='flex flex-col items-center justify-between gap-9' >
                <p className='text-green-500' >{randomNumber}%</p>
                <button className='bg-us_blue px-3 py-2 rounded-lg flex items-center cursor-pointer justify-center' >
                    <FavoriteOutlinedIcon className='text-red-500' />
                </button>
            </div>
        </div>

        {thumbsUpOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-us_blue bg-opacity-50 px-10' >
                <div className='bg-white px-6 py-12 rounded-2xl shadow-md' >
                    <p className='text-center text-dark_text text-md' >Are you sure you consider this person as
                    a prospective match?</p>
                    <div className='flex items-center justify-between mt-5' >
                        <button className='rounded-full bg-sub_text_2 text-white px-6 py-2' onClick={toggleThumbsUpOpen} >CANCEL</button>
                        <button className='rounded-full bg-us_blue text-white px-6 py-2' onClick={handleThumbsUp} >YES</button>
                    </div>
                    
                </div>
            </div>
        )}
    </div>
  )
}

export default SearchProfile
