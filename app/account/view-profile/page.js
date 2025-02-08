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
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';

const ViewProfilePage = () => {

    const {data : session, status} = useSession();

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
        
        

        const getBasicDetails = async () => {
            const response = await axios.get(`/api/user/create-user?userId=${session.user.id}`);
            if(response.status === 200){
                setUser(response.data);
            }else{
                console.log(response.data);
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

        if(status === 'authenticated' && session){
            setGender(session.user.gender);
            getBasicDetails()
            fetchBasicDetails(session.user.id);
            fetchImages(session.user.id);
            fetchReligiousDetails(session.user.id);
            fetchPersonalDetails(session.user.id);
            fetchPartnerPrefrences(session.user.id);
        }
        
    }, [status, session]);

    if(status === 'loading'){
        return <div className='flex items-center justify-center' >
            <ClipLoader size={50} />
        </div>
    }
    
    if(!session){
        router.push('/auth')
    }
  return (
    <main className='relative' >

        <div className='absolute top-4 left-8 z-10' >
            <Link href="/account">
                <Image src="/assets/back-icon.svg" alt="backIcon" height={30} width={30} />
            </Link>
        </div>

        
        <div className='' >
                {userImagesArray && (
                    <UserPhotoCarousel photos={userImagesArray} />
                )}
            </div>

        <div className='flex items-center justify-center' >
            <div className='absolute bg-white w-full min-h-96 z-10 top-[350px] rounded-t-[50px] mb-10 px-7 py-5' >
                <p className='text-center text-2xl text-us_blue font-semibold' >Your Profile</p>
                <div className='border-b border-black mt-2' ></div>

                <div className='flex items-center justify-between mt-5 gap-5' >
                    <div className='' >
                        <h2 className='text-us_blue text-md font-medium capitalize' >{basicDetails?.name} , {calculateAge(basicDetails?.dob)}</h2>
                        <p className='text-dark_text text-sm capitalize' >{personalDetails?.maritalStatus}, {personalDetails?.occupation}</p>
                    </div>
                    <div className='w-1/2 flex flex-col items-end'>
                        <h2 className='text-us_blue text-md font-medium flex items-baseline justify-center gap-2' ><Image src='/assets/height.svg' alt='height' height={18} width={9} />{personalDetails?.height}</h2>
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
                            <p className='text-dark_text text-sm capitalize' >{personalDetails?.children}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Children Living Status</p>
                            <p className='text-dark_text text-sm capitalize' >{personalDetails?.childrenLiving}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Want More Kids</p>
                            <p className='text-dark_text text-sm capitalize' >{personalDetails?.moreKids}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Ethnic Background</p>
                            <p className='text-dark_text text-sm capitalize' >{personalDetails?.ethnicBackground}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Education</p>
                            <p className='text-dark_text text-sm capitalize' >{personalDetails?.education}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Occupation</p>
                            <p className='text-dark_text text-sm capitalize' >{personalDetails?.occupation}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Hobbies</p>
                            <p className='text-dark_text text-sm capitalize' >{personalDetails?.hobbies}</p>
                        </div>
                    </div>
                )}

                <div className='flex items-center justify-center' >
                    <div className='mt-5 border border-light_gray flex items-center justify-between px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' >
                        <NightlightRoundOutlinedIcon/>
                        <span>Religious Details</span>
                        {personalDetailsChevron ? <ExpandMoreIcon onClick={togglePersonalDetails} /> : <ExpandLessIcon onClick={togglePersonalDetails} />}
                    </div>
                </div>

                {personalDetailsChevron && (
                    <div className='mt-5' >
                        <div className='grid grid-cols-2 gap-4' >
                            <p className='text-sm text-sub_text_2' >Religiosity</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.religiosity}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Prayer</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.prayer}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Revert</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.revert}</p>
                        </div>
                        {relegiousDetails?.revertDuration === '' ? <></> : <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Revert Duration</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.revertDuration}</p>
                        </div>}
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Mosque Visit</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.mosqueVisit}</p>
                        </div>
                        {gender === 'male' ? <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Smoke</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.smoke}</p>
                        </div> : <><div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Hijab</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.hijab}</p>
                        </div><div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Consider Wearing Hijab</p>
                            <p className='text-dark_text text-sm capitalize' >{relegiousDetails?.considerWearingHijab}</p>
                        </div></>}
                    </div>
                )}

                <div className='flex items-center justify-center' >
                    <div className='mt-5 border border-light_gray flex items-center justify-between px-5 py-3 text-us_blue text-md rounded-md w-full md:w-1/2' >
                        <SearchOutlinedIcon/>
                        <span>Partner Preferences</span>
                        {personalDetailsChevron ? <ExpandMoreIcon onClick={togglePersonalDetails} /> : <ExpandLessIcon onClick={togglePersonalDetails} />}
                    </div>
                </div>

                {personalDetailsChevron && (
                    <div className='mt-5' >
                        <div className='grid grid-cols-2 gap-4' >
                            <p className='text-sm text-sub_text_2' >Age Group From</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.ageGroupFrom}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Age Group To</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.ageGroupTo}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >State</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.state}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Marital Status</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.maritalStatus}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Relegious Preference</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.religiousPreference}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Ethnicity Preference</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.ethnicityPreference}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Education Level</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.educationLevel}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Work</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.work}</p>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Consider Someone Having Children</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.considerSomeoneHavingChildren}</p>
                        </div>
                        {gender === 'male' ? <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Hijab Preference</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.hijab}</p>
                        </div> : <div className='grid grid-cols-2 gap-4 mt-2' >
                            <p className='text-sm text-sub_text_2' >Smoke Preference</p>
                            <p className='text-dark_text text-sm capitalize' >{partnerPrefrences?.smoke}</p>
                        </div>}
                    </div>
                )}

                <div className='grid grid-cols-2 gap-4 mt-5 mb-10' >
                    <p className='text-sm text-sub_text_2' >Profile Created By</p>
                    <p className='text-dark_text text-sm capitalize' >{basicDetails?.profileCreatedBy}</p>
                </div>        
            </div>
        </div>
    </main>
  )
}

export default ViewProfilePage