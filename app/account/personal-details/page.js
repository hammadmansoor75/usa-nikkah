"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios, { Axios } from 'axios';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const heights = [
  "Below 4ft",
  "4ft",
  "4ft 1in",
  "4ft 2in",
  "4ft 3in",
  "4ft 4in",
  "4ft 5in",
  "4ft 6in",
  "4ft 7in",
  "4ft 8in",
  "4ft 9in",
  "4ft 10in",
  "4ft 11in",
  "5ft",
  "5ft 1in",
  "5ft 2in",
  "5ft 3in",
  "5ft 4in",
  "5ft 5in",
  "5ft 6in",
  "5ft 7in",
  "5ft 8in",
  "5ft 9in",
  "5ft 10in",
  "5ft 11in",
  "6ft",
  "6ft 1in",
  "6ft 2in",
  "6ft 3in",
  "Above 6ft 3in"
];

const personalDetailsScehma = z.object({
    aboutMe: z.string().nonempty({ message: "About Me is required" }).refine((value) => {
        // Banned words
        const bannedWords = ["aol", "gmail", "yahoo", "live", "msn", "fb", "instagram", "tiktok"];
        const containsBannedWords = bannedWords.some((word) => value.toLowerCase().includes(word));
    
        // Check for numbers, @, or banned words
        const containsNumbersOrSpecialChars = /[0-9@]/.test(value);
    
        return !containsBannedWords && !containsNumbersOrSpecialChars;
    }, {
        message: "About Me must not include numbers, email addresses, '@', or banned words like AOL, Gmail, etc.",
    }),
    height : z.string().nonempty({ message: "Height is required" }),
    maritalStatus : z.string().nonempty({ message: "Marital Status is required" }),
    children : z.string().nonempty({ message: "No of Children is required" }),
    childrenLiving : z.string().nonempty({ message: "Children Living Status is required" }),
    moreKids : z.string().nonempty({ message: "Want More Kids is required" }),
    ethnicBackground : z.string().nonempty({ message: "Ethnic Background is required" }),
    occupation : z.string().nonempty({ message: "Occupation is required" }).refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: "Occupation must only contain letters and spaces",
      }),
    hobbies : z.string().nonempty({ message: "Hobbies is required" }),
    education : z.string().nonempty({message : "Education is required"})
})

const PersonalDetailsPage = () => {

    const [detailedUser, setDetailedUser] = useState(null)
    const router = useRouter();

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(personalDetailsScehma),
  });
    
  
    useEffect(() => {
      async function extractUser() {
        const response = await fetch('/api/user/extract-user', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
      
        if (response.ok) {
          const data = await response.json();
          const userId = data.id
          const responseUser = await axios.get(`/api/user/add-personal-details?userId=${userId}`)
          if(responseUser.status === 200){
            setDetailedUser(responseUser.data);
            
            console.log(responseUser.data)
        }
          
        } else {
          console.error('Error:', await response.json());
        }
      }
      extractUser();
    },[])


 useEffect(() => {
         if (detailedUser) {
          setValue("aboutMe", detailedUser.aboutMe || "");
          setValue("height", detailedUser.height || "");
          setValue("maritalStatus", detailedUser.maritalStatus || "");
          setValue("children", detailedUser.children || "");
          setValue("childrenLiving", detailedUser.childrenLiving || "");
          setValue("moreKids", detailedUser.moreKids || "");
          setValue("ethnicBackground", detailedUser.ethnicBackground || "");
          setValue("education", detailedUser.education || "");
          setValue("occupation", detailedUser.occupation || "");
          setValue("hobbies", detailedUser.hobbies || "");
         }
  }, [detailedUser, setValue]);
  

  const onSubmit = async (data) => {
    const response = await axios.put('/api/user/add-personal-details', {
      aboutMe : data.aboutMe,
      height : data.height,
      maritalStatus : data.maritalStatus,
      children : data.children,
      childrenLiving : data.childrenLiving,
      moreKids : data.moreKids,
      ethnicBackground : data.ethnicBackground,
      occupation : data.occupation,
      hobbies : data.hobbies,
      education : data.education,
      userId : detailedUser.userId
    })

    if(response.status === 200){
      alert('Personal Details Updated!');
      router.push('/account');
    }else{
      alert("Something went wrong")
    }
  }

  return (
    <main className='mb-10' >
      <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
        <Link href='/account' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
        <div className='w-full' >
          <h1 className='text-center text-xl font-medium' >Personal Details</h1>
        </div>
      </div>

      <div className='mt-5' >
            <div className='flex items-center justify-center mt-5' >
                <form onSubmit={handleSubmit(onSubmit)} className='px-10 md:px-20' >
                    <div className='flex flex-col items-start justify-start' >
                        <label className='text-sub_text_2 text-sm' >About Me: No Contact Details Allowed</label>
                        <textarea className='w-[295px] h-[82px] rounded-md border border-light_gray p-2 mt-2'  {...register("aboutMe")}  />
                        {errors.aboutMe && <p className="text-red-500 mt-2 text-sm">{errors.aboutMe.message}</p>}
                    </div>
                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Height</label>
                        <Select onValueChange={(value) => setValue("height", value)} value={watch("height")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {heights.map((height) => (
                                    <SelectItem key={height} value={height} >{height}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.height && <p className="text-red-500 mt-2 text-sm">{errors.height.message}</p>}
                    </div>

                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Marital Status</label>
                        <Select onValueChange={(value) => setValue("maritalStatus", value)} value={watch("maritalStatus")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="neverMarried" >Never Married</SelectItem>
                                <SelectItem value="divorced" >Divorced</SelectItem>
                                <SelectItem value="widowed" >Widowed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.maritalStatus && <p className="text-red-500 mt-2 text-sm">{errors.maritalStatus.message}</p>}
                    </div>

                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Children</label>
                        <Select onValueChange={(value) => setValue("children", value)} value={watch("children")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none" >None</SelectItem>
                                <SelectItem value="1" >1</SelectItem>
                                <SelectItem value="2" >2</SelectItem>
                                <SelectItem value="3" >3</SelectItem>
                                <SelectItem value="4" >4 or above</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.children && <p className="text-red-500 mt-2 text-sm">{errors.children.message}</p>}
                    </div>

                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Children Living Status</label>
                        <Select onValueChange={(value) => setValue("childrenLiving", value)} value={watch("childrenLiving")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="n/a" >N/A</SelectItem>
                                <SelectItem value="living with me" >Living with me</SelectItem>
                                <SelectItem value="not living with me" >Not Living with me</SelectItem>
                                <SelectItem value="shared custody" >Shared Custody</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.childrenLiving && <p className="text-red-500 mt-2 text-sm">{errors.childrenLiving.message}</p>}
                    </div>

                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Want More Kids</label>
                        <Select onValueChange={(value) => setValue("moreKids", value)} value={watch("moreKids")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes" >Yes</SelectItem>
                                <SelectItem value="no" >No</SelectItem>
                                <SelectItem value="maybe" >Maybe</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.moreKids && <p className="text-red-500 mt-2 text-sm">{errors.moreKids.message}</p>}
                    </div>

                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Ethnic Background</label>
                        <Select onValueChange={(value) => setValue("ethnicBackground", value)} value={watch("ethnicBackground")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="african" >African</SelectItem>
                                <SelectItem value="african american" >African American</SelectItem>
                                <SelectItem value="desi/south-asian" >Desi / South Asian</SelectItem>
                                <SelectItem value="arab/middle-eastren" >Arab / Middle Eastren</SelectItem>
                                <SelectItem value="caribbean" >Caribbean</SelectItem>
                                <SelectItem value="east-asian" >East Asian</SelectItem>
                                <SelectItem value="latino/hispanic" >Latino / Hispanic</SelectItem>
                                <SelectItem value="white/caucasian" >White / Caucasian</SelectItem>
                                <SelectItem value="mixed" >Mixed</SelectItem>
                                <SelectItem value="other" >Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.ethnicBackground && <p className="text-red-500 mt-2 text-sm">{errors.ethnicBackground.message}</p>}
                    </div>

                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Education</label>
                        <Select onValueChange={(value) => setValue("education", value)} value={watch("education")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high school diploma" >High School Diploma</SelectItem>
                                <SelectItem value="College / University" >College / University</SelectItem>
                                <SelectItem value="Career Institute" >Career Institute</SelectItem>
                                <SelectItem value="Masters Degree" >Masters Degree</SelectItem>
                                <SelectItem value="Skilled Trade" >Skilled Trade</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.education && <p className="text-red-500 mt-2 text-sm">{errors.education.message}</p>}
                    </div>
                    
                    <div className='mt-3' >
                        <label className="text-sub_text_2 text-sm">Occupation</label>
                        <div className="input flex items-center justify-center gap-2 mt-1" >
                            
                            <input {...register("occupation")} placeholder="" className="w-full"  />
                        </div>
                        {errors.occupation && <p className="text-red-500 text-sm mt-2" >{errors.occupation.message}</p>}
                    </div>

                    <div className='mt-3' >
                        <label className="text-sub_text_2 text-sm">Hobbies</label>
                        <div className="input flex items-center justify-center gap-2 mt-1" >
                            
                            <input {...register("hobbies")} placeholder="" className="w-full"  />
                        </div>
                        {errors.hobbies && <p className="text-red-500 text-sm mt-2" >{errors.hobbies.message}</p>}
                    </div>

                    <div className='flex items-center justify-center mt-5' ><button type='submit' className='blue-button' >UPDATE</button></div>
                </form>
            </div>
        </div>
    </main>
  )
}

export default PersonalDetailsPage
