"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ClipLoader from 'react-spinners/ClipLoader'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';




const PhotoUploadPage = () => {
  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [profilePhotoUploadUrl, setProfilePhotoUploadUrl] = useState('')
  const profilePhotoRef = useRef(null)
  const [profilePhotoLoading, setProfilePhotoLoading] = useState(false);
  const [profilePhotoUploadStatus, setProfilePhotoUploadStatus] = useState(false);


  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const addPhotoRef = useRef(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [selfieStream, setSelfieStream] = useState(null);
  const [selfie, setSelfie] = useState(null)
  const videoRef = useRef(null)
  const [selfieUploadUrl, setSelfieUploadUrl] = useState('');

  const [startVideo, setStartVideo] = useState(false);
  const [endVideo, setEndVideo] = useState(false);

  const [selfieCaptureStatus, setSelfieCaptureStatus] = useState(false);

  const router = useRouter();

  const [user, setUser] = useState(null)

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
              } else {
                  console.error('Error:', await response.json());
              }
          };
          extractUser();
  },[]);

  useEffect(() => {
    // Clean up camera stream when the component is unmounted
    return () => {
      if (selfieStream) {
        selfieStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selfieStream]);


  const handleProfileIconClick = (e) => {
    profilePhotoRef.current.click();
  }

  const handleProfilePhotoChange = async (e) => {
    setProfilePhotoLoading(true);
    const file = e.target.files[0];
    if(!file){
      console.log("No File Selected")
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'usa-nikkah');

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dsq7wjcnz/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok){
        const errorData = await response.json();
        console.error("Cloudinary Error:", errorData);
        throw new Error("Failed to upload");
      };
      const data = await response.json();
      setProfilePhotoUploadUrl(data.secure_url);
      setProfilePhotoUploadStatus(true);
      console.log(profilePhotoUploadUrl)
    } catch (error) {
      console.error(error)
      console.error('Upload failed:', error.message);
    } finally {
      setProfilePhotoLoading(false);
    }
  }


  const handlePhotoClick = () => {
    if(uploadedPhotos.length < 6 ){
      addPhotoRef.current.click();
    }else{
      alert("You can upload a maximum of 6 photos")
    }
  }


  const handlePhotoUpload = async (e) => {
    setPhotoLoading(true)
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
      setUploadedPhotos((prevPhotos) => [...prevPhotos, data.secure_url]);
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setPhotoLoading(false);
    }
  }


  const startSelfieCapture = async () => {
    try {
      setStartVideo(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setSelfieStream(stream);

      videoRef.current.srcObject = stream;
      videoRef.current.play();
      
    } catch (error) {
      console.error("Failed to access camera:", error);
    }
  }

  const captureSelfie = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    setSelfie(canvas.toDataURL("image/jpeg"));
    if (selfieStream) {
      selfieStream.getTracks().forEach(track => track.stop());
    }

    setEndVideo(true);
    handleSelfieUpload(canvas.toDataURL("image/jpeg"));
  
    // Optionally, you can reset the stream and video element to release resources
    // setSelfieStream(null);
    // videoRef.current.srcObject = null;
  };

  const handleSelfieUpload = async (selfieDataUrl) => {
    if(!selfieDataUrl){
      alert("Please capture a selfie first")
      return;
    }

    const formData = new FormData();
    formData.append("file", dataURItoBlob(selfieDataUrl));
    formData.append("upload_preset","usa-nikkah");

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
        throw new Error("Failed to upload selfie");
      }
      const data = await response.json();
      setSelfieUploadUrl(data.secure_url);
      setSelfieCaptureStatus(true);
      alert("Selfie uploaded successfully!");
      
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  }

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  const retakeSelfie = () => {
    setSelfie(null);
    setStartVideo(false);
    setEndVideo(false);
    setSelfieCaptureStatus(false);
    startSelfieCapture();
  };


  const handleSubmit = async () => {
    if(!profilePhotoUploadStatus){
      alert("Please upload a profile photo first")
    }

    if(!selfieCaptureStatus){
      alert("Please upload a selfie first");
    }

    try {
      const response = await axios.post('/api/user/photos', {
        profilePhoto : profilePhotoUploadUrl,
        selfiePhoto:  selfieUploadUrl,
        photos: uploadedPhotos,
        userId : user.id
      })
      if(response.status === 200){
        console.log(response.data);
        router.push('/homepage')
        
      }else{
        alert('Something went wrong! Please try again!')
        console.log(response.error)
      }
    } catch (error) {
      alert('Something went wrong! Please try again!')
      console.log(error);
    }
  }

  return (
    <main>
      <div className='bg-white shadow-lg flex items-center justify-start px-2 md:px-10 py-3 w-full' >
        <Link href='/profile/partner-prefrences' className="cursor-pointer" ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
        <div className='w-full' >
          <h1 className='text-center text-xl font-medium' >Photos</h1>
        </div>
      </div>


      <div className='mt-5 mb-10 px-10 md:px-20' > 
        <div className='flex items-center justify-between gap-5' >
          <div>
            <p className='text-sm text-sub_text_2' >Profile Photo: <span className='text-red-600 text-xs' >*Required</span></p>
            <p className='text-sm text-sub_text_2' >Your real photos only to prevent spam and make sure you’re genuine. You can’t change profile photo after selfie verification.</p>
          </div>
          <div>
            <div className='w-[80px] h-[80px] bg-sub_text_2 rounded-md flex items-center justify-center' >
              {profilePhotoLoading ? <ClipLoader />
              : profilePhotoUploadStatus ? <Image className='rounded-md' src={profilePhotoUploadUrl} alt='profile' height={100} width={100}  objectFit='contain' layout='intrinsic'/>  : <div><input type="file" ref={profilePhotoRef} onChange={handleProfilePhotoChange} className='hidden' />
              <AccountCircleOutlinedIcon onClick={handleProfileIconClick} className='text-white' sx={{ fontSize: 70 }}  /></div>  
              }
            </div>
          </div>
        </div>

        <div className='mt-5' >
          <p className='text-sub_text_2 text-sm' >Add upto 6 photos</p>
          <div className='mt-5 flex items-center justify-center flex-wrap gap-5' >
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className='bg-light_gray w-[100px] h-[100px] rounded-md flex items-center justify-center overflow-hidden'>
                <Image src={photo} alt='photo' className='rounded-md' width={100} height={100} objectFit='contain' layout='intrinsic' />
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


        <div className='mt-5'>
          <h2 className='text-us_red text-xl text-center font-semibold' >Selfie Verification</h2>

          <p className='text-sm text-sub_text_2 mt-5' >We need to verify that it’s you in the pictures
          above. Please take a selfie below. Your profile will remain hidden until you verify yourself. May Allah SWT make it possible for you to find your partner here. Ameeen.</p>

          <div className='flex items-center justify-center mt-5 px-10 ' id='selfieContainer' >
            {startVideo ? endVideo ? <Image alt='photo' height={100} width={100} src={selfie} /> : <video ref={videoRef} width="300" height="300" style={{ border: "1px solid #ccc" }} /> : <Image src='/assets/selfie.svg' alt='selfie' height={150} width={150} />}
            
          </div>

          {selfieCaptureStatus ? <p onClick={retakeSelfie} className='text-center mt-5 text-us_blue text-md underline'>Retake</p> : <p className="text-md text-us_blue mt-5 text-center" >You need to take a selfie to make your profile active. NO FAKE!</p> }

          

          <div className='mt-5' >
            {selfieCaptureStatus ? <div className='flex items-center justify-center' ><button className='blue-button' onClick={handleSubmit} >Done</button></div> : <div className='flex items-center justify-center flex-col gap-5'>
              <button className='blue-button' id='captureSelfieBtn' onClick={startSelfieCapture} >Start Camera</button>
            <button className="blue-button" onClick={captureSelfie}>
              Capture Selfie
            </button>
            </div> }
            
          </div>
        </div>

      </div>
    </main>
  )
}

export default PhotoUploadPage
