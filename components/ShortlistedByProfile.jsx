"use client";

import { calculateAge } from '@/utils/utilFunctions';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatIcon from '@mui/icons-material/Chat';
import { ThumbsUpIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


const ShortlistedByProfile = ({profile, removeFromShortlistedByUsers}) => {
    
    const [profilePhoto, setProfilePhoto] = useState();

    const [maritalStatus, setMaritalStatus] = useState();

    const [randomNumber, setRandomNumber] = useState(null);

    const router = useRouter();
    const [user,setUser] = useState();

    const [thumbsDownOpen, setThumbsDownOpen] = useState(false);
    
    
    const { data: session, status } = useSession();

  

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            const response = await axios.get(`/api/user/photos?userId=${profile.id}`)
            if(response.status === 200){
                setProfilePhoto(response.data.profilePhoto);
            }
        }

        const fetchMaritalStatus = async () => {
            const response = await axios.get(`/api/user/add-personal-details?userId=${profile.id}`)
            if(response.status === 200){
                setMaritalStatus(response.data.maritalStatus );
            }
        }

        const generateRandomNumber = () => {
            const random = Math.floor(Math.random() * (90 - 40 + 1)) + 40; // Random number between 40 and 90
            setRandomNumber(random);
        };

        fetchProfilePhoto();
        fetchMaritalStatus();
        generateRandomNumber();
    }, [])

    

    const toggleThumbsDownOpen = () => setThumbsDownOpen(!thumbsDownOpen);

    const handleThumbsDown = async () => {
        try {
            const response = await axios.post('/api/matching/shortlisted', {
                loggedInUserId : session.user.id,
                targetUserId : profile.id
            })
            if(response.status === 200){
                removeFromShortlistedByUsers(profile.id)
                toggleThumbsDownOpen();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleProfileView = () => {
        router.push(`/profile-view-user/${profile.id}`)
    }
    // Function to generate a random number between 40 and 90
  

  return (
    <div className='bg-white border border-light_gray p-5 shadow-md w-full rounded-lg md:w-1/2 lg:w-1/3' >
        <div className='flex items-center justify-start gap-3' >
            <div className='overflow-hidden rounded-full border-2 border-us_blue w-16 h-16' >
                {profilePhoto && (
                    <Image onClick={handleProfileView} className='object-cover w-full h-full' src={profilePhoto} alt='profile' width={100} height={100}/>
                )}
            </div>
            <div className='w-2/3' >
                <div className='flex items-center justify-between' >
                    <div>
                        <h3 className='text-sm text-us_blue font-medium' >{profile.name}</h3>
                        <p className='text-xs text-dark_text' >{calculateAge(profile.dob)} , {maritalStatus}</p>
                        <p className='text-xs text-dark_text' >{profile.city} , {profile.state}</p>
                    </div>
                    <div className='' >
                        <p className='text-green-500' >{randomNumber}%</p>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-2 mt-2' >
                    <button className='bg-us_blue flex items-center justify-between gap-2 text-white px-2 py-1 text-sm rounded-lg cursor-pointer' onClick={toggleThumbsDownOpen} ><StarOutlinedIcon className='text-yellow-400' /></button>
                    <button className='bg-us_blue px-2 py-1 rounded-lg flex items-center cursor-pointer justify-center text-white ' >
                        <ThumbDownRoundedIcon />
                    </button>
                    <button className='bg-us_blue px-2 py-1 rounded-lg flex items-center cursor-pointer justify-center text-white'  >
                        <FavoriteOutlinedIcon className='text-red-500' />
                    </button>
                    <button className='bg-us_blue flex items-center justify-between gap-2 text-white px-2 py-1 text-sm rounded-lg cursor-pointer' ><ThumbUpAltRoundedIcon /></button>
                </div>
            </div>
        </div>

        {thumbsDownOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-us_blue bg-opacity-50 px-10' >
                <div className='bg-white px-6 py-12 rounded-2xl shadow-md' >
                    <p className='text-center text-dark_text text-md' >Are you sure you consider this person as
                    a prospective match?</p>
                    <div className='flex items-center justify-between mt-5' >
                        <button className='rounded-full bg-sub_text_2 text-white px-6 py-2' onClick={toggleThumbsDownOpen} >CANCEL</button>
                        <button className='rounded-full bg-us_blue text-white px-6 py-2' onClick={handleThumbsDown} >YES</button>
                    </div>
                    
                </div>
            </div>
        )}
    </div>
  )
}

export default ShortlistedByProfile
