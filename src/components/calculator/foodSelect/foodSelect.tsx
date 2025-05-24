'use client';

import { useEffect, useState } from 'react';
import { Select, Form, Row, Col, ConfigProvider } from 'antd';

interface ProductType {
  id: string;
  label: string;
  shelfLifeDays: number;
}

interface IProps {
    onChange: (value: string) => void;
}

const productTypes: ProductType[] = [
  { id: 'perishable', label: 'Скоропортящиеся', shelfLifeDays: 3 },
  { id: 'frozen', label: 'Замороженные', shelfLifeDays: 30 },
  { id: 'non_perishable', label: 'Нескоропортящиеся', shelfLifeDays: 180 },
  { id: 'fresh', label: 'Свежие продукты', shelfLifeDays: 7 },
  { id: 'bakery', label: 'Выпечка', shelfLifeDays: 2 },
];

const placeholder = 'Выберите тип продукта';

export const ProductSelector = ({onChange}: IProps) => {
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);

  return (
    <ConfigProvider theme={{
        token: {
            colorPrimary: '#3A906B',
        },
    }}>
        <Row gutter={[16, 16]} justify="start" style={{ maxWidth: 300 }}>
        <Col span={24}>
            <Form.Item>
            <Select
                value={selectedType?.id || ''}
                onChange={(value) => {
                const type = productTypes.find((pt) => pt.id === value) || null;
                    setSelectedType(type);
                    onChange(value);
                }}
                placeholder={placeholder}
                allowClear
            >
                {productTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                    <Row justify="space-between" style={{ width: '100%' }}>
                    <Col>{type.label}</Col>
                    <Col>{type.shelfLifeDays} дней</Col>
                    </Row>
                </Select.Option>
                ))}
            </Select>
            </Form.Item>
        </Col>
        </Row>
    </ConfigProvider>
  );
};
