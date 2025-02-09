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
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { signIn } from "next-auth/react";

const US_AREA_CODES = new Set([
    201, 202, 203, 205, 206, 207, 208, 209, 210, 212, 213, 214, 215, 
    216, 217, 218, 219, 220, 224, 225, 228, 229, 231, 234, 239, 240,
    248, 251, 252, 253, 254, 256, 260, 262, 267, 269, 270, 272, 274,
    276, 281, 283, 301, 302, 303, 304, 305, 307, 308, 309, 310, 312, 
    313, 314, 315, 316, 317, 318, 319, 320, 321, 323, 325, 327, 330,
    331, 332, 334, 336, 337, 339, 346, 347, 351, 352, 360, 361, 364,
    380, 385, 386, 401, 402, 404, 405, 406, 407, 408, 409, 410, 412, 
    413, 414, 415, 417, 419, 423, 424, 425, 430, 432, 434, 435, 440, 
    442, 443, 447, 458, 463, 469, 470, 475, 478, 479, 480, 484, 501, 
    502, 503, 504, 505, 507, 508, 509, 510, 512, 513, 515, 516, 517, 
    518, 520, 530, 531, 534, 539, 540, 541, 551, 559, 561, 562, 563, 
    564, 567, 570, 571, 573, 574, 575, 580, 585, 586, 601, 602, 603, 
    605, 606, 607, 608, 609, 610, 612, 614, 615, 616, 617, 618, 619, 
    620, 623, 626, 628, 629, 630, 631, 636, 641, 646, 650, 651, 657, 
    660, 661, 662, 667, 669, 678, 681, 682, 701, 702, 703, 704, 706, 
    707, 708, 712, 713, 714, 715, 716, 717, 718, 719, 720, 724, 725, 
    727, 730, 731, 732, 734, 737, 740, 743, 747, 754, 757, 760, 762, 
    763, 765, 769, 770, 772, 773, 774, 775, 779, 781, 785, 786, 801, 
    802, 803, 804, 805, 806, 808, 810, 812, 813, 814, 815, 816, 817, 
    818, 820, 828, 830, 831, 832, 843, 845, 847, 848, 850, 856, 857, 
    858, 859, 860, 862, 863, 864, 865, 870, 872, 878, 901, 903, 904, 
    906, 907, 908, 909, 910, 912, 913, 914, 915, 916, 917, 918, 919, 
    920, 925, 928, 929, 930, 931, 934, 936, 937, 938, 940, 941, 947, 
    949, 951, 952, 954, 956, 959, 970, 971, 972, 973, 978, 979, 980, 
    984, 985, 986, 989
  ]);

export const signupFormSchema = z.object({
  fullName: z
    .string()
    .nonempty({ message: "Full Name is required" })
    .min(2, { message: "Full Name must be at least 2 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  password : z.string().min(8, {message : "Password must be atleast 8 characters"}),
  phoneNumber: z
    .string()
    .regex(/^(\d{3})-(\d{3})-(\d{4})$/, "Must be a valid US phone number")
    .refine((val) => US_AREA_CODES.has(parseInt(val.split("-")[0])), {
      message: "Invalid US area code",
    }),
  city: z.string().nonempty({ message: "City is required" }),
  state: z
    .string()
    .nonempty({ message: "State is required" })
    .refine((val) => US_STATES.includes(val), { message: "Invalid state" }),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  dob: z
  .string()
  .nonempty({ message: "Date of Birth is required" })
  .refine((val) => {
    const dob = new Date(val);
    const age = new Date().getFullYear() - dob.getFullYear();
    const isOldEnough =
      age > 18 || (age === 18 && new Date().getTime() >= dob.setFullYear(dob.getFullYear() + 18));
    return isOldEnough;
  }, { message: "You must be at least 18 years old" }),
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

    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(signupFormSchema),
    });

    const [phone, setPhone] = useState("");

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (!match) return value;
        return [match[1], match[2], match[3]].filter(Boolean).join("-");
      };
    
      const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
        setValue("phoneNumber", formatted);
      };



    const onSubmit = async (formData,e) => {
        e.preventDefault();
        try { 
            setLoading(true);
            const response = await axios.post("/api/user/create-user", {
                name : formData.fullName,
                email : formData.email,
                password : formData.password,
                phoneNumber : phone,
                state : formData.state,
                city : formData.city,
                dob : formData.dob,
                gender : formData.gender,
                profileCreatedBy : formData.profileCreatedBy
            })
    
            
            if(response.data.error){
                setErrorMessage(response.data.error);
            }else{
                const signInResponse = await signIn("credentials", {
                      redirect : false,
                      email : formData.email,
                      password : formData.password
                });
                router.push('/profile/personal-details')
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    

  return (
    <main>
        
            <section>
                <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
                    <Link href='/auth' ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
                    <div className='w-full' >
                        <h1 className='text-center text-xl font-semibold text-us_blue' >Sign Up</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-10" >
                    <form onSubmit={handleSubmit(onSubmit)} className="px-10 md:px-20"  >
                        <div className="input flex items-center justify-center gap-2" >
                            <PersonIcon className="text-sub_text_2"  />
                            <input {...register("fullName")} placeholder="Full Name" className="w-full capitalize" />                            
                        </div>
                        {errors.fullName && <p className="text-red-500 text-sm mt-2" >{errors.fullName.message}</p>}

                        <div className="input flex items-center justify-center gap-2 mt-3" >
                            <MailLockIcon className="text-sub_text_2"  />
                            <input {...register("email")} type="email" placeholder="Email" className="w-full"  />
                            
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-2" >{errors.email.message}</p>}

                        <div className="input flex items-center justify-center gap-2 mt-3" >
                            <LockOpenIcon className="text-sub_text_2"  />
                            <input {...register("password")} placeholder="Password" className="w-full"  />
                           
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-2" >{errors.password.message}</p>}
                        
                        <div className="input flex items-center gap-2 mt-3">
                            <PhoneAndroidIcon className="text-sub_text_2" />
                            <input
                            type="text"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="w-full"
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-2">{errors.phoneNumber.message}</p>}

                        <div className="input flex items-center justify-center gap-2 mt-3" >
                            <LocationCityIcon className="text-sub_text_2"  />
                            <input {...register("city")} placeholder="City" className="w-full capitalize"  />
                        </div>
                        {errors.city && <p className="text-red-500 text-sm mt-2" >{errors.city.message}</p>}

                        <div className="mt-4" >
                            <Select onValueChange={(value) => setValue("state", value)} >
                                <SelectTrigger className="w-[300px] h-[50px] rounded-[10px] text-sm" >
                                    <SelectValue placeholder="Select a state" className="text-sm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {US_STATES.map((state) => (
                                        <SelectItem key={state} className="text-sm" value={state} >{state}</SelectItem>
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
                            <label className="text-sub_text_2 text-sm">Profile Created By</label>
                            <Select className="" onValueChange={(value) => setValue("profileCreatedBy", value)} >
                                <SelectTrigger className="w-[300px] h-[50px] rounded-[10px] text-sm mt-[5px]" >
                                    <SelectValue className="text-sub_text_2 text-sm" placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="self" className="text-sm" >Self</SelectItem>
                                    <SelectItem value="brother" className="text-sm">Brother</SelectItem>
                                    <SelectItem value="sister" className="text-sm">Sister</SelectItem>
                                    <SelectItem value="guardian" className="text-sm">Guardian</SelectItem>
                                    <SelectItem value="parent" className="text-sm">Parent</SelectItem>
                                    <SelectItem value="relative" className="text-sm">Relative</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.profileCreatedBy && <p className="text-red-500 mt-2 text-sm">{errors.profileCreatedBy.message}</p>}
                        </div>

                        {errorMessage && <p className="text-red-500 mt-2 text-lg text-center" >{errorMessage}</p>}
                        <div className="flex items-center justify-center mt-10" ><button type="submit" className="blue-button" >{loading ? "SIGNING YOU UP" : "SIGN UP"}</button></div>

                        <p className="text-center mt-8 text-sm text-dark_text" >Your contact details will not be visible to other members and will remain private. </p>

                        <p className="text-center mt-5 mb-5 text-sm text-dark_text" >By signing up, you agree to our <Link href='/privacy' className="text-us_blue underline" >Privacy Policy</Link> and <Link href='/terms' className="text-us_blue underline" >Terms & Conditions.</Link></p>
 
                    </form>

                </div>
            </section>
    </main>
  )
}

export default SignupPage
