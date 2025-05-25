// app/delivery/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DeliveryPage = dynamic(() => import('@/components/deliveries/pa'), { ssr: false })

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <DeliveryPage />
    </Suspense>
  )
}
