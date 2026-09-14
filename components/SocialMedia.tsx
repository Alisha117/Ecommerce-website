import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';
import { FaGithub, FaYoutube, FaLinkedinIn, FaSlackHash, FaFacebook } from "react-icons/fa";
import { cn } from '@/lib/utils';

interface Props{
    className?:string;
    iconClassName?:string;
    tooltipClassName?:string;
}
const socialLink = [
    {
        title: "Youtube",
        href: "https://www.youtube.com",
        icon: <FaYoutube className="w-5 h-5"/>
    },
    {
        title: "Github",
        href: "https://www.github.com",
        icon: <FaGithub className='w-5 h-5'/>
    },
    {
        title: "Linkedin",
        href: 'https://linkedin.com',
        icon: <FaLinkedinIn className='w-5 h-5'/>
    },
    {
        title: "Facebook",
        href: "https://facebook.com",
        icon: <FaFacebook className='w-5 h-5'/>
    },
    {
        title: 'Slack',
        href: 'https://slack.com',
        icon: <FaSlackHash className='w-5 h-5'/>
    }
]

const SocialMedia = ({className, iconClassName, tooltipClassName}:Props) => {
  return (
    <TooltipProvider>
        <div className={cn('flex items-center gap-3.5', className)}>
            {socialLink?.map((item)=>(
                <Tooltip key={item?.title}>
                
                    <Link href={item?.href} target='_blank' rel='noopener noreferrer' 
                    className={cn('p-2 border rounded-full hover:text-white  hover:border-white hoverEffect',iconClassName)}>
                     {item?.icon}
                    </Link>
               
                <TooltipContent className={cn('bg-white text-mauve-900 font-semibold', tooltipClassName)}>
                    {item?.title}
                </TooltipContent>
            </Tooltip>
        ))}
        </div>
    </TooltipProvider>
  )
}

export default SocialMedia