import Image from "next/image"
import { MainLoginButton } from "../buttons/MainLoginB/mainLoginButton"
import { CustomLink } from "../templates"
import Link from "next/link"

export const Header = () => {
    return (
        <div className="">
            <div className="container">
                <div className="flex justify-between items-center py-2">
                    <Link href="/" className="cursor-pointer">
                        <Image priority src="/logo.jpg" alt="logo" width={100} height={100}/>
                    </Link>
                    <div>
                        <ul className="flex gap-5">
                            <li className="cursor-pointer max-sm:hidden">
                                <CustomLink href="/" text="Главная"/>
                                <div className="w h-[1px] bg-[#00B793] opacity-0" />
                            </li>
                            <li className="cursor-pointer">
                                <CustomLink href="/delivery" text="Оформить доставку"/>
                                <div className="w h-[1px] bg-[#00B793] opacity-0" />
                            </li>
                            <li className="cursor-pointer max-sm:hidden">
                                <CustomLink href="/ur" text="Юр. лицам"/>
                                <div className="w h-[1px] bg-[#00B793] opacity-0" />
                            </li>
                        </ul>
                    </div>
                    <div>
                        <MainLoginButton/>
                    </div>
                </div>
            </div>
        </div>
    )
}