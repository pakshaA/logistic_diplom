'use client'

import { CustomSelect } from "@/components/templates"
import { useSearchParams } from "next/navigation"
import { PackageSelect } from "@/components/boxDropDown/box1"
import { useState, useEffect } from "react"
import {LeftSide} from "@/components/deliveryPage/leftSide"
import {RightSide} from "@/components/deliveryPage/rightSide"
import { RadioGroup } from "@/components/calculator/radio/radio"
import { ProductSelector } from "@/components/calculator/foodSelect/foodSelect"
import { BottomSide } from "@/components/deliveryPage/bottomSide"
import { price } from "@/helpers/api/getsum/getsum"
import { createDelivery } from "@/helpers/api/createDelivery/createDilevery"
import { notification } from "antd"

interface PackageState {
  package: {
    width: string;
    height: string;
    length: string;
    weight: string;
    id: string;
  };
  isGoods: boolean;
  typeOfGoods: string;
}


export default function DeliveryPage() {
  const searchParams = useSearchParams()

  const cityFrom = searchParams.get('cityFrom') || ''
  const cityTo = searchParams.get('cityTo') || ''

  const rawPackage = searchParams.get('packageInfo')
  const parsedPackage = rawPackage ? JSON.parse(rawPackage) : {}

  const [cityFromSelect, setCityFromSelect] = useState(cityFrom)
  const [cityToSelect, setCityToSelect] = useState(cityTo)
  const [packageInfoSelect, setPackageInfoSelect] = useState<PackageState>({
    package: {
      length: parsedPackage.length || '',
      width: parsedPackage.width || '',
      height: parsedPackage.height || '',
      weight: parsedPackage.weight || '',
      id: parsedPackage.id || '',
    },
    isGoods: parsedPackage.isGoods || false,
    typeOfGoods: parsedPackage.typeOfGoods || ''
  })
  

  const [senderData, setSenderData] = useState({ phone: '', address: '' })
  const [receiverData, setReceiverData] = useState({ phone: '', address: '' })

  const [isPhoneSenderValid, setIsPhoneSenderValid] = useState(true)
  const [isPhoneReceiverValid, setIsPhoneReceiverValid] = useState(true)

  const [selectedRadio, setSelectedRadio] = useState<'items' | 'food'>('items')
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined)
  const [additionalPackages, setAdditionalPackages] = useState<Record<string, number>>({})
  const [deliveryPrice, setDeliveryPrice] = useState(0)

  const [api, contextHolder] = notification.useNotification()

  const handleAdditionalPackagesChange = (newCounts: Record<string, number>) => {
    setAdditionalPackages(newCounts)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/
    return phoneRegex.test(phone)
  }

  useEffect(() => {
    setIsPhoneSenderValid(validatePhone(senderData.phone))
    setIsPhoneReceiverValid(validatePhone(receiverData.phone))
  }, [senderData.phone, receiverData.phone])
  
  useEffect(() => {
    const cityFrom = searchParams.get('cityFrom') || ''
    const cityTo = searchParams.get('cityTo') || ''
    const rawPackage = searchParams.get('packageInfo')
    const parsedPackage = rawPackage ? JSON.parse(rawPackage) : {}

    setCityFromSelect(cityFrom)
    setCityToSelect(cityTo)
    setPackageInfoSelect({
      package: {
        length: parsedPackage.length || '',
        width: parsedPackage.width || '',
        height: parsedPackage.height || '',
        weight: parsedPackage.weight || '',
        id: parsedPackage.id || '',
      },
      isGoods: parsedPackage.isGoods || false,
      typeOfGoods: parsedPackage.typeOfGoods || ''
    })

    if (typeof window !== 'undefined' && window.history.replaceState) {
      const cleanUrl = window.location.pathname
      window.history.replaceState(null, '', cleanUrl)
    }
  }, [])

  const openNotificationWithIcon = ({type, message, description}: {type: 'success' | 'error', message: string, description: string}) => {
    if (type === 'success') {
      api.success({
        message,
        description,
      });
    } else {
      api.error({
        message,
        description,
      });
    }
  };

  const handleSubmit = async () => {
    const newDelivery = {
      sender: {
        city: cityFromSelect,
        address: senderData.address,
        phone: senderData.phone,
      },
      receiver: {
        city: cityToSelect,
        address: receiverData.address,
        phone: receiverData.phone,
      },
      packageInfo: packageInfoSelect,
    }

    if (!newDelivery.packageInfo.typeOfGoods) {
      newDelivery.packageInfo.typeOfGoods = ' '
    }
    try {
      await createDelivery(newDelivery)
      openNotificationWithIcon({
        type: 'success',
        message: 'Заказ успешно создан',
        description: 'Заказ успешно создан',
      })
    } catch (error: unknown) {
      const err = error as { status?: number };
    
      openNotificationWithIcon({
        type: 'error',
        message: 'Ошибка при создании заказа',
        description:
          err.status === 400
            ? 'Заполнены не все поля'
            : err.status === 401
            ? 'Необходимо авторизоваться'
            : err.status === 500
            ? 'Произошла ошибка на сервере'
            : 'Произошла ошибка',
      });
    }
    
  };

  useEffect(() => {
    if (selectedRadio === 'food' && selectedProduct) {
      setPackageInfoSelect(prev => ({
        ...prev,
        isGoods: true,
        typeOfGoods: selectedProduct,
      }))
    }
  }, [selectedProduct, selectedRadio])
  
  useEffect(() => {
    const fetchPrice = async () => {
      if (
        cityFromSelect &&
        cityToSelect &&
        senderData.address &&
        receiverData.address &&
        validatePhone(senderData.phone) &&
        validatePhone(receiverData.phone) &&
        packageInfoSelect.package.id &&
        (selectedRadio === 'items' || (selectedRadio === 'food' && selectedProduct))
      ) {
        const orderInfo = {
          sender: {
            city: cityFromSelect,
            ...senderData,
          },
          receiver: {
            city: cityToSelect,
            ...receiverData,
          },
          package: packageInfoSelect,
        };
  
        const cost = await price(orderInfo.sender.city, orderInfo.receiver.city, orderInfo.package)
        setDeliveryPrice(cost)
        console.log('🧮 Автоматически рассчитанная стоимость:', cost)
      }
    }
  
    fetchPrice()
  }, [
    cityFromSelect,
    cityToSelect,
    senderData,
    receiverData,
    packageInfoSelect,
    selectedProduct,
    selectedRadio
  ])
  

  return (
    <div className="mt-[80px]">
      {contextHolder}
      <div className="container">
        <div>
          <h1 className="text-[36px] mb-[20px]">Оформление доставки</h1>
          <div className="flex gap-[20px] w-full mb-[20px]">
            
            {/* Отправка */}
            <div className="flex flex-col gap-[20px] w-[calc(40%-20px)] p-[20px] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
              <h2>Параметры отправления</h2>
              <CustomSelect 
                placeholder="Выберите город отправки"
                defaultValue={cityFromSelect}
                onChange={(value) => setCityFromSelect(value)}
              />
              <LeftSide city={cityFromSelect} onDataChange={(data) => setSenderData(data)} />
              {!isPhoneSenderValid && senderData.phone ? (
                <p className="text-red-500">Неверный формат номера</p>
              ) : null}
            </div>

            {/* Получение */}
            <div className="flex flex-col gap-[20px] w-[calc(40%-20px)] p-[20px] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
              <h2>Параметры доставки</h2>
              <CustomSelect 
                placeholder="Выберите город доставки"
                defaultValue={cityToSelect}
                onChange={(value) => setCityToSelect(value)}
              />
              <RightSide city={cityToSelect} onDataChange={(data) => setReceiverData(data)}/>
              {!isPhoneReceiverValid && receiverData.phone ? (
                <p className="text-red-500">Неверный формат номера</p>
              ) : null}
            </div>

            {/* Упаковка */}
            <div className="flex flex-col gap-[20px] w-[calc(20%-20px)] p-[20px] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
              <PackageSelect
                defaultValue={{
                  length: parsedPackage.length || '',
                  width: parsedPackage.width || '',
                  height: parsedPackage.height || '',
                  weight: parsedPackage.weight || '',
                  id: parsedPackage.id || '',
                  isGoods: parsedPackage.isGoods || false,
                  typeOfGoods: parsedPackage.typeOfGoods || ''
                }}
                onSelect={(selected) => setPackageInfoSelect(prev => ({
                  package: selected,
                  isGoods: prev.isGoods,
                  typeOfGoods: prev.typeOfGoods
                }))}
              />
              <RadioGroup onChange={(selectedRadio: string) => setSelectedRadio(selectedRadio as 'items' | 'food')} />
              {selectedRadio === 'food' && (
                <ProductSelector onChange={(selectedProduct: string) => setSelectedProduct(selectedProduct)} />
              )}
              <div onClick={handleSubmit} className="w-full h-[50px] bg-[#3A906B] text-white rounded-[15px] cursor-pointer text-center hover:bg-[#339966] transition-all duration-300">
                Оформить доставку
              </div>
            </div>
          </div>
          <BottomSide cost={deliveryPrice} packageCounts={additionalPackages} onPackageCountsChange={handleAdditionalPackagesChange} />
        </div>
      </div>
    </div>
  )
}
