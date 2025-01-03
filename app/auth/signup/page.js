"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react"
import * as z from 'zod'
import { useForm } from "react-hook-form";
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MailLockIcon from '@mui/icons-material/MailLock';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { supabase } from "@/utils/supabaseClient";
import OtpVerification from "@/components/OtpVerification";
import { useSignupContext } from "@/providers/AccountProvider";

export const signupFormSchema = z.object({
  fullName: z
    .string()
    .nonempty({ message: "Full Name is required" })
    .min(2, { message: "Full Name must be at least 2 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  phone: z
    .string()
    .nonempty({ message: "Phone number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
  city: z.string().nonempty({ message: "City is required" }),
  state: z
    .string()
    .nonempty({ message: "State is required" })
    .refine((val) => US_STATES.includes(val), { message: "Invalid state" }),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  dob: z
    .string()
    .nonempty({ message: "Date of Birth is required" })
    .refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid Date" }),
  profileCreatedBy: z
    .string()
    .nonempty({ message: "Profile Created By is required" }),
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
 

const SignupPage = () => {
    const [step,setStep] = useState(1);
    const [otpSendingLoading, setOtpSendingLoading] = useState(false);
    const [phone,setPhone] = useState('');
    const {setSignupData} = useSignupContext();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(signupFormSchema),
    });

    const sendOtp = async (formData) => {
        try{
            setOtpSendingLoading(true);
            setPhone(formData.phone)
            setSignupData(formData);

            const {data, error} = await supabase.auth.signInWithOtp({
                phone : formData.phone,
            })
            if(data){
                setStep(2);
            }
        }catch(error){
            console.log(error);
        }finally{
            setOtpSendingLoading(false);
        }
    } 


  return (
    <main>
        {step === 1 && (
            <section>
                <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
                    <Link href='/auth' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
                    <div className='w-full' >
                        <h1 className='text-center text-xl font-medium' >Sign Up</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-10" >
                    <form onSubmit={handleSubmit(sendOtp)} className="px-10 md:px-20"  >
                        <div className="input flex items-center justify-center gap-2" >
                            <PersonIcon className="text-sub_text_2"  />
                            <input {...register("fullName")} placeholder="Full Name" className="w-full" />                            
                        </div>
                        {errors.fullName && <p className="text-red-500 text-sm mt-2" >{errors.fullName.message}</p>}

                        <div className="input flex items-center justify-center gap-2 mt-3" >
                            <PhoneAndroidIcon className="text-sub_text_2"  />
                            <input {...register("phone")} placeholder="Mobile Number" className="w-full"  />
                           
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-2" >{errors.phone.message}</p>}
                        <div className="input flex items-center justify-center gap-2 mt-3" >
                            <MailLockIcon className="text-sub_text_2"  />
                            <input {...register("email")} placeholder="Email" className="w-full"  />
                            
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-2" >{errors.email.message}</p>}
                        <div className="input flex items-center justify-center gap-2 mt-3" >
                            <LocationCityIcon className="text-sub_text_2"  />
                            <input {...register("city")} placeholder="City" className="w-full"  />
                        </div>
                        {errors.city && <p className="text-red-500 text-sm mt-2" >{errors.city.message}</p>}

                        <div className="mt-4" >
                            <Select onValueChange={(value) => setValue("state", value)} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {US_STATES.map((state) => (
                                        <SelectItem key={state} className="text-lgs" value={state} >{state}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.state && <p className="text-red-500 mt-2 text-sm">{errors.state.message}</p>}
                        </div>


                        <div className="mt-5 flex items-center justify-between" >
                            <label className="text-sub_text_2 text-sm" >Gender</label>
                            <RadioGroup
                                onValueChange={(value) => setValue("gender", value)}
                                className="flex items-center justify-center gap-2"
                            >
                                <RadioGroupItem value="male" id="male" />
                                <label htmlFor="male">Male</label>

                                <RadioGroupItem value="female" id="female" />
                                <label htmlFor="female">Female</label>
                            </RadioGroup>
                            
                        </div>
                        {errors.gender && <p className="text-red-500 mt-2 text-sm">{errors.gender.message}</p>}
                        <div className="flex items-center justify-between gap-1 mt-5" >
                            <label className="text-sub_text_2 text-sm">Date of Birth </label>
                            <input {...register("dob")} type="date" placeholder="DOB" className=""  />
                        </div>
                        {errors.dob && <p className="text-red-500 text-sm mt-2" >{errors.dob.message}</p>}

                        <div className="mt-5" >
                            <label className="text-sub_text_2 text-sm mb-4">Profile Created By</label>
                            <Select onValueChange={(value) => setValue("profileCreatedBy", value)} >
                                <SelectTrigger>
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
                            {errors.profileCreatedBy && <p className="text-red-500 mt-2 text-sm">{errors.profileCreatedBy.message}</p>}
                        </div>

                        <div className="flex items-center justify-center" ><button type="submit" className="blue-button mt-5" >SIGN UP</button></div>

                        <p className="text-center mt-5 text-sm text-dark_text" >Your contact details will not be visible to other members and will remain private. </p>

                        <p className="text-center mt-5 mb-5 text-sm text-dark_text" >By signing up, you agree to our <Link href='/privacy' className="text-us_blue underline" >Privacy Policy</Link> and <Link href='/terms' className="text-us_blue underline" >Terms & Conditions.</Link></p>
 
                    </form>

                </div>
            </section>
        )}

        {step === 2 && (
            <OtpVerification phone={phone} />
        )}
    </main>
  )
}

export default SignupPage
