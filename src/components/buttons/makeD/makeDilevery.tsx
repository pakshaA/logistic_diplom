import { Button } from "@/components/templates";
import Link from "next/link";

interface MakeDeliveryProps {
    cityFrom: string
    cityTo: string
    packageInfo: {
        length: string
        width: string
        height: string
        weight: string
        id: string
        isGoods: boolean | undefined
        typeOfGoods: string
    }
}

export const MakeDelivery = ({cityFrom, cityTo, packageInfo}: MakeDeliveryProps) => {
    return (
        <Link href={{
            pathname: "/delivery",
            query: {
                cityFrom: cityFrom,
                cityTo: cityTo,
                packageInfo: JSON.stringify(packageInfo)
            }
            
            }}>
            <Button type="outline" text="Оформить доставку" onClick={() => {}} className="!text-[#3A906B]"/>
        </Link>
    )
}