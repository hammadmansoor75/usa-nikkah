"use client";

import MatchedProfile from '@/components/MatchedProfile';
import NewProfile from '@/components/NewProfile';
import SearchProfile from '@/components/SearchProfile';
import ShortlistedByProfile from '@/components/ShortlistedByProfile';
import ShortlistedProfile from '@/components/ShortlistedProfile';
import { useAlert } from '@/context/AlertContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';

const MatchesPage = () => {
    const [activeCategory, setActiveCategory] = useState("matches") 
    const categories = ["matches" , "new" , "shortlisted", "blocked", "Profile View", "You're Shortlisted By"];

    const { data: session, status } = useSession();
    const [extractedUser, setExtractedUser] = useState();

    const [newUsers, setNewUsers] = useState([]);
    const [newUsersLoading,setNewUsersLoading] = useState(false);

    const [shortlistedUsers,setShortlistedUsers] = useState([])

    const [matchedUsers,setMatchedUsers] = useState([]);

    const [shortlistedBy, setShortlistedBy] = useState([]);

    const [profileViews,setProfileViews] = useState([])
    const router = useRouter();

    const {showAlert} = useAlert();
    

    useEffect(() => {
        if(status === 'authenticated' && session){
            getMatchedUsers(session.user.id);
        }
        
      },[status,session]);


      const getNewUsers = async () => {
        try {
            setNewUsersLoading(true)
            const response = await axios.get(`/api/matching/new-users?userId=${session.user.id}`);
            console.log("NEW USERS: ", response.data.newUsers );
            setNewUsers(response.data.newUsers)

        } catch (error) {
            console.log("NEW USERS ERROR:",error);
        } finally {
            setNewUsersLoading(false);
        }
    }

    const removeFromNewUsers = (userId) => {
        setNewUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

    const getShortlistedUsers = async () => {
        try {
            const response = await axios.get(`/api/matching/shortlisted?userId=${session.user.id}`);
            console.log("SHORTLISTED USERS: ", response.data.shortlistedUsers );
            setShortlistedUsers(response.data.shortlistedUsers)

        } catch (error) {
            console.log("NEW USERS ERROR:",error);
        } finally {
           
        }
    }

    const removeFromShortlistedUsers = (userId) => {
        setShortlistedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

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

    const removeFromMatchedUsers = (userId) => {
        setMatchedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

    const getShortlistedByUsers = async () => {
        try {
            const response = await axios.get(`/api/matching/shortlisted-by?userId=${session.user.id}`);
            console.log("SHORTLISTED BY USERS: ", response.data.shortlistedBy );
            setShortlistedBy(response.data.shortlistedBy)

        } catch (error) {
            console.log("SHORTLISTED BY USERS ERROR:",error);
        } finally {
           
        }
    }

    const removeFromProfileViews = (userId) => {
        setProfileViews((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };


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

    const removeFromShortlistedByUsers = (userId) => {
        setShortlistedBy((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };


    const handleCategoryChange = (category) => () => {
        setActiveCategory(category);

        if(category === 'new'){
            getNewUsers();
        }else if(category === 'shortlisted'){
            getShortlistedUsers();
        } else if (category === `You're Shortlisted By`){
            getShortlistedByUsers();
        } else if(category === 'Profile View'){
            getProfileViews();
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
                    <h1 className='text-center text-us_blue text-xl font-semibold' >Matches</h1>
                </div>
            </div>
        </div>

        <div className='mt-5 px-5 md:px-20' >
            <div className='flex gap-4 md:items-center md:justify-center overflow-x-auto pb-2' >
                {categories.map((category) => (
                    <button key={category} onClick={handleCategoryChange(category)} className={`flex-shrink-0 px-6 py-3 text-sm font-medium rounded-lg transition-all text-white ${
                        activeCategory === category
                          ? "bg-us_blue text-white"
                          : "bg-sub_text_2 text-white"
                      }`} >
                        {category === 'matches' ? "It's a Match!" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
        </div>


        {activeCategory === 'new' && (
            <div>
                {newUsers && (
                    <div className='mt-10 flex flex-col items-center justify-center gap-5 px-5 md:px-20' >
                        <p className='text-center text-md text-dark_text' >If you and the opposite gender taps the 
                        Thumbs Up icon, then It’s A Match!</p>
                        {newUsers.map((user) => (
                            <NewProfile key={user.id} profile={user} getMatchedUsers = {getMatchedUsers}  removeFromNewUsers={removeFromNewUsers} />
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeCategory === 'blocked' && (
            <div className='flex items-center flex-col gap-5 justify-center mt-20' >
                {session?.user?.gender === 'male' ? <><Image src='/assets/blocked-female.svg' alt='matches' height={100} width={100} />
                <p className='text-md text-center text-dark_text' >Your blocked users’ profiles will
                appear here.</p></> : <><Image src='/assets/blocked-male.svg' className='mt-10' alt='matches' height={100} width={100} /><p className='text-md text-center text-dark_text' >Your blocked users’ profiles will
                appear here.</p></>}
            </div>
        )}


        {activeCategory === 'shortlisted' && (
            <div>
                {shortlistedUsers && (
                    <div className='mt-10 flex flex-col items-center justify-center gap-5 px-5 md:px-20' >
                        {shortlistedUsers.map((user) => (
                            <ShortlistedProfile key={user.id} getMatchedUsers={getMatchedUsers} profile={user} removeFromShortlistedUsers={removeFromShortlistedUsers} />
                        ))}
                    </div>
                )}
                {shortlistedUsers.length === 0 && (
                    <div className='flex mt-10 flex-col items-center justify-center gap-10' >
                        {session?.user?.gender === 'male' ? <><Image src='/assets/shortlisted-female.svg' alt='matches' height={100} width={100} />
                        <p className='text-md text-center text-dark_text' >Your Shortlisted Profiles Will Appear Here.</p></> : <><Image src='/assets/shortlisted-male.svg' className='mt-10' alt='matches' height={100} width={100} />
                        <p className='text-md text-center text-dark_text' >Your Shortlisted Profiles Will Appear Here.</p></>}
                    </div>
                )}
            </div>
        )}

        {activeCategory === 'matches' && (
            <div>
                {matchedUsers && (
                    <div className='mt-10 flex flex-col items-center justify-center gap-5 px-5 md:px-20' >
                        {matchedUsers.map((user) => (
                            <MatchedProfile key={user.id} profile={user} removeFromMatchedUsers={removeFromMatchedUsers} />
                        ))}
                    </div>
                )}
                {matchedUsers.length === 0 && (
                    <div className='flex mt-10 flex-col items-center justify-center gap-10' >
                        <Image src='/assets/Matches.svg' alt='matches' height={100} width={100} />
                        <p className='text-md text-center text-dark_text' >New matches will appear here.</p>

                        <Image src='/assets/Matches-2.svg' className='mt-10' alt='matches' height={100} width={100} />
                        <p className='text-md text-center text-dark_text' >Serious candidates for marriage will appear here.</p>
                    </div>
                )}
            </div>
        )}


        {activeCategory === `You're Shortlisted By` && (
            <div>
                {shortlistedBy && (
                    <div className='mt-10 flex flex-col items-center justify-center gap-5 px-5 md:px-20' >
                        {shortlistedBy.map((user) => (
                            <ShortlistedByProfile key={user.id} profile={user} removeFromShortlistedByUsers={removeFromShortlistedByUsers} />
                        ))}
                    </div>
                )}
                {shortlistedBy.length === 0 && (
                    <div className='flex mt-10 flex-col items-center justify-center gap-10' >
                        <Image src='/assets/shortlisted-by.svg' alt='matches' height={100} width={100} />
                        <p className='text-md text-center text-dark_text' >You are not shortlisted by anyone</p>

                        
                    </div>
                )}
            </div>
        )}


    {activeCategory === `Profile View` && (
            <div>
                {profileViews && (
                    <div className='mt-10 flex flex-col items-center justify-center gap-5 px-5 md:px-20' >
                        {profileViews.map((user) => (
                            <SearchProfile key={user.id} profile={user} />
                        ))}
                    </div>
                )}
                {profileViews.length === 0 && (
                    <div className='flex mt-10 flex-col items-center justify-center gap-10' >
                        <Image src='/assets/profile-view.svg' alt='matches' height={100} width={100} />
                        <p className='text-md text-center text-dark_text' >You are not viewed by anyone</p>

                    </div>
                )}
            </div>
        )}
    </section>
  )
}

export default MatchesPage
