'use client'

import { PackageSelect } from "../boxDropDown/box1"
import { CustomSelect } from "../templates"
import { useState } from "react"
import { RadioGroup } from "./radio/radio"
import { ProductSelector } from "./foodSelect/foodSelect"
import { CountButton } from "../buttons/countButton/countButton"
import { notification, Skeleton } from 'antd';
import { price } from "@/helpers/api/getsum/getsum"
import { Price } from "./price/price"
import { Loader } from "../templates/loader/loader"

interface SelectedPackage {
    id: string;
    length: string;
    width: string;
    height: string;
    weight: string;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationsProps {
    type: NotificationType
    message: string
    description: string
}

export const Calculator = () => {
    const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null)
    const [selectedCityFrom, setSelectedCityFrom] = useState<string>('')
    const [selectedCityTo, setSelectedCityTo] = useState<string>('')
    const [selectedRadio, setSelectedRadio] = useState<'items' | 'food'>('items')
    const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined)
    const [api, contextHolder] = notification.useNotification();
    const [deliveryPrice, setDeliveryPrice] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    const openNotificationWithIcon = ({type, message, description}: NotificationsProps) => {
        api[type]({
          message,
          description,
        });
    };

    const handleChange = (field: string, value: string | SelectedPackage) => {
        switch (field) {
            case 'selectedPackage':
                setSelectedPackage(value as SelectedPackage)
                break
            case 'selectedCityFrom':
                setSelectedCityFrom(value as string)
                break
            case 'selectedCityTo':
                setSelectedCityTo(value as string)
                break
            case 'selectedRadio':
                setSelectedRadio(value as 'items' | 'food')
                break
            case 'selectedProduct':
                setSelectedProduct(value as string)
                break
            default:
                break
        }
    }

    const handleSubmit = async () => {
        const isEmpty = !selectedCityFrom || !selectedCityTo || !selectedPackage || 
                        (selectedRadio === 'food' && !selectedProduct);
    
        if (isEmpty) {
            openNotificationWithIcon({
                type: 'error',
                message: 'Ошибка',
                description: 'Пожалуйста, заполните все поля.'
            });
            return;
        }
    
        const packageInfo = {
            package: selectedPackage,
            isGoods: selectedRadio === 'food',
            typeOfGoods: selectedRadio === 'food' ? selectedProduct! : ''
        };
    
        setLoading(true);
        const deliveryPrice: number = await price(selectedCityFrom, selectedCityTo, packageInfo);
        setDeliveryPrice(deliveryPrice);
        setLoading(false);
    };

    return (
        <div className='mt-[80px] p-[20px] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]'>
            <Skeleton loading={loading}>
                <div className="mb-[20px]">
                    <h1 className="text-[24px] font-bold">Рассчитать стоимость доставки</h1>
                </div>
                <div className="flex gap-4">
                    <div>
                        <CustomSelect placeholder="Выберите город отправки" onChange={(selectedCityFrom: string) => handleChange('selectedCityFrom', selectedCityFrom)} />
                    </div>
                    <div>
                        <CustomSelect placeholder="Выберите город доставки" onChange={(selectedCityTo: string) => handleChange('selectedCityTo', selectedCityTo)} />
                    </div>
                </div>
                <div className="mt-[20px] flex gap-[75px]">
                    <div>
                        <RadioGroup onChange={(selectedRadio: string) => handleChange('selectedRadio', selectedRadio)} />
                    </div>
                    <div className="flex flex-col gap-[20px]">
                        <PackageSelect 
                            defaultValue={selectedPackage ? {
                                ...selectedPackage,
                                isGoods: selectedRadio === 'food',
                                typeOfGoods: selectedRadio === 'food' ? selectedProduct ?? '' : ''
                            } : {
                                id: '',
                                length: '',
                                width: '',
                                height: '',
                                weight: '',
                                isGoods: false,
                                typeOfGoods: ''
                            }}   
                            onSelect={(selectedPackage: SelectedPackage) => handleChange('selectedPackage', selectedPackage)} 
                        />
                        {selectedRadio === 'food' && (
                            <ProductSelector onChange={(selectedProduct: string) => handleChange('selectedProduct', selectedProduct)} />
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <CountButton onClick={handleSubmit} />
                </div>

                <div className="">
                    {loading && <Loader />}
                    {!loading && selectedPackage && deliveryPrice > 0 && (
                        <Price
                            price={deliveryPrice}
                            cityFrom={selectedCityFrom}
                            cityTo={selectedCityTo}
                            packageInfo={{
                            ...selectedPackage,
                            isGoods: selectedRadio === 'food',
                            typeOfGoods: selectedRadio === 'food' ? selectedProduct! : '',
                            }}
                        />
                    )}
                </div>

                {contextHolder}
            </Skeleton>
        </div>
    )
}