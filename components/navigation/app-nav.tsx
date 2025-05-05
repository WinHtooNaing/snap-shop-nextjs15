import React from 'react'
import NavBarLogo from './nav-logo'
import UserButton from './user-button'
import { auth } from '@/server/auth'

const NavBar = async() => {
    const session = await auth();
  return (
    <nav className='flex items-center justify-between py-4 '>
    <NavBarLogo/>
    <UserButton user={session?.user} expires={session?.expires!}/>
  </nav>
  )
}

export default NavBar