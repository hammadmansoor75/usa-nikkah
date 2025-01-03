"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {z} from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter } from 'next/navigation'
import axios from 'axios'

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
    const [user,setUser] = useState(null);
    const [schema,setScehma] = useState(null);
    const [gender,setGender] = useState(null);
    const router = useRouter();

    const [partnerPrefrences, setPartnerPrefrences] = useState(null);
     
    useEffect(() => {
        async function extractUser() {
            const response = await fetch('/api/user/extract-user', {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });
              
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                console.log('User:', data);
                setGender(data.gender);
                const generatedSchema = generatePartnerSchema(data.gender)
                setScehma(generatedSchema);
                fetchPartnerPreferencs(data.id);
            } else {
                console.error('Error:', await response.json());
            }
        };
        async function fetchPartnerPreferencs(userId) {
            const response = await axios.get(`/api/user/add-partner-prefrence?userId=${userId}`)

            if (response.status === 200) {
                console.log(response.data)
                setPartnerPrefrences(response.data);
            } else {
                console.error('Error fetching partner preferences:', response.error);
            }
        }
        extractUser();
    },[]);


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
             if (partnerPrefrences) {
                setValue("ageGroupFrom", partnerPrefrences?.ageGroupFrom || "");
                setValue("ageGroupTo", partnerPrefrences?.ageGroupTo || "");
                setValue("state", partnerPrefrences?.state || "");
                setValue("maritalStatus", partnerPrefrences?.maritalStatus || "");
                setValue("relegiousPrefrence", partnerPrefrences?.religiousPreference || "");
                setValue("ethnicityPrefrence", partnerPrefrences?.ethnicityPreference || "");
                setValue("educationLevel", partnerPrefrences?.educationLevel || "");
                setValue("work", partnerPrefrences?.work || "");
                setValue("considerSomeoneHavingChildren", partnerPrefrences?.considerSomeoneHavingChildren || "");
              if(gender === 'male'){
                setValue("hijab", partnerPrefrences?.hijab || "");
              }
              if(gender === 'female'){
                setValue("smoke", partnerPrefrences?.smoke || "");
              }
             }
    }, [partnerPrefrences, setValue, gender]);

    const onSubmit = async (data) => {
        try {
            if(partnerPrefrences){
                let response;
                if (gender === 'male') {
                    response = await axios.put('/api/user/add-partner-prefrence', {
                        ...data,
                        userId: user.id,
                    });
                } else if (gender === 'female') {
                    response = await axios.put('/api/user/add-partner-prefrence', {
                        ...data,
                        userId: user.id,
                    });
                }

                if (response.status === 200) {
                    router.push('/photo/photo-upload')
                } else {
                    alert("Something went wrong! Please try again.");
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
                        smoke : data.smoke,
                        userId : user.id
                    });
                    if(response.status === 200){
                        router.push('/photo/photo-upload')
                        console.log(response.data)
                    }else{
                        alert("Something went wrong! Please try again.");
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
                        hijab : data.hijab,
                        userId : user.id
                    });
                    if(response.status === 200){
                        router.push('/photo/photo-upload')
                        console.log(response.data)
                    }else{
                        alert("Something went wrong! Please try again.");
                        console.log(response.error);
                    }
                }
            }
            
        } catch (error) {
            alert("Something went wrong! Please try again.");
            console.log(error)
        }
    }

  return (
    <section className="mb-10" >
        <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
            <Link href='/profile/relegious-details' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
            <div className='w-full' >
                <h1 className='text-center text-xl font-medium' >Partner Prefrences</h1>
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
                <form onSubmit={handleSubmit(onSubmit)} className='px-10 md:px-20 w-full md:w-1/2' >
                    <div className='' >
                        <label className="text-sub_text_2 text-sm mb-3" >Age Group: </label>
                        <div className='grid grid-cols-3 items-baseline mt-2' >
                            <div className='' >
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupFrom", value)} value={watch("ageGroupFrom")}  >
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
                                <Select className="text-sub_text_2"  onValueChange={(value) => setValue("ageGroupTo", value)} value={watch("ageGroupTo")}  >
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


                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3" >State: </label>
                        <div className='mt-2' ><Select  onValueChange={(value) => setValue("state", value)} value={watch("state")}  >
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


                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3">Marital Status</label>
                        <div className='mt-2' >
                            <Select onValueChange={(value) => setValue("maritalStatus", value)} value={watch("maritalStatus")}  >
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
                        <label className="text-sub_text_2 text-sm mb-3">Relegiousity Prefrence</label>
                        <Select className="text-sub_text_2"  onValueChange={(value) => setValue("relegiousPrefrence", value)} value={watch("relegiousPrefrence")}  >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Relegious" >Relegious</SelectItem>
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
                                    <SelectTrigger>
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
                                    <SelectTrigger>
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
                        <label className="text-sub_text_2 text-sm mb-3">Ethnicity Prefrence</label>
                        <div className='mt-2' >
                        <Select onValueChange={(value) => setValue("ethnicityPrefrence", value)} value={watch("ethnicityPrefrence")}  >
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
                        {errors.ethnicityPrefrence && <p className="text-red-500 mt-2 text-sm">{errors.ethnicityPrefrence.message}</p>}
                    </div>


                    <div className="mt-3" >
                        <label className="text-sub_text_2 text-sm mb-3">Education Level</label>
                        <div className='mt-2' >
                        <Select onValueChange={(value) => setValue("educationLevel", value)} value={watch("educationLevel")}  >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high school diploma" >High School Diploma</SelectItem>
                                <SelectItem value="College / University" >College / University</SelectItem>
                                <SelectItem value="Career Institute" >Career Institute</SelectItem>
                                <SelectItem value="Masters Degree" >Masters Degree</SelectItem>
                                <SelectItem value="Skilled Trade" >Skilled Trade</SelectItem>
                                <SelectItem value="Any, Doesn’t Matter" >Any, Doesn’t Matter</SelectItem>
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
                            <SelectTrigger>
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
                            <SelectTrigger>
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

                    <div className='flex items-center justify-center mt-5' >
                        <button className='blue-button' type='submit' >DONE</button>
                    </div>
                    
                </form>
            </div>
        </div>
    </section>
  )
}

export default PartnerPrefrencesPage
