'use client'

import cn from "clsx"

interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
    type?: string;
}

export const Button = ({text, onClick, className, type}: ButtonProps) => {
    return (
        <div onClick={onClick} className={cn(
            'text-white py-1 px-4 rounded hover:text-black hover:bg-[#339966] transition-all duration-300 cursor-pointer',
            type === 'colored' && "bg-[#3A906B]",
            type === 'outline' && "border border-[#3A906B]",
            className
        )}>
            {text}
        </div>
    )
}