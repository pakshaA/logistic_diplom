'use client'

import Link from "next/link"

export const CustomLink = ({href, text}: {href: string, text: string}) => {
    return (
        <div className="group">
            <Link href={href}>{text}</Link>
            <div 
                className="w-0 h-[1px] bg-[#00B793] group-hover:w-full transition-all duration-500" 
            />
        </div>
    )
}