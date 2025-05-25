'use client'

import React, { Suspense } from 'react'
import DeliveryPage from './pa'

export default function DeliveryClientPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <DeliveryPage />
    </Suspense>
  )
}
