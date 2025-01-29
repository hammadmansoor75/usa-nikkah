"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/context/AlertContext';

const PhotosPage = () => {

  const {data : session, status} = useSession();

  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState();

  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const addPhotoRef = useRef(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  const router = useRouter();
  const {showAlert} = useAlert();
  
  useEffect(() => {
    async function fetchImages(userId) {
      const response = await axios.get(`/api/user/photos?userId=${userId}`)

      if (response.status === 200) {
          setPhotos(response.data);
          setUploadedPhotos(response.data.photos);
      } else {
          console.error('Error fetching Images:', response.error);
      }
  }

  if(status === 'authenticated' && session){
    fetchImages(session.user.id);
  }

  }, [status, session]);


  const handlePhotoClick = () => {
    if(uploadedPhotos.length < 6 ){
      addPhotoRef.current.click();
    }else{
      showAlert("You can upload a maximum of 6 photos")
    }
  }

  const handlePhotoUpload = async (e) => {
    setPhotoLoading(true);
    const file = e.target.files[0];
    if(!file){
      console.log("No File Selected!")
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "usa-nikkah");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsq7wjcnz/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary Error:", errorData);
        throw new Error("Failed to upload");
      }
      const data = await response.json();
      const faceCroppedURL = data.secure_url.replace("/upload/", "/upload/c_crop,g_face,w_400,h_400/");
      setUploadedPhotos((prevPhotos) => [...prevPhotos, faceCroppedURL]);
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setPhotoLoading(false);
    }
  }

  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...uploadedPhotos];
    updatedPhotos.splice(index, 1);
    setUploadedPhotos(updatedPhotos);
  }

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const response = await axios.put('/api/user/photos', {
        photos: uploadedPhotos,
        userId: session.user.id
      });
      if(response.status === 200){
        router.push('/account');
      }else{
        showAlert("Something went wrong! Please Try Again");
      }
    } catch (error) {
      console.error("Error Updating Photos:", error);
      showAlert("Something went wrong! Please Try Again");
    } finally {
      setSubmitLoading(false);
    }
  }


  const handleTakeSelfie = () => {
    router.push('/photo/photo-upload');
  }

  
  const handleGoToAccount = () => {
    router.push('/account')
  }

   if(status === 'loading'){
      return <div className='flex items-center justify-center' >
          <ClipLoader size={50} />
      </div>
  }
  
  if(!session){
      router.push('/auth');
  }
  return (
    <section className='mb-10' >
      <div className="bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full">
        <Link href="/account">
          <Image src="/assets/back-icon.svg" alt="backIcon" height={30} width={30} />
        </Link>
        <div className="w-full">
          <h1 className="text-center text-xl  font-semibold text-us_blue">Photos</h1>
        </div>
      </div>

      <div className='mt-5 px-10 md:px-20' >
      <div className='flex items-center justify-between gap-5' >
          <div>
            <p className='text-sm text-sub_text_2' >Profile Photo: <span className='text-red-600 text-xs' >*Required</span></p>
            <p className='text-sm text-sub_text_2' >Your real photos only to prevent spam and make sure you’re genuine. You can’t change profile photo after selfie verification.</p>
          </div>
          <div>
            <div className='w-[80px] h-[80px] bg-sub_text_2 rounded-md flex items-center justify-center' >
            {photos?.profilePhoto ? <Image className='rounded-md' src={photos?.profilePhoto} alt='profile' height={100} width={100}  objectFit='contain' layout='intrinsic'/> : <AccountCircleOutlinedIcon  className='text-white' sx={{ fontSize: 70 }} />}
            </div>
          </div>
        </div>


        <div className='mt-5' >
          <p className='text-sub_text_2 text-sm' >Add up to 6 photos</p>
          <div className='mt-5 flex items-center justify-center flex-wrap gap-5' >
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className='bg-light_gray w-[100px] h-[100px] rounded-md flex items-center justify-center overflow-hidden relative'>
                <Image src={photo} alt='photo' className='rounded-md' width={100} height={100} objectFit='contain' layout='intrinsic' />
                <button className='absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 font-bold text-xs' onClick={() => handleDeletePhoto(index)}>
                  X
                </button>
              </div>
            ))}
            {uploadedPhotos.length < 6 && (
              <div className='bg-light_gray w-[90px] h-[90px] rounded-md flex items-center justify-center cursor-pointer' onClick={handlePhotoClick} >
                {photoLoading ? <ClipLoader /> : <AddCircleOutlinedIcon/> }
              </div>
            )}
            <input type='file' ref={addPhotoRef} onChange={handlePhotoUpload} className='hidden' />
          </div>
        </div>

        <div className='mt-14'>
          <h2 className='text-us_red text-xl text-center font-semibold tracking-wide' >Selfie Verification</h2>

          <p className='text-sm text-sub_text_2 mt-5' >We need to verify that it’s you in the pictures
          above. Please take a selfie below. Your profile will remain hidden until you verify yourself. May Allah SWT make it possible for you to find your partner here. Ameen.</p>

         <div className='mt-5 flex items-center justify-center px-10' >
          {photos?.selfiePhoto ? <Image src={photos?.selfiePhoto} alt='selfie' height={150} width={150} objectFit='contain' layout='intrinsic' className='rounded-md' /> : <AccountCircleOutlinedIcon  className='text-white' sx={{ fontSize: 70 }} />}
         </div>

         <p className='mt-5 text-lg text-center' >{photos?.adminVerificationStatus === false ? <span className='text-red-500' >Not Verified</span> : <span className='text-green-500' >Verified</span>}</p>
        </div>

        <div className='mt-10 flex items-center justify-center' >
          <button onClick={handleSubmit} className='blue-button' >{submitLoading ? <span className='flex items-center justify-center gap-2' >
            <ClipLoader color='white' size={20} />
            {" "}Updating
          </span> : "Done"}</button>
        </div>

      </div>


      {session?.user?.adminVerificationStatus === false && (
        <div className='fixed z-20 inset-0 bg-us_blue bg-opacity-50 w-full' >
          <div className='fixed top-1/3 h-[600px] rounded-t-3xl py-10 px-5 bg-white w-full' >
          <h1 className='text-xl font-semibold text-us_blue text-center' >Verification In Progress </h1>
          <p className='text-md text-sub_text_2 mt-5' >Your profile was created successfully. Our staff will verify your account and activate it if your selfie verification passed.</p>
          <p className='text-md text-sub_text_2 mt-5' >You will receive a notification when your profile is activated. Thank you for your patience. In the meantime, if you feel you need to correct any information, you can do so now.</p>
          <div className='flex items-center justify-center mt-10' >
          <button onClick={handleGoToAccount} className='blue-button' >GO TO ACCOUNT</button>
          </div>
          </div>
        </div>
      )}


      {session?.user?.adminVerificationStatus===true && photos?.adminVerificationStatus === false && (
        <div className='fixed inset-0 bg-us_blue bg-opacity-50 w-full' >
          <div className='fixed top-1/3 h-[500px] rounded-t-3xl py-5 px-10 bg-white w-full' >
          <h1 className='text-xl font-semibold text-us_blue text-center' >Profile Hidden </h1>
          <p className='text-md text-us_red font-semibold mt-7' >We DON’T want spam. Please upload your real selfie 
          to validate your account.</p>
          <div className='flex items-center justify-center mt-10' >
          <Image src='/assets/selfie-rejection.svg' alt='selfie' height={100} width={100} />
          </div>
          <button onClick={handleTakeSelfie} className='blue-button mt-10' >Take Selfie</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default PhotosPage
