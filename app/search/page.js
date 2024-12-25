"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import SearchProfile from '@/components/SearchProfile';

const searchSchema = z.object({
    ageGroupFrom : z.string().optional(),
    ageGroupTo : z.string().optional(),
    state: z.string().optional(),
    city : z.string().optional(),
    maritalStatus : z.string().optional(),
    ethnicityPreference : z.string().optional()
})

const ageRange = [
    "18", "19", "20", "21", "22", "23", "24", "25", "26", "27",
    "28", "29", "30", "31", "32", "33", "34", "35", "36", "37",
    "38", "39", "40", "41", "42", "43", "44", "45", "46", "47",
    "48", "49", "50", "51", "52", "53", "54", "55", "56", "57",
    "58", "59", "60", "61", "62", "63", "64", "65", "66", "67",
    "68", "69", "70"
]

const US_STATES = [
    "ANY","Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];



const SearchPage = () => {

    const [gender,setGender] = useState();
    const [step,setStep] = useState(0);
    const [profiles,setProfiles] = useState()
    const [searchLoading, setSearchLoading] = useState()

    const [open,setOpen] = useState(false);

    const toggleOpen = () => setOpen(false);

    useEffect(() => {
        async function extractUser() {
          const response = await fetch('/api/user/extract-user', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
          });
        
          if (response.ok) {
            const data = await response.json();
            setGender(data.gender);
            
          } else {
            console.error('Error:', await response.json());
          }
        }
        extractUser();
      },[])


    const {
            register,
            handleSubmit,
            reset,
            setValue,
            watch,
            formState: { errors },
          } = useForm({
            resolver: zodResolver(searchSchema),
    });


    const onSubmit = async (data) => {
        try {
            setSearchLoading(true);
            const response = await axios.post('/api/search', {
                gender,
                ...data
            });
            console.log("SEARCH RESPONSE:", response.data);
            setProfiles(response.data)
            if(response.data.length > 0){
                setStep(1)
            }else{
                setOpen(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSearchLoading(false);
        }
    }
    
  return (
    <section className='mb-10' >
        <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
            <Link href='/homepage' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
            <div className='w-full' >
                <h1 className='text-center text-xl font-medium' >Search</h1>
            </div>
        </div>

        {step === 0 && (
            <div className='flex items-center justify-center mt-10' >
            <form onSubmit={handleSubmit(onSubmit)} className='px-10 md:px-20 w-full md:w-1/2' >
            <div className='' >
                        <label className="text-sub_text_2 text-sm mb-3" >Search By Age: </label>
                        <div className='grid grid-cols-3 items-baseline mt-2' >
                            <div className='' >
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupFrom", value)} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ageRange.map((age) => (
                                            <SelectItem key={age} value={age} >{age}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.ageGroupFrom && <p className="text-red-500 mt-2 text-sm">{errors.ageGroupFrom.message}</p>}
                            </div>
                            <div className='flex items-center justify-center' >
                                <label className="text-sub_text_2 text-sm mb-3 text-center"  >To</label>
                            </div>
                            <div className='' >
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupTo", value)} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ageRange.map((age) => (
                                            <SelectItem key={age} value={age} >{age}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.ageGroupTo && <p className="text-red-500 mt-2 text-sm">{errors.ageGroupTo.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className='mt-3' >
                        <label className="text-sub_text_2 text-sm mb-3" >Search By Location: </label>
                        <div className="mt-3" >
                                                {/* <label className="text-sub_text_2 text-sm mb-3" >State: </label> */}
                                                <div className='mt-2' ><Select  onValueChange={(value) => setValue("state", value)} >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a state" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {US_STATES.map((state) => (
                                                            <SelectItem key={state} value={state} >{state}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select></div>
                                                {errors.state && <p className="text-red-500 mt-2 text-sm">{errors.state.message}</p>}
                                            </div>

                                            <div className="input flex items-center justify-center gap-2 mt-3" >
                            
                            <input {...register("city")} placeholder="City" className="w-full"  />
                        </div>
                        {errors.city && <p className="text-red-500 text-sm mt-2" >{errors.city.message}</p>}
                    </div>

                    <div className="mt-3" >
                                            <label className="text-sub_text_2 text-sm mb-3">Search By Marital Status</label>
                                            <div className='mt-2' >
                                                <Select onValueChange={(value) => setValue("maritalStatus", value)} >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="neverMarried" >Never Married</SelectItem>
                                                        <SelectItem value="divorced" >Divorced</SelectItem>
                                                        <SelectItem value="widowed" >Widowed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {errors.maritalStatus && <p className="text-red-500 mt-2 text-sm">{errors.maritalStatus.message}</p>}
                                        </div>

                <div className="mt-3" >
                                        <label className="text-sub_text_2 text-sm mb-3">Search By Ethnicity</label>
                                        <div className='mt-2' >
                                        <Select onValueChange={(value) => setValue("ethnicityPreference", value)} >
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
                                                <SelectItem value="any/dont-matter" >Any, Doesn’t Matter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        </div>
                                        {errors.ethnicityPreference && <p className="text-red-500 mt-2 text-sm">{errors.ethnicityPreference.message}</p>}
                                    </div>

            <div className='flex items-center justify-center mt-10' >
            <button type='submit' className='blue-button' >{searchLoading ? 'Searching' : 'Search'}</button>
            </div>
            </form>


            {open && (
                <div className='fixed inset-0 flex items-center justify-center bg-us_blue bg-opacity-50 px-10' >
                <div className='bg-white px-6 py-12 rounded-2xl shadow-md' >
                    <p className='text-center text-dark_text text-md' >Sorry, there is no match for your search criteria as yet. Try a broader search.</p>
                    <button className='blue-button mt-5' onClick={toggleOpen} >Search Again</button>
                </div>
            </div>
            )}

        </div>
        )}

        {step === 1 && (
            <div className='px-10 md:px-20' >
                {profiles && profiles.length > 0 && profiles.map((profile) => (
                    <div className='mt-10 flex flex-col items-center justify-center gap-5'  key={profile.id} >
                        <SearchProfile profile={profile} />
                    </div>
                )) }

                <div className='flex items-center justify-center mt-10' >
                    <button onClick={() => setStep(0)} className='blue-button' >Search Again</button>
                </div>
            </div>
        )}
    </section>
  )
}

export default SearchPage
