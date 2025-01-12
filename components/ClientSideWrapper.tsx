'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/app/registerSW'

export function ClientSideWrapper() {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return null
}

