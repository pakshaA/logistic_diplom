'use client'
import { ConfigProvider, Radio, RadioChangeEvent } from 'antd'

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
    const onChangeRadio = (e: RadioChangeEvent) => {
        onChange(e.target.value)
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