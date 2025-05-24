import { MakeDelivery } from "@/components/buttons/makeD/makeDilevery";

interface PriceProps {
    price: number;
    cityFrom: string;
    cityTo: string;
    packageInfo: {
      length: string;
      width: string;
      height: string;
      weight: string;
      id: string;
      isGoods: boolean | undefined;
      typeOfGoods: string;
    };
  }
  
export const Price = ({price, cityFrom, cityTo, packageInfo}: PriceProps) => {
    return (
        <div className="flex justify-between">
            <div className="">
                <p className="text-[16px]">Из города <span className="font-bold">{cityFrom}</span></p>
                <p className="text-[16px]">В город <span className="font-bold">{cityTo}</span></p>
                <p className="text-[16px]">Стоимость доставки: <span className="font-bold">{price} руб.</span></p>
                <p className="text-[16px]">Тип отправления: <span className="font-bold">{packageInfo.isGoods ? 'Еда' : 'Предметы'}</span></p>
                <p className="text-[16px]">Размеры: <span className="font-bold">{packageInfo.length} x {packageInfo.width} x {packageInfo.height} см.</span></p>
                <p className="text-[16px]">Вес: <span className="font-bold">{packageInfo.weight} кг.</span></p>
            </div>
            <div className="flex justify-end items-end">
                <MakeDelivery cityFrom={cityFrom} cityTo={cityTo} packageInfo={packageInfo}/>
            </div>
        </div>
    )
}