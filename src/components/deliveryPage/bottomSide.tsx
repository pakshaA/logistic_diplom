'use client'

import { InputNumber } from 'antd'

interface BottomSideProps {
    packageCounts: Record<string, number>
    onPackageCountsChange: (counts: Record<string, number>) => void
    cost: number
  }
  

const packageTypes = [
    'Конверт',
    'Короб XS',
    'Короб S',
    'Короб M',
    'Короб L',
    'Короб XL',
    'Чемодан',
    'Паллета',
]

const packagePrices: Record<string, number> = {
    'Конверт': 50,
    'Короб XS': 70,
    'Короб S': 100,
    'Короб M': 150,
    'Короб L': 200,
    'Короб XL': 250,
    'Чемодан': 300,
    'Паллета': 400,
}

export const BottomSide = ({packageCounts, onPackageCountsChange, cost}: BottomSideProps) => {
    const handleCountChange = (label: string, value: number | null) => {
        onPackageCountsChange({
            ...packageCounts,
            [label]: value ?? 0,
        })
    }

    const totalCost = cost + Object.entries(packageCounts).reduce((acc, [label, count]) => acc + packagePrices[label] * count, 0)

    return (
        <div className="flex gap-[20px] w-full">
            {/* Левая часть — упаковки */}
            <div className="flex flex-col gap-[20px] w-[calc(80%-20px)] p-[20px] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
                <h1 className="text-xl font-semibold">Дополнительные опции</h1>
                <div>
                    <h2 className="text-lg font-medium mb-2">Дополнительная упаковка</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {packageTypes.map((label) => (
                            <div key={label} className="flex items-center gap-2">
                                <span className="min-w-[90px]">{label}</span>
                                <InputNumber
                                    min={0}
                                    max={100}
                                    value={packageCounts[label] || 0}
                                    onChange={(value) => handleCountChange(label, value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Правая часть — сумма */}
            <div className="flex flex-col gap-[20px] w-[calc(20%-20px)] p-[20px] border border-[#3A906B] shadow-[0_0_30px_0_#3A906B] rounded-[15px]">
                <h2 className="text-lg font-medium">Сумма</h2>
                <p>Сумма за расстояние: {cost} руб.</p>
                {packageCounts && Object.entries(packageCounts).length > 0 && (
                    <>
                        <p>Дополнительные опции:</p>
                        {Object.entries(packageCounts).map(([label, count]) => (
                            <div key={label}>
                                <p>{label} - {count} шт.: {packagePrices[label] * count} руб. </p>
                                <p>-------------------</p>
                            </div>
                        ))}
                    </>
                )}
                <p>Итого: {totalCost || ''} руб.</p>
            </div>
        </div>
    )
}
