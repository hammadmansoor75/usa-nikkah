"use client"
import React, { useEffect, useState } from 'react'

const CustomToggle = ({
    defaultToggled = false,
    onToggle
}) => {
    const [isToggled, setIsToggled] = useState(defaultToggled);

    useEffect(() => {
        setIsToggled(defaultToggled)
    },[defaultToggled]);

    const handleToggled = () => {
        const newValue = !isToggled
        setIsToggled(newValue)
        if(onToggle){
            onToggle(newValue)
        }
    }
  return (
    <button className={`relative flex items-center justify-center w-[50px] h-[22px] rounded-full transition-colors ${isToggled ? "bg-us_blue" : "bg-light_gray"}`} onClick={handleToggled} >
        <span className={`absolute right-7 text-xs font-medium text-white transition-opacity ${isToggled ? "opacity-100" : "opacity-0"}`} >Off</span>

        <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${isToggled ? "translate-x-7" : "translate-x-0"}`} ></span>

        <span className={`absolute left-7 text-xs font-medium text-dark_text transition-opacity ${ isToggled ? "opacity-0" : "opacity-100"}`}>On</span>

    </button>
  )
}

export default CustomToggle