"use client"


import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ClipLoader } from 'react-spinners'
import { useAlert } from '@/context/AlertContext'





const generateRelegiousSchema = (gender) => {
    const commonRelegiousSchema = z.object({
        religiosity : z.string().nonempty({message : "This field is required"}),
        prayer : z.string().nonempty({message : "This field is required"}),
        revert: z.enum(["yes", "no"], { message: "This field is required" }),
        revertDuration : z.string().optional(),
        mosqueVisit : z.string().nonempty({message : "This field is required"}),
    })
    
    const maleRelegiousSchema = z.object({
        smoke: z.enum(["yes", "no"], { message: "This field is required" }),
    })
    
    const femaleRelegiousSchema = z.object({
        hijab: z.enum(["yes", "no"], { message: "This field is required" }),
        considerWearingHijab : z.string().optional(),
    })

    return gender === "male"
    ? commonRelegiousSchema.merge(maleRelegiousSchema)
    : commonRelegiousSchema.merge(femaleRelegiousSchema);
}

const RelegiousDetailsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [religiousDetails, setReligiousDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const gender = session?.user?.gender || "";
  const schema = generateRelegiousSchema(gender);

  const [revertValue, setRevertValue] = useState("");

  const {showAlert} = useAlert();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchReligiousDetails = async () => {
      if (status === "authenticated" && session) {
        try {
          const response = await axios.get(
            `/api/user/add-relegious-details?userId=${session.user.id}`
          );

          if (response.status === 200) {
            const data = response.data;
            setReligiousDetails(data);

            // Populate form fields
            setValue("religiosity", data.religiosity || "");
            setValue("prayer", data.prayer || "");
            setValue("revert", data.revert || "");
            setValue("revertDuration", data.revertDuration || "");
            setValue("mosqueVisit", data.mosqueVisit || "");
            setRevertValue(data.revert || "");

            if (gender === "male") {
              setValue("smoke", data.smoke || "");
            }
            if (gender === "female") {
              setValue("hijab", data.hijab || "");
              setValue("considerWearingHijab", data.considerWearingHijab || "");
            }
          }
        } catch (error) {
          console.error("Error fetching religious details:", error);
        }
      }
      setLoading(false);
    };

    fetchReligiousDetails();
  }, [status, session, gender, setValue]);

  const onSubmit = async (data) => {
    try {
      const apiEndpoint = "/api/user/add-relegious-details";
      const payload = { ...data, userId: session.user.id };

      const response = religiousDetails
        ? await axios.put(apiEndpoint, payload)
        : await axios.post(apiEndpoint, payload);

      if (response.status === 200) {
        router.push("/profile/partner-preferences");
      } else {
        alert("Something went wrong! Please try again.");
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong! Please try again.");
    }
  };

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
    <section className='mb-10' >
        <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
            <Link href='/profile/personal-details' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
            <div className='w-full' >
                <h1 className='text-center text-xl font-semibold text-us_blue' >Religious Details</h1>
            </div>
        </div>

        <div className='mt-5' >
            <h3 className='text-dark_text text-md text-center' >Complete Your Profile</h3>
            <div className='flex items-center justify-center gap-3 mt-2' >
                <div className='bg-sub_text_2 rounded-full w-4 h-4 opacity-50' ></div>
                <div className='bg-sub_text_2 rounded-full w-4 h-4' ></div>
                <div className='bg-sub_text_2 rounded-full w-4 h-4 opacity-50' ></div>
            </div>

            <div className='flex items-center justify-center mt-5' >
                <form onSubmit={handleSubmit(onSubmit)} className='px-10 md:px-20 w-full md:w-1/2' >
                    <div className="mt-3 grid grid-cols-3 items-baseline" >
                        <label className="text-sub_text_2 text-sm mb-3 col-span-1">Religiosity:</label>
                        <Select className="text-sub_text_2"  onValueChange={(value) => setValue("religiosity", value)} value={watch("religiosity")} >
                            <SelectTrigger className="col-span-2 h-[40px]" >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Religious" >Religious</SelectItem>
                                <SelectItem value="Moderate" >Moderate</SelectItem>
                                <SelectItem value="Liberal" >Liberal</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.religiosity && <p className="text-red-500 mt-2 text-sm">{errors.religiosity.message}</p>}
                    </div>

                    <div className="mt-5 grid grid-cols-3 items-baseline" >
                        <label className="text-sub_text_2 text-sm mb-3 col-span-1">Your Prayer</label>
                        <Select className="text-sub_text_2"  onValueChange={(value) => setValue("prayer", value)} value={watch("prayer")} >
                            <SelectTrigger className="col-span-2 h-[40px]" >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Always Pray" >Always Pray</SelectItem>
                                <SelectItem value="Usually Pray" >Usually Pray</SelectItem>
                                <SelectItem value="Sometimes Pray" >Sometimes Pray</SelectItem>
                                <SelectItem value="Hardly Pray" >Hardly Pray</SelectItem>
                                <SelectItem value="Never Pray" >Never Pray</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.prayer && <p className="text-red-500 mt-2 text-sm">{errors.prayer.message}</p>}
                    </div>


                    <div className="mt-5 flex items-center justify-start gap-7" >
                        <label className="text-sub_text_2 text-sm" >Are you a Revert?</label>
                        <RadioGroup
                            onValueChange={(value) => {
                              setValue("revert", value)
                              setRevertValue(value)
                            } }
                            value={watch("revert")}
                            className="flex items-center justify-center gap-2"
                        >
                            <RadioGroupItem value="yes" id="yes" />
                            <label htmlFor="yes" className='text-sm' >Yes</label>

                            <RadioGroupItem value="no" id="no" />
                            <label htmlFor="no" className='text-sm' >No</label>
                        </RadioGroup>
                        
                    </div>
                    {errors.revert && <p className="text-red-500 mt-2 text-sm">{errors.revert.message}</p>}

                    {revertValue === 'yes' && (
                      <div>
                        <div className='mt-5 flex items-baseline justify-start gap-5' >
                        <label className="text-sub_text_2 text-sm">If yes, how long?</label>
                        <div className="religious-input flex items-center justify-center gap-2 mt-1" >
                            
                            <input {...register("revertDuration")} placeholder="" className="w-full"  />
                        </div>
                    </div>
                    {errors.revertDuration && <p className="text-red-500 text-sm mt-2" >{errors.revertDuration.message}</p>}
                      </div>
                    )}

                    <div className="mt-5" >
                        <label className="text-sub_text_2 text-sm mb-3">How often do you visit the masjid?</label>
                        <Select className="text-sub_text_2 mt-2"  onValueChange={(value) => setValue("mosqueVisit", value)} value={watch("mosqueVisit")} >
                            <SelectTrigger className="w-[300px] h-[40px] mt-1" >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Daily" >Daily</SelectItem>
                                <SelectItem value="2-3 Times a week" >2-3 Times a week</SelectItem>
                                <SelectItem value="Once a week" >Once a week</SelectItem>
                                <SelectItem value="Occasionally" >Occasionally</SelectItem>
                                <SelectItem value="Rarely" >Rarely</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.prayer && <p className="text-red-500 mt-2 text-sm">{errors.prayer.message}</p>}
                    </div>


                    {gender === 'male' && (
                        <div>
                            <div className="mt-7 flex items-center justify-start gap-7" >
                                <label className="text-sub_text_2 text-sm" >Do you smoke?</label>
                                <RadioGroup
                                    onValueChange={(value) => setValue("smoke", value)}
                                    value={watch("smoke")}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <RadioGroupItem value="yes" id="yes" />
                                    <label htmlFor="yes" className='text-sm' >Yes</label>

                                    <RadioGroupItem value="no" id="no" />
                                    <label htmlFor="no" className='text-sm' >No</label>
                                </RadioGroup>
                                
                            </div>
                            {errors.smoke && <p className="text-red-500 mt-2 text-sm">{errors.smoke.message}</p>}
                        </div>
                    )}


                    {gender === 'female' && (
                        <div>
                            <div className="mt-7 flex items-center justify-start gap-7" >
                                <label className="text-sub_text_2 text-sm" >Do you wear hijab?</label>
                                <RadioGroup
                                    onValueChange={(value) => setValue("hijab", value)}
                                    value={watch("hijab")}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <RadioGroupItem value="yes" id="yes" />
                                    <label htmlFor="yes" className='text-sm' >Yes</label>

                                    <RadioGroupItem value="no" id="no" />
                                    <label htmlFor="no" className='text-sm' >No</label>
                                </RadioGroup>
                                
                            </div>
                            {errors.hijab && <p className="text-red-500 mt-2 text-sm">{errors.hijab.message}</p>}

                            <div className="mt-5" >
                                <label className="text-sub_text_2 text-sm mb-3">If no, will you consider wearing it?</label>
                                <Select className="text-sub_text_2 mt-2"  onValueChange={(value) => setValue("considerWearingHijab", value)} value={watch("considerWearingHijab")} >
                                    <SelectTrigger className="w-[300px] h-[40px] mt-1">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes" >Yes</SelectItem>
                                        <SelectItem value="No" >No</SelectItem>
                                        <SelectItem value="Maybe" >Maybe</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.considerWearingHijab && <p className="text-red-500 mt-2 text-sm">{errors.considerWearingHijab.message}</p>}
                            </div>
                        </div>
                    )}


                    <div className='flex items-center justify-center mt-12' ><button className='blue-button' type='submit' >NEXT</button></div>
                </form>
            </div>

        </div>
    </section>
  )
}

export default RelegiousDetailsPage
