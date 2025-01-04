import React from 'react'

function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>ProductsLayout</h1>
      {children}
    </div>
  )
}

export default ProductsLayout