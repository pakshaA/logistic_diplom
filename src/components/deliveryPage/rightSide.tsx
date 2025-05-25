'use client'

import { useEffect, useState } from 'react'
import { ConfigProvider, Input, Select } from 'antd'
import { getAddress } from '@/helpers/api/getAddress/getAddress'

interface IRightSideProps {
  city: string
  onDataChange?: (data: { phone: string; address: string }) => void
}

export const RightSide = ({ city, onDataChange }: IRightSideProps) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [addressSelect, setAddressSelect] = useState('')

  const onChange = (value: string) => {
    setAddressSelect(value)
  }

  const onSearch = async (value: string) => {
    if (!value || !city) return
    setLoading(true)
    try {
      const data = await getAddress(value, city)
      const suggestions = data.results || []
      setOptions(
        suggestions.map((s: {value: string}) => ({
          value: s.value,
          label: s.value
        }))
      )
    } catch (error) {
      console.error('Ошибка при получении адресов:', error)
    } finally {
      setLoading(false)
    }
  }

  // Обновление данных при изменении адреса или телефона
  useEffect(() => {
    onDataChange?.({ phone, address: addressSelect })
  }, [phone, addressSelect])

  // Очистка при смене города
  useEffect(() => {
    setPhone('')
    setAddressSelect('')
    setOptions([])
  }, [city])

  return (
    <div className="flex flex-col gap-[20px]">
      <ConfigProvider theme={{ token: { colorPrimary: '#3A906B' } }}>
        <Select
          showSearch
          placeholder="Выберите адрес доставки"
          filterOption={false}
          value={addressSelect || undefined}
          onSearch={onSearch}
          onChange={onChange}
          onClear={() => {
            setAddressSelect('')
            setOptions([])
          }}
          loading={loading}
          options={options}
          allowClear
        />
      </ConfigProvider>

      <ConfigProvider theme={{ token: { colorPrimary: '#3A906B' } }}>
        <Input
          placeholder="Введите номер получателя"
          allowClear
          value={phone} // ✅ делаем поле управляемым
          onChange={(e) => setPhone(e.target.value)}
        />
      </ConfigProvider>
    </div>
  )
}
