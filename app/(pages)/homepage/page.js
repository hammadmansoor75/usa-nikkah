"use client"

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {useRouter} from 'next/navigation'

const HomePage = () => {
  const [user,setUser] = useState(null)
  const [profilePicture,setProfilePicture] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function extractUser() {
      const response = await fetch('/api/user/extract-user', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log('User:', data);
        setUser(data)
        const responseImage = await axios.get(`/api/user/photos?userId=${data.id}`)
        if(responseImage.status === 200){
          setProfilePicture(responseImage.data.profilePhoto)
        }
        
      } else {
        console.error('Error:', await response.json());
      }
    }
    extractUser();
    
  },[])

  const handleSearch = () => {
    router.push('/search')
  }

  return (
    <section className='px-10 md:px-20 py-5' >
      <div className='flex items-center justify-between' >
        <div>
          <p className='text-sm text-sub_text_2' >Welcome,</p>
          <h1 className='text-md text-us_blue font-semibold' >{user?.name}</h1>
        </div>
        <div className='flex items-start justify-center gap-1'>
          <NotificationsNoneOutlinedIcon />
          {profilePicture && (
            <div className='overflow-hidden rounded-full border-2 border-us_blue w-16 h-16' >
              <Image className="object-cover w-full h-full" src={profilePicture} alt="profile" height={50} width={50} />
            </div>
          )}
        </div>
      </div>

      <div className='flex items-center gap-10 justify-between mt-5'>
        <button className='blue-button' >UPGRADE</button>
        <button onClick={handleSearch} className='red-button flex items-center justify-center gap-2'><SearchOutlinedIcon/> Search</button>
      </div>


      <div className="relative min-h-[200px] w-full mt-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BF0D3E] to-[#041E42] opacity-80 rounded-lg">
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full p-4">
            {/* <!-- Section 1 --> */}
            <div className="border-r-2 py-5 border-b-2 flex flex-col items-center justify-center" style={{borderColor : `rgba(255,255,255,0.5)`}}>
              <h1 className='text-xl font-bold text-white' >12</h1>
              <p className='text-sm mt-1 text-white font-thin' >Shortlisted By</p>
            </div>
            {/* <!-- Section 2 --> */}
            <div className="border-b-2 flex flex-col items-center justify-center" style={{borderColor : `rgba(255,255,255,0.5)`}} >
              <h1 className='text-xl font-bold text-white' >12</h1>
              <p className='text-sm mt-1 text-white font-extralight' >Matches</p>
            </div>
            {/* <!-- Section 3 --> */}
            <div className="border-r-2 flex flex-col items-center justify-center" style={{borderColor : `rgba(255,255,255,0.5)`}}>
              <h1 className='text-xl font-bold text-white' >12</h1>
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

          <h1 className='text-dark_text text-lg font-medium mt-10' >{`It's a Match`}</h1>

      <div className='mt-2 flex flex-col items-center justify-center' >
          <Image src='/assets/Matches-2.svg' className='' alt='matches' height={100} width={100} />
          <p className='mt-5 text-md text-center text-dark_text' >Serious candidates for marriage will appear here.</p>
      </div>

      <h1 className='text-dark_text text-lg font-medium mt-10' >{`New Matches`}</h1>
      <div className='flex flex-col mt-2 items-center justify-center' >
        <Image src='/assets/Matches.svg' alt='matches' height={100} width={100} />
         <p className='text-md mt-5 text-center text-dark_text' >New matches will appear here.</p>
      </div>
    </section>
  )
}

export default HomePage
