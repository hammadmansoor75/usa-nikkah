"use client"

import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';
import { useAlert } from '@/context/AlertContext';

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
    childrenLiving : z.string().optional(),
    moreKids : z.string().optional(),
    ethnicBackground : z.string().nonempty({ message: "Ethnic Background is required" }),
    occupation : z.string().nonempty({ message: "Occupation is required" }).refine((value) => /^[A-Za-z\s]+$/.test(value), {
        message: "Occupation must only contain letters and spaces",
      }),
    hobbies : z.string().nonempty({ message: "Hobbies is required" }),
    education : z.string().nonempty({message : "Education is required"})
})


const PersonalDetailsPage = () => {

    const {data : session, status} = useSession();

    const [user,setUser] = useState(null);

    const [personalDetails, setPersonalDetails] = useState(null);

    const [showChildrenLiving, setShowChildrenLiving] = useState(true);
    const [showWantMoreKids, setShowWantMoreKids] = useState(true)

    const {showAlert} = useAlert();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(personalDetailsScehma),
    });

    const router = useRouter();
    useEffect(() => {
        const getPersonalDetails = async (userId) => {
            const responseUser = await axios.get(`/api/user/add-personal-details?userId=${userId}`)
            if(responseUser.status === 200){
                setPersonalDetails(responseUser.data);
                console.log(responseUser.data)
                const data = responseUser.data;
                setValue("aboutMe", data.aboutMe || "");
                setValue("height", data.height || "");
                setValue("maritalStatus", data.maritalStatus || "");
                setValue("children", data.children || "");
                setValue("childrenLiving", data.childrenLiving || "");
                setValue("moreKids", data.moreKids || "");
                setValue("ethnicBackground", data.ethnicBackground || "");
                setValue("education", data.education || "");
                setValue("occupation", data.occupation || "");
                setValue("hobbies", data.hobbies || "");
            }else{
                console.log(responseUser);
            }
        }

        if(status === 'authenticated' && session){
            getPersonalDetails(session.user.id);
        }
        
    }, [setValue,session,status]);

   

    const onSubmit = async (data) => {
        try {
            if(personalDetails){
                const response = await axios.put('/api/user/add-personal-details', {
                    aboutMe : data.aboutMe,
                    height : data.height,
                    maritalStatus : data.maritalStatus,
                    children : data.children,
                    childrenLiving : data.childrenLiving || "",
                    moreKids : data.moreKids || "",
                    ethnicBackground : data.ethnicBackground,
                    occupation : data.occupation,
                    hobbies : data.hobbies,
                    education : data.education,
                    userId : session.user.id
                  })
              
                  if(response.status === 200){
                    router.push('/profile/religious-details');
                  }else{
                    showAlert("Something went wrong")
                  }
                
            }else{
                console.log(data);
                console.log("SET USER: ", user);
                const response = await axios.post('/api/user/add-personal-details', {
                    aboutMe : data.aboutMe,
                    height : data.height,
                    maritalStatus : data.maritalStatus,
                    children : data.children,
                    childrenLiving : data.childrenLiving || "",
                    moreKids : data.moreKids || "",
                    ethnicBackground : data.ethnicBackground,
                    occupation : data.occupation,
                    hobbies : data.hobbies,
                    education : data.education,
                    userId : session.user.id
                });
                if(response.status === 200){
                    router.push('/profile/religious-details')
                }else{
                    showAlert("Something went wrong! Please Try Again!")
                    console.log("Something went wrong!")
                }
            }
        } catch (error) {
            showAlert("Something went wrong! Please Try Again!")
            console.log(error)
        }
    }


      const selectedChildren = watch("children");
      useEffect(() => {
        setShowChildrenLiving(selectedChildren !== "None");
        setShowWantMoreKids(selectedChildren !== "None");
        if (selectedChildren === "None") {
          setValue("childrenLiving", "");
          setValue("moreKids", "");
        }
      }, [selectedChildren, setValue]);


      

    if(status === 'loading'){
        return <div className='flex items-center justify-center' >
            <ClipLoader size={50} />
        </div>
    }

    if(!session){
        router.push('/auth')
    }


  return (
    <section className='w-full mb-10 overflow-hidden' >
        <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
            {/* <Link href='/auth' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link> */}
            <div className='w-full' >
                <h1 className='text-center text-xl  font-semibold text-us_blue' >Personal Details</h1>
            </div>
        </div>
        <div className='mt-5' >
            <h3 className='text-dark_text text-md text-center' >Complete Your Profile</h3>
            <div className='flex items-center justify-center gap-3 mt-2' >
                <div className='bg-sub_text_2 rounded-full w-4 h-4' ></div>
                <div className='bg-sub_text_2 rounded-full w-4 h-4 opacity-50' ></div>
                <div className='bg-sub_text_2 rounded-full w-4 h-4 opacity-50' ></div>
            </div>

            <div className='flex items-center justify-center mt-5' >
                <form onSubmit={handleSubmit(onSubmit)} className='px-5 md:px-20' >
                    <div className='flex flex-col items-start justify-start' >
                        <label className='text-sub_text_2 text-sm' >About Me: No Contact Details Allowed</label>
                        <textarea className='w-[322px] h-[82px] rounded-md border border-light_gray p-2 mt-2'  {...register("aboutMe")}  />
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
                                <SelectItem value="Never Married" >Never Married</SelectItem>
                                <SelectItem value="Divorced" >Divorced</SelectItem>
                                <SelectItem value="Widowed" >Widowed</SelectItem>
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
                                <SelectItem value="None" >None</SelectItem>
                                <SelectItem value="1" >1</SelectItem>
                                <SelectItem value="2" >2</SelectItem>
                                <SelectItem value="3" >3</SelectItem>
                                <SelectItem value="4" >4 or above</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.children && <p className="text-red-500 mt-2 text-sm">{errors.children.message}</p>}
                    </div>

                    {showChildrenLiving && (
                        <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Children Living Status</label>
                        <Select onValueChange={(value) => setValue("childrenLiving", value)} value={watch("childrenLiving")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N/A" >N/A</SelectItem>
                                <SelectItem value="Living With Me" >Living with me</SelectItem>
                                <SelectItem value="Not Living With Me" >Not Living with me</SelectItem>
                                <SelectItem value="Shared Custody" >Shared Custody</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.childrenLiving && <p className="text-red-500 mt-2 text-sm">{errors.childrenLiving.message}</p>}
                    </div>
                    )}

                    {showWantMoreKids && (
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
                    )}

                    <div className="mt-3 grid grid-cols-2" >
                        <label className="text-sub_text_2 text-sm mb-3">Ethnic Background</label>
                        <Select onValueChange={(value) => setValue("ethnicBackground", value)} value={watch("ethnicBackground")} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="African" >African</SelectItem>
                                <SelectItem value="African American" >African American</SelectItem>
                                <SelectItem value="Desi / South-Asian" >Desi / South Asian</SelectItem>
                                <SelectItem value="Arab / Middle-Eastren" >Arab / Middle Eastren</SelectItem>
                                <SelectItem value="Caribbean" >Caribbean</SelectItem>
                                <SelectItem value="East-Asian" >East Asian</SelectItem>
                                <SelectItem value="Latino / Hispanic" >Latino / Hispanic</SelectItem>
                                <SelectItem value="White / Caucasian" >White / Caucasian</SelectItem>
                                <SelectItem value="Mixed" >Mixed</SelectItem>
                                <SelectItem value="Other" >Other</SelectItem>
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
                                <SelectItem value="High School Diploma" >High School Diploma</SelectItem>
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
                        <div className="custom-input flex items-center justify-center gap-2 mt-1" >
                            
                            <input {...register("occupation")} placeholder="" className="w-full"  />
                        </div>
                        {errors.occupation && <p className="text-red-500 text-sm mt-2" >{errors.occupation.message}</p>}
                    </div>

                    <div className='mt-3' >
                        <label className="text-sub_text_2 text-sm">Hobbies</label>
                        <div className="custom-input flex items-center justify-center gap-2 mt-1" >
                            
                            <input {...register("hobbies")} placeholder="" className="w-full"  />
                        </div>
                        {errors.hobbies && <p className="text-red-500 text-sm mt-2" >{errors.hobbies.message}</p>}
                    </div>

                    <div className='flex items-center justify-center mt-10' ><button type='submit' className='blue-button' >NEXT</button></div>
                </form>
            </div>
        </div>

    </section>
  )
}

export default PersonalDetailsPage
