import React from 'react'

async function ProductPage({params}: {params: Promise<{productId: string}>}) {
  const {productId} = await params;
  return (
    <div>
      <h1>ProductPage</h1>
      <p>{productId}</p>
    </div>
  )
}

export default ProductPage