"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiOutlineHome, AiOutlineUser, AiOutlineMenu } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";

import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname(); // To highlight the active link
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/homepage", icon: <Image src='/assets/home-nav-active.svg' height={24} width={24} alt="home" />, activeIcon : <Image src='/assets/home-nav-active.svg' height={24} width={24} alt="home" />  },
    { name: "Matches", path: "/matches", icon: <Image src='/assets/matches-nav-active.svg' height={24} width={24} alt="matches" />, activeIcon : <Image src='/assets/matches-nav.svg' height={24} width={24} alt="matches" />  },
    { name: "Interest", path: "/interest", icon: <FavoriteIcon fontSize="medium" />, activeIcon : <FavoriteBorderIcon fontSize="medium" />  },
    { name: "Chat", path: "/chat", icon: <Image src='/assets/chat-nav-active.svg' height={24} width={24} alt="chat" />, activeIcon : <Image src='/assets/chat-nav.svg' height={24} width={24} alt="chat" />  },
    { name: "Settings", path: "/settings", icon: <Image src='/assets/settings-nav-active.svg' height={24} width={24} alt="settings" />, activeIcon : <Image src='/assets/settings-nav.svg' height={24} width={24} alt="settings" /> },
  ];

  return (
    <div>
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex justify-between items-center py-6 bg-white text-black px-20">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src='/assets/usa-nikkah-logo.svg' alt='logo' height={30} width={30} />
          <Image src='/assets/text-logo-gray.svg' alt='logo' height={150} width={150} />
        </Link>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center space-x-2 ${
                  pathname === item.path ? "text-us_blue" : ""
                }`}
              >
                {/* {pathname === item.path ? item.icon : item.activeIcon} */}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="sm:hidden fixed bottom-0 z-10 left-0 right-0 bg-us_red text-white shadow-inner border-t border-gray-700 h-[56px]">
        <ul className="flex justify-around items-center py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex flex-col items-center text-sm `}
              >
                {pathname === item.path ? item.icon : item.activeIcon}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
