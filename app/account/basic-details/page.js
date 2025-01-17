"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import MailLockIcon from '@mui/icons-material/MailLock';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';
import { useAlert } from '@/context/AlertContext';

export const basicDetailsSchema = z.object({
  city: z.string().nonempty({ message: "City is required" }),
  state: z
    .string()
    .nonempty({ message: "State is required" })
    .refine((val) => US_STATES.includes(val), { message: "Invalid state" }),
});

const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];
   

const BasicDetailsPage = () => {

    const { data: session, status } = useSession();
    
    const [detailedUser, setDetailedUser] = useState(null)
    const router = useRouter();
    
    const {showAlert} = useAlert();

    const {
            register,
            handleSubmit,
            setValue,
            watch,
            formState: { errors },
          } = useForm({
            resolver: zodResolver(basicDetailsSchema),
    });

    useEffect(() => {

        const getBasicDetails = async () => {
            const response = await axios.get(`/api/user/create-user?userId=${session.user.id}`);
            if(response.status === 200){
                setDetailedUser(response.data);
                // console.log(response.data)
                setValue('city', response.data.city || '');
                setValue('state', response.data.state || '');
            }else{
                console.log(response.data);
            }
        }

        if (status === 'authenticated' && session) {
          getBasicDetails()
        }
    }, [session, status, setValue]);
    
    const onSubmit = async (formData) => {
        const response = await axios.put('/api/user/create-user', {
            userId : session.user.id,
            city : formData.city,
            state : formData.state
        })

        if(response.status === 200){
            router.push('/account')
        }else{
            showAlert("Something went wrong. Please Try Again");
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
    <main className='mb-10' >
        <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
            <Link href='/account' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
            <div className='w-full' >
                <h1 className='text-center text-xl font-medium' >Basic Details</h1>
            </div>
        </div>

        <div className='flex items-center justify-center mt-10' >
            <form onSubmit={handleSubmit(onSubmit)} className='px-10 md:px-20' >
                <div className="input flex items-center justify-center gap-2" >
                    <PersonIcon className="text-sub_text_2"  />
                    <input disabled value={session?.user?.name || ""} placeholder="Full Name" className="w-full" />                            
                </div>
                <div className="input flex items-center justify-center gap-2 mt-3" >
                    <MailLockIcon className="text-sub_text_2"  />
                    <input disabled value={session?.user?.email || ""} placeholder="Email" className="w-full"  />            
                </div>
                <div className="input-black flex items-center justify-center gap-2 mt-3 border border-black" >
                    <LocationCityIcon className="text-sub_text_2"  />
                    <input {...register("city")}  placeholder="City" className="w-full"  />
                </div>
                {errors.city && <p className="text-red-500 text-sm mt-2" >{errors.city.message}</p>}

                <div className="mt-3" >
                    <Select className="border border-black"  onValueChange={(value) => setValue("state", value)} >
                        <SelectTrigger className="border border-black w-[300px] h-[50px] rounded-[10px]" >
                            <SelectValue placeholder={detailedUser?.state} value={detailedUser?.state || "Select a state"} />
                        </SelectTrigger>
                        <SelectContent>
                            {US_STATES.map((state) => (
                                <SelectItem key={state} value={state} >{state}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-500 mt-2 text-sm">{errors.state.message}</p>}
                </div>

                <div className="mt-3 flex items-center justify-between" >
                    <label className="text-sub_text_2 text-sm" >Gender</label>
                    <RadioGroup
                        value={session?.user?.gender || ""}
                        disabled
                        className="flex items-center justify-center gap-2"
                    >
                        <RadioGroupItem value="male" id="male" />
                        <label htmlFor="male">Male</label>
                
                        <RadioGroupItem value="female" id="female" />
                        <label htmlFor="female">Female</label>
                    </RadioGroup>
                                            
                </div>

                <div className="flex items-center justify-between gap-1 mt-3" >
                    <label className="text-sub_text_2 text-sm">Date of Birth </label>
                    <input disabled value={session?.user?.dob || ""} type="date" placeholder="DOB" className=""  />
                </div>

                <div className="mt-3" >
                    <label className="text-sub_text_2 text-sm mb-3">Profile Created By</label>
                    <Select value={session?.user?.profileCreatedBy || ""} disabled >
                        <SelectTrigger className='w-[300px] h-[50px] mt-1 rounded-[10px]' >
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="self">Self</SelectItem>
                            <SelectItem value="brother">Brother</SelectItem>
                            <SelectItem value="sister">Sister</SelectItem>
                            <SelectItem value="guardian">Guardian</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="relative">Relative</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-center mt-5" ><button type="submit" className="blue-button mt-3" >UPDATE</button></div>

                <p className="text-center mt-10 text-sm text-dark_text" >Your contact details will not be visible to other members and will remain private. </p>

            </form>
        </div>
    </main>
  )
}

export default BasicDetailsPage
