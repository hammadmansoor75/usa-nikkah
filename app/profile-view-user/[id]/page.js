"use client"


import UserPhotoCarousel from '@/components/UserPhotoCarasoul';
import { calculateAge } from '@/utils/utilFunctions';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NightlightRoundOutlinedIcon from '@mui/icons-material/NightlightRoundOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ChatIcon from '@mui/icons-material/Chat';

const ProfileViewUser = () => {
    
    const [loggedInUser,setLoggedInUser] = useState();

    const [user, setUser] = useState();
    const [basicDetails, setBasicDetails] = useState();
    const [personalDetails, setPersonalDetails] = useState();
    const [relegiousDetails, setReligiousDetails] = useState();
    const [partnerPrefrences, setPartnerPrefrences] = useState();
    const [photos, setPhotos] = useState();
    const [gender, setGender] = useState();
    const [userImagesArray, setUserImagesArray] = useState();

    const [personalDetailsChevron, setPersonalDetailsChevron] = useState(false);
    const [relegiousDetailsChevron, setReligiousDetailsChevron] = useState(false);
    const [partnerPrefrencesChevron,setPartnerPrefrencesChevron] = useState(false);

    const togglePersonalDetails = () => setPersonalDetailsChevron(!personalDetailsChevron);
    const toggleRelegiousDetails = () => setReligiousDetailsChevron(!relegiousDetailsChevron);
    const togglePartnerPrefrences = () => setPartnerPrefrencesChevron(!partnerPrefrencesChevron);


    useEffect(() => {
        if(typeof window !== 'undefined'){
            const urlPath = window.location.pathname;
            const idFromPath = urlPath.split("/").pop();
            if(idFromPath){
                extractUser(idFromPath)
                // setProfileId(idFromPath);
                fetchBasicDetails(idFromPath);
                fetchImages(idFromPath);
                fetchReligiousDetails(idFromPath);
                fetchPersonalDetails(idFromPath);
                fetchPartnerPrefrences(idFromPath);
            }
        }

        async function fetchBasicDetails(userId) {
            const response = await axios.get(`/api/user/create-user?userId=${userId}`)
            if (response.status === 200) {
                console.log("Relegious Details",response.data)
                setBasicDetails(response.data);
                setGender(response.data.gender)
            } else {
                console.error('Error fetching religious details:', response.error);
            }
        }

        async function fetchReligiousDetails(userId) {
            const response = await axios.get(`/api/user/add-relegious-details?userId=${userId}`)

            if (response.status === 200) {
                console.log("Relegious Details",response.data)
                setReligiousDetails(response.data);
            } else {
                console.error('Error fetching religious details:', response.error);
            }
        }

        async function fetchPersonalDetails(userId) {
            const response = await axios.get(`/api/user/add-personal-details?userId=${userId}`)

            if (response.status === 200) {
                console.log("Personal Details",response.data)
                setPersonalDetails(response.data);
            } else {
                console.error('Error fetching personal details:', response.error);
            }
        }

        async function fetchPartnerPrefrences(userId) {
            const response = await axios.get(`/api/user/add-partner-prefrence?userId=${userId}`)

            if (response.status === 200) {
                console.log("Partner Prefrences",response.data)
                setPartnerPrefrences(response.data);
            } else {
                console.error('Error fetching partner prefrences:', response.error);
            }
        }

        async function fetchBasicDetails(userId) {
            const response = await axios.get(`/api/user/create-user?userId=${userId}`)

            if (response.status === 200) {
                console.log("Basic Details",response.data)
                setBasicDetails(response.data);
            } else {
                console.error('Error fetching basic details:', response.error);
            }
        }

        async function fetchImages(userId) {
            const response = await axios.get(`/api/user/photos?userId=${userId}`)

            if (response.status === 200) {
                console.log("Images",response.data)
                setPhotos(response.data);
                const userImages = [response.data.profilePhoto, ...response.data.photos]
                console.log("User Images Array", userImages);
                setUserImagesArray(userImages)
            } else {
                console.error('Error fetching images:', response.error);
            }
        }

        async function extractUser(profileID) {
            const response = await fetch('/api/user/extract-user', {
              method: 'GET',
              credentials: 'include', // Include cookies in the request
            });
          
            if (response.ok) {
              const data = await response.json();
              console.log('User:', data);
              setLoggedInUser(data);

              console.log("Logged In User Id: ", data.id);
              console.log("Target User Id: ", profileID)

              const addProfileViewResponse = await axios.post('/api/matching/profile-view', {
                
                    loggedInUserId : data.id,
                    targetUserId : profileID
                
              })

              console.log(addProfileViewResponse.data);
              
            } else {
              console.error('Error:', await response.json());
            }
        }
    }, [])
  return (
    <main className='relative' >

        <div className='absolute top-4 left-4 z-10' >
            <Link href="/matches">
                <Image src="/assets/back-icon.svg" alt="backIcon" height={30} width={30} />
            </Link>
        </div>

        <div className='' >
            {userImagesArray && (
                <UserPhotoCarousel photos={userImagesArray} />
            )}
        </div>

        <div className="absolute top-[330px] left-1/2 transform -translate-x-1/2 flex gap-10 z-20">
        <button className="bg-white border border-gray-300 rounded-full shadow-md w-20 h-20 flex items-center justify-center transform -translate-y-1/2">
          < StarOutlinedIcon className='text-yellow-400' fontSize='large' />
        </button>
        <button className="bg-white border border-gray-300 rounded-full shadow-md w-20 h-20 flex items-center justify-center transform -translate-y-1/2">
          <FavoriteOutlinedIcon className='text-red-500' fontSize='large' />
        </button>
        <button className="bg-white border border-gray-300 rounded-full shadow-md w-20 h-20 flex items-center justify-center transform -translate-y-1/2">
          <ChatIcon className='text-us_blue' fontSize='large' />
        </button>
      </div>

        <div className='flex items-center justify-center' >
            <div className='absolute bg-white w-full min-h-96 z-10 top-[340px] mb-10 px-10 py-5 border-t border-black overflow-hidden rounded-t-[40px] !important' >
                {/* <p className='text-center text-2xl font-medium' >Your Profile</p> */}
                {/* <div className='border-b border-black mt-5' ></div> */}

                <div className='flex items-center justify-between mt-5 gap-5' >
                    <div className='' >
                        <h2 className='text-us_blue text-md font-medium' >{basicDetails?.name} , {calculateAge(basicDetails?.dob)}</h2>
                        <p className='text-dark_text text-sm' >{personalDetails?.maritalStatus}, {personalDetails?.occupation}</p>
                    </div>
                    <div className='w-1/2 flex flex-col items-end'>
                        <h2 className='text-us_blue text-md font-medium' >{personalDetails?.height}</h2>
                        {/* <p className='text-dark_text text-sm'>User ID : {basicDetails.id}</p> */}
                    </div>
                </div>

                <h2 className='text-md text-sub_text_2 font-medium mt-5' >Location</h2>
                <p className='text-dark_text text-sm' >{basicDetails?.city}, {basicDetails?.state}</p>

                <h2 className='text-md text-sub_text_2 font-medium mt-5' >About</h2>
                <p className='text-dark_text text-sm' >{personalDetails?.aboutMe}</p>

                <div className='flex items-center justify-center' >
                    <div className='mt-5 border border-light_gray flex items-center justify-between px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' >
                        <AccountCircleOutlinedIcon/>
                        <span>Personal Details</span>
                        {personalDetailsChevron ? <ExpandMoreIcon onClick={togglePersonalDetails} /> : <ExpandLessIcon onClick={togglePersonalDetails} />}
                    </div>
                </div>

                {personalDetailsChevron && (
                    <div className='mt-5' >
                        <div className='grid grid-cols-2 gap-4' >
                            <p className='text-sm text-sub_text_2' >Date of Birth</p>
                            <p className='text-dark_text text-sm' >{basicDetails?.dob}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >No of Children</p>
                            <p className='text-dark_text text-sm' >{personalDetails?.children}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Children Living Status</p>
                            <p className='text-dark_text text-sm' >{personalDetails?.childrenLiving}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Want More Kids</p>
                            <p className='text-dark_text text-sm' >{personalDetails?.moreKids}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Ethnic Background</p>
                            <p className='text-dark_text text-sm' >{personalDetails?.ethnicBackground}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Education</p>
                            <p className='text-dark_text text-sm' >{personalDetails?.education}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Occupation</p>
                            <p className='text-dark_text text-sm' >{personalDetails?.occupation}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Hobbies</p>
                            <p className='text-dark_text text-sm' >{personalDetails?.hobbies}</p>
                        </div>
                    </div>
                )}

                <div className='flex items-center justify-center' >
                    <div className='mt-5 border border-light_gray flex items-center justify-between px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' >
                        <NightlightRoundOutlinedIcon/>
                        <span>Relegious Details</span>
                        {relegiousDetailsChevron ? <ExpandMoreIcon onClick={toggleRelegiousDetails} /> : <ExpandLessIcon onClick={toggleRelegiousDetails} />}
                    </div>
                </div>

                {relegiousDetailsChevron && (
                    <div className='mt-5' >
                        <div className='grid grid-cols-2 gap-4' >
                            <p className='text-sm text-sub_text_2' >Religiosity</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.religiosity}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Prayer</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.prayer}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Revert</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.revert}</p>
                        </div>
                        {relegiousDetails?.revertDuration === '' ? <></> : <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Revert Duration</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.revertDuration}</p>
                        </div>}
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Mosque Visit</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.mosqueVisit}</p>
                        </div>
                        {gender === 'male' ? <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Smoke</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.smoke}</p>
                        </div> : <><div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Hijab</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.hijab}</p>
                        </div><div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Consider Wearing Hijab</p>
                            <p className='text-dark_text text-sm' >{relegiousDetails?.considerWearingHijab}</p>
                        </div></>}
                    </div>
                )}

                <div className='flex items-center justify-center' >
                    <div className='mt-5 border border-light_gray flex items-center justify-between px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' >
                        <SearchOutlinedIcon/>
                        <span>Partner Prefrences</span>
                        {partnerPrefrencesChevron ? <ExpandMoreIcon onClick={togglePartnerPrefrences} /> : <ExpandLessIcon onClick={togglePartnerPrefrences} />}
                    </div>
                </div>

                {partnerPrefrencesChevron && (
                    <div className='mt-5' >
                        <div className='grid grid-cols-2 gap-4' >
                            <p className='text-sm text-sub_text_2' >Age Group From</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.ageGroupFrom}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Age Group To</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.ageGroupTo}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >State</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.state}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Marital Status</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.maritalStatus}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Relegious Preference</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.religiousPreference}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Ethnicity Preference</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.ethnicityPreference}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Education Level</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.educationLevel}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Work</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.work}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Consider Someone Having Children</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.considerSomeoneHavingChildren}</p>
                        </div>
                        {gender === 'male' ? <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Hijab Preference</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.hijab}</p>
                        </div> : <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Smoke Preference</p>
                            <p className='text-dark_text text-sm' >{partnerPrefrences?.smoke}</p>
                        </div>}
                    </div>
                )}

                <div className='grid grid-cols-2 gap-4 mt-5 mb-10' >
                    <p className='text-sm text-sub_text_2' >Profile Created By</p>
                    <p className='text-dark_text text-sm' >{basicDetails?.profileCreatedBy}</p>
                </div>        
            </div>
        </div>
    </main>
  )
}

export default ProfileViewUser;
