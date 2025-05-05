import { ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NavBarLogo = () => {
  return (
    <Link href={"/"} className='text-3xl font-bold text-primary'><ShoppingBasket size={40} /></Link>
  )
}

export default NavBarLogo