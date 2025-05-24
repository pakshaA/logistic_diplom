'use client'

import { ConfigProvider, Select } from 'antd';
import cities from '@/helpers/mock/filtered_cities.json'

interface SelectProps {
    placeholder: string
    onChange?: (label: string) => void
    defaultValue?: string | null
}

export const CustomSelect = ({placeholder, onChange, defaultValue}: SelectProps) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#3A906B',
                },
            }}
        >
            <Select 
                showSearch
                style={{ minWidth: 200 }}
                placeholder={placeholder}
                optionFilterProp='label'
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={cities.cities.map(city => ({
                    value: city.name,
                    label: city.name
                }))}
                allowClear
                onChange={onChange}
                defaultValue={defaultValue || undefined}
            />
        </ConfigProvider>
    )
}