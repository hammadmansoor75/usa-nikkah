"use client";

import { calculateAge } from '@/utils/utilFunctions';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/context/AlertContext';



const NewProfile = ({profile, removeFromNewUsers, getMatchedUsers}) => {
    const [profilePhoto, setProfilePhoto] = useState();
    const { data: session, status } = useSession();

    const {showAlert} = useAlert();
    const [maritalStatus, setMaritalStatus] = useState();

    const [randomNumber, setRandomNumber] = useState(null);


    const [user,setUser] = useState();

    const [thumbsUpOpen, setThumbsUpOpen] = useState(false);
    const [thumbsDownOpen, setThumbsDownOpen] = useState(false);

    const router = useRouter();

    const [shortlistOpen, setShortlistOpen] = useState(false);
    
    
        

  

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

    const handleThumbsUp = async () => {
        try {
            const response = await axios.post('/api/matching/prospective-match', {
                loggedInUserId : session.user.id,
                targetUserId : profile.id
            })
            if(response.status === 201){
                removeFromNewUsers(profile.id)
                toggleThumbsUpOpen();
                getMatchedUsers(session.user.id);
                showAlert("Congratulations! It's a Match. Your matches will refresh when you leave this page.")
            }else if(response.status === 200){
                removeFromNewUsers(profile.id)
                toggleThumbsUpOpen();
                showAlert("Profile has been moved to It's A Match tab for you to start communicating!")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleThumbsDown = async () => {
        removeFromNewUsers(profile.id)
        toggleThumbsDownOpen();
        showAlert("Profile has been moved to Reconsider Tab for you to take another look")
    }

    const toggleThumbsUpOpen = () => setThumbsUpOpen(!thumbsUpOpen);
    const toggleThumbsDownOpen = () => setThumbsDownOpen(!thumbsDownOpen);
    const toggleShortlistOpen = () => setShortlistOpen(!shortlistOpen);

    const handleProfileView = () => {
        router.push(`/profile-view-user/${profile.id}`)
    }


    const handleShortlist = async () => {
        try {
            const response = await axios.post('/api/matching/shortlisted', {
                loggedInUserId : session.user.id,
                targetUserId : profile.id
            })
            if(response.status === 200){
                removeFromNewUsers(profile.id)
                toggleShortlistOpen();
            }else{

            }
        } catch (error) {
            console.log(error);
        }
    }



    // Function to generate a random number between 40 and 90
  

  return (
    <div className='bg-white border border-light_gray p-5 shadow-md w-full rounded-lg md:w-1/3' >
        <div className='flex items-start justify-between' >
            <div className='overflow-hidden rounded-full border-2 border-us_blue w-20 h-20' >
                {profilePhoto && (
                    <Image onClick={handleProfileView} className='object-cover w-full h-full' src={profilePhoto} alt='profile' width={100} height={100}/>
                )}
            </div>
            <div className='flex items-start justify-start flex-col' >
                    <div>
                        <h3 className='text-sm text-us_blue font-medium capitalize' >{profile.name}</h3>
                        <p className='text-xs text-dark_text capitalize' >{calculateAge(profile.dob)} , {maritalStatus}</p>
                        <p className='text-xs text-dark_text capitalize' >{profile.city} , {profile.state}</p>
                    </div>
                    <div className='flex items-center justify-center gap-4 mt-4' >
                        <button onClick={toggleThumbsUpOpen} className='bg-us_blue flex items-center justify-between gap-2 text-white px-2 py-1 text-sm rounded-lg cursor-pointer' ><ThumbUpAltRoundedIcon /></button>
                        <button onClick={toggleThumbsDownOpen} className='bg-us_blue px-2 py-1 rounded-lg flex items-center cursor-pointer justify-center' >
                            <ThumbDownRoundedIcon className='text-white' />
                        </button>
                        <button className='bg-us_blue px-2 py-1 rounded-lg flex items-center cursor-pointer justify-center' onClick={toggleShortlistOpen} ><StarOutlinedIcon className='text-yellow-500' /></button>
                    </div>
            </div>
            <div className='' >
                <p className='text-green-500' >{randomNumber}%</p>
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

    {thumbsDownOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-us_blue bg-opacity-50 px-10' >
                <div className='bg-white px-6 py-12 rounded-2xl shadow-md' >
                    <p className='text-center text-dark_text text-md' >Are you sure you’re not interested in this profile?</p>
                    <div className='flex items-center justify-between mt-5' >
                        <button className='rounded-full bg-sub_text_2 text-white px-6 py-2' onClick={toggleThumbsDownOpen} >CANCEL</button>
                        <button className='rounded-full bg-us_blue text-white px-6 py-2' onClick={handleThumbsDown} >YES</button>
                    </div>
                    
                </div>
            </div>
        )}


    {shortlistOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-us_blue bg-opacity-50 px-10' >
                <div className='bg-white px-6 py-12 rounded-2xl shadow-md' >
                    <p className='text-center text-dark_text text-md' >Are you sure you want to shortlist this profile?</p>
                    <div className='flex items-center justify-between mt-5' >
                        <button className='rounded-full bg-sub_text_2 text-white px-6 py-2' onClick={toggleShortlistOpen} >CANCEL</button>
                        <button className='rounded-full bg-us_blue text-white px-6 py-2' onClick={handleShortlist} >YES</button>
                    </div>
                    
                </div>
            </div>
        )}
    </div>
  )
}

export default NewProfile
