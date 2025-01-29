"use client"

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {redirect, useRouter} from 'next/navigation'
import HomeNewUser from '@/components/HomeNewUser';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import HomeMatchedUser from '@/components/HomeMatchedUser'
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';

const HomePage = () => {
  const { data: session, status } = useSession();
  
  const [user,setUser] = useState(null)
  const [profilePicture,setProfilePicture] = useState(null);

  const [matchedUsers, setMatchedUsers] = useState([]);
  const [shortlistedByUsers, setShortlistedByUsers] = useState([]);

  const [shortlistedUsers,setShortlistedUsers] = useState();

  const [profileViews, setProfileViews] = useState([])
  const [newUsers,setNewUsers] = useState();

  const router = useRouter();

  useEffect(() => {
    
    const getMatchedUsers = async (userId) => {
      try {
          const response = await axios.get(`/api/matching/matched-users?userId=${userId}`);
          console.log("MATCHED USERS: ", response.data.matchedUsers );
          setMatchedUsers(response.data.matchedUsers)

      } catch (error) {
          console.log("MATCHED USERS ERROR:",error);
      } finally {
         
      }
  }


  const getShortlistedUsers = async () => {
    try {
        const response = await axios.get(`/api/matching/shortlisted-by?userId=${session.user.id}`);
        console.log("SHORTLISTED USERS: ", response.data.shortlistedUsers );
        setShortlistedUsers(response.data.shortlistedBy)

    } catch (error) {
        console.log("SHORTLISTED USERS ERROR:",error);
    } finally {
       
    }
}

  
    
  const getShortlistedByUsers = async () => {
    try {
        const response = await axios.get(`/api/matching/shortlisted-by?userId=${session.user.id}`);
        console.log("SHORTLISTED BY USERS: ", response.data.shortlistedBy );
        setShortlistedByUsers(response.data.shortlistedBy)

    } catch (error) {
        console.log("SHORTLISTED BY USERS ERROR:",error);
    } finally {
       
    }
}

const getProfileViews = async () => {
  try {
      const response = await axios.get(`/api/matching/profile-view?userId=${session.user.id}`);
      console.log("PROFILE VIEWS: ", response.data.viewUsers );
      setProfileViews(response.data.viewUsers)

  } catch (error) {
      console.log("PROFILE VIEWS:",error);
  } finally {
     
  }
}


const getUserImage = async (userId) => {
  const responseImage = await axios.get(`/api/user/photos?userId=${userId}`)
  if(responseImage.status === 200){
    setProfilePicture(responseImage.data.profilePhoto)
  }
  getMatchedUsers(userId);
  getShortlistedByUsers();
  getProfileViews();
  getShortlistedUsers()
}


if(status === 'authenticated' && session){
  getUserImage(session.user.id);
}
        
    
  },[status, session])

  const handleSearch = () => {
    router.push('/search')
  }

  const handleGoToAccount = () => {
    router.push('/account')
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
    <section className='pt-3 mb-10 pb-10 px-5 md:px-20' >
      <div className='flex items-center justify-between' >
        <div>
          <p className='text-sm text-sub_text_2' >Welcome,</p>
          <h1 className='text-md text-us_blue font-semibold flex items-center justify-center gap-2 capitalize' >{session?.user?.name}<Link href='/account' ><Image src='/assets/edit.svg' alt='edit' height={12} width={12} /></Link> </h1>
        </div>
        <div className='flex items-start justify-center gap-1'>
          <NotificationsNoneOutlinedIcon />
          {profilePicture && (
            <div className='overflow-hidden rounded-full border-2 border-us_blue w-16 h-16' >
              <Link href='/account/view-profile' ><Image className="object-cover w-full h-full" src={profilePicture} alt="profile" height={50} width={50} /></Link>
            </div>
          )}
        </div>
      </div>

      <div className='flex items-center gap-10 justify-between mt-5'>
        <button className='home-blue-btn flex items-center justify-center' >UPGRADE PLAN</button>
        <button onClick={handleSearch} className='home-red-btn flex items-center justify-center gap-2'><SearchOutlinedIcon fontSize="medium" /> SEARCH</button>
      </div>


      <div className="relative min-h-[170px] w-full mt-7">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BF0D3E] to-[#041E42] opacity-80 rounded-lg">
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full p-4">
            {/* <!-- Section 1 --> */}
            <div className="border-r-2 py-5 border-b-2 flex flex-col items-center justify-center" style={{borderColor : `rgba(255,255,255,0.5)`}}>
              <h1 className='text-xl font-bold text-white' >{shortlistedByUsers?.length}</h1>
              <p className='text-sm mt-1 text-white font-thin' >Shortlisted By</p>
            </div>
            {/* <!-- Section 2 --> */}
            <div className="border-b-2 flex flex-col items-center justify-center" style={{borderColor : `rgba(255,255,255,0.5)`}} >
              <h1 className='text-xl font-bold text-white' >{matchedUsers?.length}</h1>
              <p className='text-sm mt-1 text-white font-extralight' >Matches</p>
            </div>
            {/* <!-- Section 3 --> */}
            <div className="border-r-2 flex flex-col items-center justify-center" style={{borderColor : `rgba(255,255,255,0.5)`}}>
              <h1 className='text-xl font-bold text-white' >{profileViews.length}</h1>
              <p className='text-sm mt-1 text-white font-extralight' >Profle Views</p>
            </div>
            {/* <!-- Section 4 --> */}
            <div className="flex items-center flex-col justify-center" style={{borderColor : `rgba(255,255,255,0.5)`}}>
              <h1 className='text-xl font-bold text-white' >12</h1>
              <p className='text-sm mt-1 text-white font-extralight' >Interest Accepted</p>
            </div>
          </div>
        </div>
      </div>

          <h1 className='text-us_blue text-lg font-semibold mt-10' >{`It's A Match!`}</h1>

      <div className='mt-2 ' >
      <div className='flex items-center justify-start gap-5 flex-wrap overflow-hidden' >
          {matchedUsers && matchedUsers.map((user) => (
            <HomeMatchedUser key={user.id} userProfile={user} ></HomeMatchedUser>
          ))}

          {matchedUsers && matchedUsers.length > 0 && (
            <Link className='flex items-center justify-center flex-col' href='/matches' >
            <ArrowForwardIcon className='text-us_blue' fontSize='large' />
            <p className='text-us_blue text-md' >See All</p>
          </Link>
          )}
        </div>

          {matchedUsers?.length === 0 && (
            <div className='flex flex-col items-center justify-center' >
              <Image src='/assets/Matches-2.svg' className='' alt='matches' height={100} width={100} />
              <p className='mt-5 text-md text-center text-dark_text' >Serious candidates for marriage will appear here.</p>
          </div>
          )}
      </div>

      <h1 className='text-us_blue text-lg font-semibold mt-10' >{`New Matches`}</h1>
      <div className='mt-5 px-5 md:px-20' >
        <div className='flex items-center justify-start gap-5 flex-wrap overflow-hidden' >
          {shortlistedUsers && shortlistedUsers.map((user) => (
            <HomeNewUser key={user.id} userProfile={user} ></HomeNewUser>
          ))}

          {shortlistedUsers && shortlistedUsers.length > 0 && (
            <Link className='flex items-center justify-center flex-col' href='/matches' >
            <ArrowForwardIcon className='text-us_blue' fontSize='large' />
            <p className='text-us_blue text-md' >See All</p>
          </Link>
          )}
        </div>
        {shortlistedUsers?.length === 0 && (
          <div className='flex flex-col items-center justify-center' >
            <Image src='/assets/Matches.svg' alt='matches' height={100} width={100} />
            <p className='text-md mt-5 text-center text-dark_text' >New matches will appear here.</p>
          </div>
        )}
      </div>


      {session?.user?.adminVerificationStatus === false && (
        <div className='fixed z-20 inset-0 bg-us_blue bg-opacity-50 w-full' >
          <div className='fixed top-1/3 h-[600px] rounded-t-3xl py-10 px-5 bg-white w-full' >
          <h1 className='text-xl font-semibold text-us_blue text-center' >Verification In Progress </h1>
          <p className='text-md text-sub_text_2 mt-5' >Your profile was created successfully. Our staff will verify your account and activate it if your selfie verification passed.</p>
          <p className='text-md text-sub_text_2 mt-5' >You will receive a notification when your profile is activated. Thank you for your patience. In the meantime, if you feel you need to correct any information, you can do so now.</p>
          <div className='flex items-center justify-center mt-10' >
          <button onClick={handleGoToAccount} className='blue-button' >GO TO ACCOUNT</button>
          </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HomePage
