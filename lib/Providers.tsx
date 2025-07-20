'use client'

import { Provider } from 'react-redux'
import { store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
          <Toaster />
        </PersistGate>
      </Provider>
    </SessionProvider>
  )
}
