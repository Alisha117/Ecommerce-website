import { requiredUser } from '@/hooks/requiredUser';
import React from 'react'

const OrdersPage = async() => {
const user = await requiredUser();
    
  return (
    <div>OrdersPage</div>
  )
}

export default OrdersPage