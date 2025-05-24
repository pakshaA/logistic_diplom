'use client';

import { useEffect, useState } from 'react';
import { Button, Tabs, Input, Typography, Space, Menu, Popover, ConfigProvider } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface CustomSize {
  length: string;
  width: string;
  height: string;
  weight: string;
  id: string;
  isGoods: boolean;
  typeOfGoods: string;
}

interface IProps {
    onSelect: (selectedPackage: CustomSize) => void;
    defaultValue: CustomSize;
}

const presetPackages = [
  {
    id: 'envelope',
    label: 'Конверт',
    size: '34×27×2 см',
    weightLabel: 'до 0.5 кг',
    length: 34,
    width: 27,
    height: 2,
    weight: 0.5
  },
  {
    id: 'box_xs',
    label: 'Короб XS',
    size: '17×12×9 см',
    weightLabel: 'до 0.5 кг',
    length: 17,
    width: 12,
    height: 9,
    weight: 0.5
  },
  {
    id: 'box_s',
    label: 'Короб S',
    size: '23×19×10 см',
    weightLabel: 'до 2 кг',
    length: 23,
    width: 19,
    height: 10,
    weight: 2
  },
  {
    id: 'box_m',
    label: 'Короб M',
    size: '33×25×15 см',
    weightLabel: 'до 5 кг',
    length: 33,
    width: 25,
    height: 15,
    weight: 5
  },
  {
    id: 'box_l',
    label: 'Короб L',
    size: '31×25×38 см',
    weightLabel: 'до 12 кг',
    length: 31,
    width: 25,
    height: 38,
    weight: 12
  },
  {
    id: 'box_xl',
    label: 'Короб XL',
    size: '60×35×30 см',
    weightLabel: 'до 18 кг',
    length: 60,
    width: 35,
    height: 30,
    weight: 18
  },
  {
    id: 'suitcase',
    label: 'Чемодан',
    size: '55×35×77 см',
    weightLabel: 'до 30 кг',
    length: 55,
    width: 35,
    height: 77,
    weight: 30
  },
  {
    id: 'pallet',
    label: 'Паллета',
    size: '120×120×80 см',
    weightLabel: 'до 200 кг',
    length: 120,
    width: 120,
    height: 80,
    weight: 200
  }
];

export const PackageSelect = ({onSelect, defaultValue}: IProps) => {
  
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customSize, setCustomSize] = useState<CustomSize>({
    length: '',
    width: '',
    height: '',
    weight: '',
    id: '',
    isGoods: false,
    typeOfGoods: ''
  });

  const handlePresetSelect = (id: string) => {
    const preset = presetPackages.find((p) => p.id === id);
    if (preset) {
      const newPackage = {
        length: String(preset.length),
        width: String(preset.width),
        height: String(preset.height),
        weight: String(preset.weight),
        id: preset.id,
        isGoods: false,
        typeOfGoods: ''
      };
      setCustomSize(newPackage);
      setSelectedPreset(id);
      setVisible(false);
      onSelect(newPackage);
    }
  };

  const handleCustomChange = (field: keyof typeof customSize, value: string) => {
    setCustomSize((prev) => ({
      ...prev,
      [field]: value,
      id: 'custom'
    }));
    setSelectedPreset(null);
  };

  const handleConfirmCustom = () => {
    if (customSize.length && customSize.width && customSize.height && customSize.weight) {
      setSelectedPreset(null);
      setVisible(false);
      onSelect(customSize);
    }
  };

  useEffect(() => {
    const preset = presetPackages.find((p) => p.id === defaultValue.id);
    if (preset) {
      const newPackage = {
        length: String(preset.length),
        width: String(preset.width),
        height: String(preset.height),
        weight: String(preset.weight),
        id: preset.id,
        isGoods: false,
        typeOfGoods: ''
      };
      setCustomSize(newPackage);
      setSelectedPreset(preset.id);
    } else {
      setCustomSize(defaultValue);
      setSelectedPreset(null);
    }
  }, [defaultValue]);

  const menuContent = (
    <div style={{ padding: 12, width: 300 }}>
      <Tabs
        activeKey={tabKey}
        
        onChange={setTabKey}
        items={[
            {
            key: 'preset',
            label: 'Примерно',
            children: (
                <Menu
                    selectedKeys={[selectedPreset || '']}
                    onClick={({ key }) => handlePresetSelect(key)}
                    items={presetPackages.map((pack) => ({
                        key: pack.id,
                        label: (
                        <Typography.Text strong>
                            {pack.label} | {pack.size}, {pack.weightLabel}
                        </Typography.Text>
                        )
                    }))}
                />
            )
            },
            {
            key: 'custom',
            label: 'Точные',
            children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Длина, см"
                    value={customSize.length ?? ''}
                    type="number"
                    onChange={(e) => handleCustomChange('length', e.target.value)}
                />
                <Input
                    placeholder="Ширина, см"
                    value={customSize.width ?? ''}
                    type="number"
                    onChange={(e) => handleCustomChange('width', e.target.value)}
                />
                <Input
                    placeholder="Высота, см"
                    value={customSize.height ?? ''}
                    type="number"
                    onChange={(e) => handleCustomChange('height', e.target.value)}
                />
                <Input
                    placeholder="Вес, кг"
                    value={customSize.weight ?? ''}
                    type="number"
                    onChange={(e) => handleCustomChange('weight', e.target.value)}
                />
                <Button type="primary" onClick={handleConfirmCustom}>
                    Подтвердить
                </Button>
                </Space>
            )
            }
        ]}
        />
    </div>
  );

  const displayText =
    selectedPreset
      ? presetPackages.find((p) => p.id === selectedPreset)?.label
      : customSize.length && customSize.width && customSize.height && customSize.weight
        ? `${customSize.length}×${customSize.width}×${customSize.height} см, до ${customSize.weight} кг`
        : 'Упаковка';

  return (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#3A906B',
            },
        }}
    >
        <Popover
        content={menuContent}
        open={visible}
        onOpenChange={setVisible}
        trigger="click"
        >
        <Button icon={<DownOutlined />}>{displayText}</Button>
        </Popover>
    </ConfigProvider>
  );
};
