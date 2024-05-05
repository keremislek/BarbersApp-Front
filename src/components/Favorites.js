import React, { useEffect, useState } from 'react'
import Title from './ui/Title'
import ProductItem from './ui/ProductItem'
import productsData from '../api/products.json'

export default function Favorites() {
  
  const [products,setProducts]=useState([]);

  useEffect(()=>{
    setProducts(productsData)
  },[])
  
    return (
    <div>
        <Title>Favoriler</Title>
        <div className='grid grid-cols-8 gap-1 bg-white rounded-lg overflow-hidden'>
            {products.length && products.map(product=> <ProductItem key={product.id} product={product} />)}
        </div>
    </div>
  )
}
