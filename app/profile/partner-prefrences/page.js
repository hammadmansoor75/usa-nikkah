"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {z} from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { redirect, useRouter } from 'next/navigation'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { ClipLoader } from 'react-spinners'
import { useAlert } from '@/context/AlertContext'

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
  

const generatePartnerSchema = (gender) => {
    const commonPartnerPreferenceSchema = z
      .object({
        ageGroupFrom: z.string().nonempty({ message: "This field is required" }),
        ageGroupTo: z.string().nonempty({ message: "This field is required" }),
        state: z.string().nonempty({ message: "This field is required" }),
        maritalStatus: z.string().nonempty({ message: "This field is required" }),
        relegiousPrefrence: z.string().nonempty({ message: "This field is required" }),
        ethnicityPrefrence: z.string().nonempty({ message: "This field is required" }),
        educationLevel: z.string().nonempty({ message: "This field is required" }),
        work: z.string().nonempty({ message: "This field is required" }),
        considerSomeoneHavingChildren: z.string().nonempty({ message: "This field is required" }),
      })
  
    const malePartnerSchema = z.object({
      hijab: z.enum(["Yes", "No", "Dont Matter"], { message: "This field is required" }),
    });
  
    const femalePartnerSchema = z.object({
      smoke: z.enum(["Yes", "No", "Dont Matter"], { message: "This field is required" }),
    });
  
    return gender === "male"
      ? commonPartnerPreferenceSchema.merge(malePartnerSchema)
      : commonPartnerPreferenceSchema.merge(femalePartnerSchema);
  };
  
  

  
const PartnerPrefrencesPage = () => {

    const { data: session, status } = useSession();
    const {showAlert} = useAlert();

    const gender = session?.user?.gender || "";
    const schema = generatePartnerSchema(gender);
    
    const router = useRouter();

    const [partnerPrefrences, setPartnerPrefrences] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
    });
     
    useEffect(() => {
        const fetchPartnerPreferencs = async () => {
            if(status === 'authenticated' && session){
                try {
                    const response = await axios.get(`/api/user/add-partner-prefrence?userId=${session?.user?.id}`)
                    if (response.status === 200) {
                        const data = response.data;
                        console.log(data)
                        setPartnerPrefrences(response.data);
                        setValue("ageGroupFrom", data?.ageGroupFrom || "");
                        setValue("ageGroupTo", data?.ageGroupTo || "");
                        setValue("state", data?.state || "");
                        setValue("maritalStatus", data?.maritalStatus || "");
                        setValue("relegiousPrefrence", data?.religiousPreference || "");
                        setValue("ethnicityPrefrence", data?.ethnicityPreference || "");
                        setValue("educationLevel", data?.educationLevel || "");
                        setValue("work", data?.work || "");
                        setValue("considerSomeoneHavingChildren", data?.considerSomeoneHavingChildren || "");
                        setValue("hijab", data?.hijab || "");
                        setValue("smoke", data?.smoke || "");
                        if(gender === 'male'){
                            
                          }
                        if(gender === 'female'){
                            
                        }

                    } else {
                        console.log('Error fetching partner preferences:', response.data.error);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchPartnerPreferencs(session?.user?.id);
    },[status, session, gender, setValue]);





    const onSubmit = async (data) => {
        try {
            console.log(data);
            if(partnerPrefrences){
                let response;
                if (gender === 'male') {
                    response = await axios.put('/api/user/add-partner-prefrence', {
                        ...data,
                        userId: session.user.id,
                    });
                } else if (gender === 'female') {
                    response = await axios.put('/api/user/add-partner-prefrence', {
                        ...data,
                        userId: session.user.id,
                    });
                }

                if (response.status === 200) {
                    router.push('/photo/photo-upload')
                } else {
                    showAlert("Something went wrong! Please try again.");
                    console.log('Error updating details:', response.error);
                }
            }else{
                console.log(data);
                if(gender === 'male'){
                    const response = await axios.post("/api/user/add-partner-prefrence", {
                        gender : 'female',
                        ageGroupFrom : data.ageGroupFrom,
                        ageGroupTo : data.ageGroupTo,
                        state : data.state,
                        maritalStatus : data.maritalStatus,
                        religiousPreference : data.relegiousPrefrence,
                        ethnicityPreference : data.ethnicityPrefrence,
                        educationLevel : data.educationLevel,
                        work : data.work,
                        considerSomeoneHavingChildren : data.considerSomeoneHavingChildren,
                        hijab : data.hijab,
                        userId : session.user.id
                    });
                    if(response.status === 200){
                        router.push('/photo/photo-upload')
                        console.log(response.data)
                    }else{
                        showAlert("Something went wrong! Please try again.");
                        console.log(response.error);
                    }
                }

                if(gender === 'female'){
                    const response = await axios.post("/api/user/add-partner-prefrence", {
                        gender : 'male',
                        ageGroupFrom : data.ageGroupFrom,
                        ageGroupTo : data.ageGroupTo,
                        state : data.state,
                        maritalStatus : data.maritalStatus,
                        religiousPreference : data.relegiousPrefrence,
                        ethnicityPreference : data.ethnicityPrefrence,
                        educationLevel : data.educationLevel,
                        work : data.work,
                        considerSomeoneHavingChildren : data.considerSomeoneHavingChildren,
                        smoke : data.smoke,
                        userId : session.user.id
                    });
                    if(response.status === 200){
                        router.push('/photo/photo-upload')
                        console.log(response.data)
                    }else{
                        showAlert("Something went wrong! Please try again.");
                        console.log(response.error);
                    }
                }
            }
            
        } catch (error) {
            showAlert("Something went wrong! Please try again.");
            console.log(error)
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
    <section className="mb-10" >
        <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
            <Link href='/profile/relegious-details' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
            <div className='w-full' >
                <h1 className='text-center text-xl font-semibold text-us_blue' >Partner Preferences</h1>
            </div>
        </div>

        <div className="mt-5" >
            <h3 className='text-dark_text text-md text-center' >Complete Your Profile</h3>
            <div className='flex items-center justify-center gap-3 mt-2' >
                <div className='bg-sub_text_2 rounded-full w-4 h-4 opacity-50' ></div>
                <div className='bg-sub_text_2 rounded-full w-4 h-4 opacity-50' ></div>
                <div className='bg-sub_text_2 rounded-full w-4 h-4 ' ></div>
            </div>

            <div className='flex items-center justify-center mt-5' >
                <form onSubmit={handleSubmit(onSubmit)} className='px-10 md:px-20 w-full md:w-1/2 flex flex-col items-center justify-center' >
                    <div className='w-[300px]' >
                        <label className="text-sub_text_2 text-sm mb-3" >Age Group: </label>
                        <div className='flex justify-between items-baseline mt-2 w-[300px]' >
                            <div className='' >
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupFrom", value)} value={watch("ageGroupFrom")}  >
                                    <SelectTrigger className="col-span-1 w-[115px] h-[40px]" >
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
                            <div className='flex items-center justify-center col-span-1' >
                                <label className="text-sub_text_2 text-sm mb-3 text-center"  >To</label>
                            </div>
                            <div className='' >
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupTo", value)} value={watch("ageGroupTo")}  >
                                    <SelectTrigger className="col-span-1 w-[115px] h-[40px]" >
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


                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3" >State: </label>
                        <div className='mt-2' ><Select  onValueChange={(value) => setValue("state", value)} value={watch("state")}  >
                            <SelectTrigger className="w-[300px] h-[40px]" >
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


                    <div className="mt-3" >
                                        <label className="text-sub_text_2 text-sm mb-3">Marital Status</label>
                                        <div className='mt-2' >
                                            <Select onValueChange={(value) => setValue("maritalStatus", value)} value={watch("maritalStatus")} >
                                                <SelectTrigger className="w-[300px] h-[40px]">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Never Married" >Never Married</SelectItem>
                                                    <SelectItem value="Divorced" >Divorced</SelectItem>
                                                    <SelectItem value="Widowed" >Widowed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {errors.maritalStatus && <p className="text-red-500 mt-2 text-sm">{errors.maritalStatus.message}</p>}
                                    </div>


                    

                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3">Religiousity Preference</label>
                        <Select className="text-sub_text_2"  onValueChange={(value) => setValue("relegiousPrefrence", value)} value={watch("relegiousPrefrence")}  >
                            <SelectTrigger className="w-[300px] h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Religious" >Religious</SelectItem>
                                <SelectItem value="Moderate" >Moderate</SelectItem>
                                <SelectItem value="Liberal" >Liberal</SelectItem>
                                <SelectItem value="Dont Matter" >Dont Matter</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.relegiousPrefrence && <p className="text-red-500 mt-2 text-sm">{errors.relegiousPrefrence.message}</p>}
                    </div>
                    
                    {gender === 'male' && (
                        <div className="mt-3" >
                            <label className="text-sub_text_2 text-sm mb-3">Do you prefer a sister who wears the hijab?</label>
                            <div className='mt-2' >
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("hijab", value)} value={watch("hijab")}  >
                                    <SelectTrigger className="w-[300px] h-[40px]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Dont Matter" >Dont Matter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {errors.hijab && <p className="text-red-500 mt-2 text-sm">{errors.hijab.message}</p>}
                        </div>
                    )}


                    {gender === 'female' && (
                        <div className="mt-3" >
                            <label className="text-sub_text_2 text-sm mb-3">Would you consider a brother who smokes?</label>
                            <div className='mt-2' >
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("smoke", value)} value={watch("smoke")}  >
                                    <SelectTrigger className="w-[300px] h-[40px]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Dont Matter" >Dont Matter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {errors.smoke && <p className="text-red-500 mt-2 text-sm">{errors.smoke.message}</p>}
                        </div>
                    )}

                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3">Ethnicity Preference</label>
                        <div className='mt-2' >
                        <Select onValueChange={(value) => setValue("ethnicityPrefrence", value)} value={watch("ethnicityPrefrence")}  >
                            <SelectTrigger className="w-[300px] h-[40px]" >
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
                                <SelectItem value="Any" >Any</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        {errors.ethnicityPrefrence && <p className="text-red-500 mt-2 text-sm">{errors.ethnicityPrefrence.message}</p>}
                    </div>


                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3">Education Level</label>
                        <div className='mt-2' >
                        <Select onValueChange={(value) => setValue("educationLevel", value)} value={watch("educationLevel")}  >
                            <SelectTrigger className="w-[300px] h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High School Diploma" >High School Diploma</SelectItem>
                                <SelectItem value="College / University" >College / University</SelectItem>
                                <SelectItem value="Career Institute" >Career Institute</SelectItem>
                                <SelectItem value="Masters Degree" >Masters Degree</SelectItem>
                                <SelectItem value="Skilled Trade" >Skilled Trade</SelectItem>
                                <SelectItem value="Any" >Any</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        {errors.educationLevel && <p className="text-red-500 mt-2 text-sm">{errors.educationLevel.message}</p>}
                    </div>


                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3">
                            {gender === 'male' ? 'Work: Your husband wants you to be...' :'Work: Are you looking for...'}
                        </label>
                        <div className='mt-2' >
                        <Select onValueChange={(value) => setValue("work", value)} value={watch("work")}  >
                            <SelectTrigger className="w-[300px] h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A career driven woman" >A career driven woman</SelectItem>
                                <SelectItem value="Housewife" >Housewife</SelectItem>
                                <SelectItem value="Doesn’t Matter" >Doesn’t Matter</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        {errors.work && <p className="text-red-500 mt-2 text-sm">{errors.work.message}</p>}
                    </div>


                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3">
                            Are you willing to consider someone with children?
                        </label>
                        <div className='mt-2' >
                        <Select onValueChange={(value) => setValue("considerSomeoneHavingChildren", value)} value={watch("considerSomeoneHavingChildren")}  >
                            <SelectTrigger className="w-[300px] h-[40px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Maybe" >Maybe</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        {errors.considerSomeoneHavingChildren && <p className="text-red-500 mt-2 text-sm">{errors.considerSomeoneHavingChildren.message}</p>}
                    </div>

                    <div className='flex items-center justify-center mt-10' >
                        <button className='blue-button' type='submit' >DONE</button>
                    </div>
                    
                </form>
            </div>
        </div>
    </section>
  )
}

export default PartnerPrefrencesPage
