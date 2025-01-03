import React from 'react'

function CartLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <h1>Cart</h1>
      {children}
    </div>
  )
}

export default CartLayout