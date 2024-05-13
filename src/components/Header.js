import React from 'react'
import { BiGlobe } from 'react-icons/bi'
import { CgUserAdd } from 'react-icons/cg'
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='bg-brand-color h-11' >
        <div className='container mx-auto h-11 flex items-center justify-between'>

            <a href='#'>Simgee</a>
        <nav className='flex gap-x-8 text-sm font-semibold'>
            <a href='#' className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'><BiGlobe size={20}/>TÜRKÇE (TR)</a>
            <Link to='/login' className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'><FiLogIn size={20}/> Giriş Yap</Link>
            <Link to='/signup' className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80' ><CgUserAdd size={20}/>Kayıt ol</Link>
            
        </nav>

        </div>
    </div>
  )
}
