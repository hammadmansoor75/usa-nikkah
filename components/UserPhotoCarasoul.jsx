import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; // Correct way to import Pagination module from Swiper
import "swiper/css"; // Core Swiper styles
import "swiper/css/pagination"; // Pagination styles
import Image from "next/image";

export default function UserPhotoCarousel({ photos }) {
  return (
    <div className="relative w-full h-full md:my-10"> {/* Ensure parent has relative positioning */}
      <Swiper
        modules={[Pagination]} // Enable Pagination module
        spaceBetween={10}
        slidesPerView={1}
        pagination={{
          clickable: true, // Make the pagination bullets clickable
          type: 'bullets', // Ensure the pagination is of type 'bullets'
        }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center h-full">
            {/* Image container */}
            <div className="w-full h-full flex justify-center items-center">
              <Image
                src={photo}
                alt={`User photo ${index + 1}`}
                layout="intrinsic"
                width={800}
                height={500}
                className="object-contain w-full h-auto max-w-full max-h-[500px]" // Ensure images scale correctly
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* <div className="absolute top-20 z-10" >
        <div className="swiper-pagination transform -translate-x-1/2"> 
            
        </div>
      </div> */}
    </div>
  );
}
