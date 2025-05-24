'use client'

import { checkAuth } from "@/helpers/api/checkAuth/checkAuth"
import { getDeliveries } from "@/helpers/api/getDeliveries/getDeliveries"
import { getDeliveriesById } from "@/helpers/api/getDeliveriesById/getDeliveriesById"
import { ConfigProvider, Input } from "antd"
import { useEffect, useState } from "react"
import { notification } from "antd"
import { CircleX } from "lucide-react"

interface Delivery {
    packageInfo: {
        isGoods: boolean
        typeOfGoods: string
        package: {
            length: number
            width: number
            height: number
            weight: number
            id: string
        }
    }
    receiver: {
        city: string
        phone: string
        address: string
    }
    sender: {
        city: string
        phone: string
        address: string
    }
    status: string
    shipmentId: string
    _id: string
}


export const Deliveries = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [deliveries, setDeliveries] = useState<Delivery[]>([])
    const [shipmentId, setShipmentId] = useState<string>('')
    const [delivery, setDelivery] = useState<Delivery | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [api, contextHolder] = notification.useNotification()

    const openNotificationWithIcon = (message: string, description: string) => {
        api.open({
          message,
          description,
          icon: <CircleX className="text-red-500" />,
        });
      };

    const handleClick = async (shipmentId: string) => {
        try {
            if (!shipmentId) {
                openNotificationWithIcon(
                    'Ошибка',
                    'Не введен номер доставки'
                )
                return
            }
            const data = await getDeliveriesById(shipmentId)
            setDelivery(data.delivery)
            setOpen(true)
        } catch (error) {
            openNotificationWithIcon(
                'Ошибка',
                'Не удалось получить доставку'
            )
        }
    }

    useEffect(() => {
        checkAuth().then((res) => {
            setIsAuth(res)
        })
    }, [])    
    
    useEffect(() => {
        if (isAuth) {
            getDeliveries().then((res) => {
                setDeliveries(res.deliveries)
            })
        }
    }, [isAuth])
    console.log(delivery)
    return (
        <div className="py-[20px]">
            {contextHolder}
            <div className="container flex flex-row gap-[20px]">
                <div className="p-[20px] flex flex-col gap-[20px] w-[calc(60%-20px)] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
                    <p className="text-[20px] font-bold">Ваши доставки</p>
                    {!isAuth && <p>Вы не авторизованы</p>}
                    {isAuth && deliveries.length === 0 && <p>У вас нет доставок</p>}
                    {isAuth && deliveries.length > 0 && (
                        <>
                            {deliveries.map((delivery: Delivery) => (
                                <div key={delivery._id} className="p-[20px] border border-[#3A906B] rounded-[15px]">
                                    <div className="flex flex-row gap-[20px] justify-between">
                                        <p>Номер доставки: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.shipmentId}</span></p>
                                        <p>Статус: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.status === 'created' ? 'Создана' : delivery.status === 'in_transit' ? 'В пути' : delivery.status === 'delivered' ? 'Доставлена' : 'Отменена'}</span></p>
                                    </div>
                                    <div className="flex flex-row gap-[20px]">
                                        <div className="flex flex-col gap-[2px]">
                                            <p>Откуда</p>
                                            <p>Город: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.sender.city}</span></p>
                                            <p>Адрес: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.sender.address}</span></p>
                                            <p>Телефон: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.sender.phone}</span></p>
                                        </div>
                                        <div className="flex flex-col gap-[2px]">
                                            <p>Куда</p>
                                            <p>Город: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.receiver.city}</span></p>
                                            <p>Адрес: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.receiver.address}</span></p>
                                            <p>Телефон: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.receiver.phone}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[2px]">
                                        <p>Размеры <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.packageInfo.package.length} x {delivery.packageInfo.package.width} x {delivery.packageInfo.package.height} см</span></p>
                                        <p>Вес <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.packageInfo.package.weight} кг</span></p>
                                        {delivery.packageInfo.isGoods && <p>Тип отправления <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.packageInfo.typeOfGoods}</span></p>}
                                    </div>
                                </div>
                            ))}
                            <p>Наш сотрудник скоро с вами свяжется по поводу ваших доставок</p>
                            <p>Вы можете связаться с нами по номеру <span className="font-bold hover:text-[#3A906B] duration-600">+7 (999) 999-99-99</span></p>
                        </>
                    )}
                </div>
                <div className="p-[20px] w-[calc(40%-20px)] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
                    <p className="pb-[20px] text-[18px] font-bold">Отследить доставку</p>
                    
                    <ConfigProvider theme={{ token: { colorPrimary: '#3A906B' } }}>
                        <Input
                            placeholder="Введите номер доставки"
                            value={shipmentId}
                            onChange={(e) => setShipmentId(e.target.value)}
                        />
                    </ConfigProvider>
                    <div
                        className="hover:bg-white border hover:border-[#3A906B] hover:text-[#3A906B] duration-600 mt-[20px] flex justify-center items-center bg-[#3A906B] text-white p-[10px] rounded-[15px] cursor-pointer"
                        onClick={() => handleClick(shipmentId)}
                    >
                        Отследить
                    </div>
                </div>

                
            </div>
            {open && delivery && (
                <div onClick={() => setOpen(false)} className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-50">
                    <div onClick={(e) => e.stopPropagation()} className="container flex justify-center items-center h-full">
                        <div className="bg-white p-[20px] flex flex-col gap-[20px] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
                            {delivery && (
                                <>
                                    <div className="flex flex-row gap-[20px] justify-between">
                                        <p>Номер доставки: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.shipmentId}</span></p>
                                        <p>Статус: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.status === 'created' ? 'Создана' : delivery.status === 'in_transit' ? 'В пути' : delivery.status === 'delivered' ? 'Доставлена' : 'Отменена'}</span></p>
                                    </div>
                                    <div className="flex flex-row gap-[20px]">
                                        <div className="flex flex-col gap-[2px]">
                                            <p>Откуда</p>
                                            <p>Город: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.sender.city}</span></p>
                                            <p>Адрес: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.sender.address}</span></p>
                                            <p>Телефон: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.sender.phone}</span></p>
                                        </div>
                                        <div className="flex flex-col gap-[2px]">
                                            <p>Куда</p>
                                            <p>Город: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.receiver.city}</span></p>
                                            <p>Адрес: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.receiver.address}</span></p>
                                            <p>Телефон: <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.receiver.phone}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[2px]">
                                        <p>Размеры <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.packageInfo.package.length} x {delivery.packageInfo.package.width} x {delivery.packageInfo.package.height} см</span></p>
                                        <p>Вес <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.packageInfo.package.weight} кг</span></p>
                                        {delivery.packageInfo.isGoods && <p>Тип отправления <span className="font-bold hover:text-[#3A906B] duration-600">{delivery.packageInfo.typeOfGoods}</span></p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}