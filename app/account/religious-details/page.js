"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/context/AlertContext';

const generateRelegiousSchema = (gender) => {
    const commonRelegiousSchema = z.object({
        religiosity: z.string().nonempty({ message: 'This field is required' }),
        prayer: z.string().nonempty({ message: 'This field is required' }),
        revert: z.enum(['yes', 'no'], { message: 'This field is required' }),
        revertDuration: z.string().optional(),
        mosqueVisit: z.string().nonempty({ message: 'This field is required' }),
    });

    const maleRelegiousSchema = z.object({
        smoke: z.enum(['yes', 'no'], { message: 'This field is required' }),
    });

    const femaleRelegiousSchema = z.object({
        hijab: z.enum(['yes', 'no'], { message: 'This field is required' }),
        considerWearingHijab: z.string().optional(),
    });

    return gender === 'male'
        ? commonRelegiousSchema.merge(maleRelegiousSchema)
        : commonRelegiousSchema.merge(femaleRelegiousSchema);
};

const ReligiousDetailsEditPage = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    
    const gender = session?.user?.gender || "";
    const schema = generateRelegiousSchema(gender);

    const {showAlert} = useAlert();

    const [relegiousDetails, setReligiousDetails] = useState(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
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
        };
    
        fetchReligiousDetails();
    }, [status, session, gender, setValue]);


    const onSubmit = async (data) => {
        try {
            let response;
            if (gender === 'male') {
                response = await axios.put('/api/user/add-relegious-details', {
                    ...data,
                    userId: session.user.id,
                });
            } else if (gender === 'female') {
                response = await axios.put('/api/user/add-relegious-details', {
                    ...data,
                    userId: session.user.id,
                });
            }

            if (response.status === 200) {
                router.push('/account');
            } else {
                showAlert("Something Went Wrong! Please Try Again")
                console.log('Error updating details:', response.error);
            }
        } catch (error) {
            console.error('Error:', error);
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
        <section className="mb-10">
            <div className="bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full">
                <Link href="/account">
                    <Image src="/assets/back-icon.svg" alt="backIcon" height={30} width={30} />
                </Link>
                <div className="w-full">
                    <h1 className="text-center text-xl font-semibold text-us_blue">Religious Details</h1>
                </div>
            </div>

            <div className="mt-5">
                

                <div className="flex items-center justify-center mt-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="px-5 md:px-20 w-full md:w-1/2">
                        <div className="mt-3 grid grid-cols-3 items-baseline">
                            <label className="text-sub_text_2 text-sm mb-3 col-span-1">Religiosity:</label>
                            <Select className="text-sub_text_2" onValueChange={(value) => setValue("religiosity", value)} value={watch("religiosity")}>
                                <SelectTrigger className="col-span-2 h-[40px]" >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Religious">Religious</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Liberal">Liberal</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.religiosity && <p className="text-red-500 mt-2 text-sm">{errors.religiosity.message}</p>}
                        </div>

                        <div className="mt-5 grid grid-cols-3 items-baseline">
                            <label className="text-sub_text_2 text-sm mb-3 col-span-1">Your Prayer</label>
                            <Select className="text-sub_text_2" onValueChange={(value) => setValue('prayer', value)} value={watch("prayer")}>
                                <SelectTrigger className="col-span-2 h-[40px]" >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Always Pray">Always Pray</SelectItem>
                                    <SelectItem value="Usually Pray">Usually Pray</SelectItem>
                                    <SelectItem value="Sometimes Pray">Sometimes Pray</SelectItem>
                                    <SelectItem value="Hardly Pray">Hardly Pray</SelectItem>
                                    <SelectItem value="Never Pray">Never Pray</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.prayer && <p className="text-red-500 mt-2 text-sm">{errors.prayer.message}</p>}
                        </div>

                        <div className="mt-5 flex items-center justify-start gap-7">
                            <label className="text-sub_text_2 text-sm">Are you a Revert?</label>
                            <RadioGroup value={watch("revert")} onValueChange={(value) => setValue('revert', value)} className="flex items-center justify-center gap-2">
                                <RadioGroupItem value="yes" id="yes" />
                                <label htmlFor="yes" className="text-sm">Yes</label>

                                <RadioGroupItem value="no" id="no" />
                                <label htmlFor="no" className="text-sm">No</label>
                            </RadioGroup>
                        </div>
                        {errors.revert && <p className="text-red-500 mt-2 text-sm">{errors.revert.message}</p>}

                        <div className='mt-5 flex items-center justify-start gap-5' >
                            <label className="text-sub_text_2 text-sm">If yes, how long?</label>
                            <div className="religious-input flex items-center justify-center gap-2 mt-1" >
                                
                                <input {...register("revertDuration")} placeholder="" className="w-full"  />
                            </div>
                        </div>
                        {errors.revertDuration && <p className="text-red-500 text-sm mt-2">{errors.revertDuration.message}</p>}

                        <div className="mt-5">
                            <label className="text-sub_text_2 text-sm mb-3">How often do you visit the masjid?</label>
                            <Select className="text-sub_text_2 mt-2" onValueChange={(value) => setValue('mosqueVisit', value)} value={watch("mosqueVisit")} >
                                <SelectTrigger className="w-full h-[40px] mt-1" >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="2-3 Times a week">2-3 Times a week</SelectItem>
                                    <SelectItem value="Once a week">Once a week</SelectItem>
                                    <SelectItem value="Occasionally">Occasionally</SelectItem>
                                    <SelectItem value="Rarely">Rarely</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.mosqueVisit && <p className="text-red-500 mt-2 text-sm">{errors.mosqueVisit.message}</p>}
                        </div>

                        {gender === 'male' && (
                            <div>
                                <div className="mt-5 flex items-center justify-start gap-7">
                                    <label className="text-sub_text_2 text-sm">Do you smoke?</label>
                                    <RadioGroup value={watch("smoke")} onValueChange={(value) => setValue('smoke', value)} className="flex items-center justify-center gap-2">
                                        <RadioGroupItem value="yes" id="yes" />
                                        <label htmlFor="yes" className="text-sm">Yes</label>

                                        <RadioGroupItem value="no" id="no" />
                                        <label htmlFor="no" className="text-sm">No</label>
                                    </RadioGroup>
                                </div>
                                {errors.smoke && <p className="text-red-500 mt-2 text-sm">{errors.smoke.message}</p>}
                            </div>
                        )}

                        {gender === 'female' && (
                            <div>
                                <div className="mt-5 flex items-center justify-start gap-7">
                                    <label className="text-sub_text_2 text-sm">Do you wear hijab?</label>
                                    <RadioGroup value={watch("hijab")} onValueChange={(value) => setValue('hijab', value)} className="flex items-center justify-center gap-2">
                                        <RadioGroupItem value="yes" id="yes" />
                                        <label htmlFor="yes" className="text-sm">Yes</label>

                                        <RadioGroupItem value="no" id="no" />
                                        <label htmlFor="no" className="text-sm">No</label>
                                    </RadioGroup>
                                </div>
                                {errors.hijab && <p className="text-red-500 mt-2 text-sm">{errors.hijab.message}</p>}

                                <div className="mt-5" >
                                    <label className="text-sub_text_2 text-sm mb-3">If no, will you consider wearing it?</label>
                                    <Select className="text-sub_text_2 mt-2"  onValueChange={(value) => setValue("considerWearingHijab", value)} value={watch("considerWearingHijab")} >
                                        <SelectTrigger className="h-[40px] mt-1">
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

                        <div className='flex items-center justify-center' ><button type="submit" className="blue-button mt-10">
                            UPDATE
                        </button></div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ReligiousDetailsEditPage;
