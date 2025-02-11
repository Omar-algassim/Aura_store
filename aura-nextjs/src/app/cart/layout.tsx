import React from 'react'
import {Header } from '@/components/ui/Header'

function CartLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col items-center">
      <Header />
      {children}
    </div>
  )
}

export default CartLayout