'use client'
import { ConfigProvider, Radio, RadioChangeEvent } from 'antd'
import { useState } from 'react';

interface RadioOption {
    label: string;
    value: string;
}

interface IProps {
    onChange: (value: string) => void;
}

const options: RadioOption[] = [
    { label: 'Предметы', value: 'items' },
    { label: 'Еда', value: 'food' },
]

export const RadioGroup = ({onChange}: IProps) => {
    const [value, setValue] = useState('items')
    const onChangeRadio = (e: RadioChangeEvent) => {
        setValue((e.target as HTMLInputElement).value)
        onChange((e.target as HTMLInputElement).value)
    }
    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#3A906B',
            },
        }}>
            <Radio.Group options={options} defaultValue='items' onChange={onChangeRadio} optionType='button'/>
        </ConfigProvider>
    )
}