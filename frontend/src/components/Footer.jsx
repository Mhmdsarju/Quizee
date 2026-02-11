import React from 'react'
import logo from '../assets/logo22.png'

export default function Footer() {
  return (
    <footer className='bg-gray-50 border-t border-gray-200  px-4'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0'>
            
            <div className='flex-shrink-0'>
                <img src={logo} alt="Quizee Logo" className='h-9 w-auto'/>
            </div>

            <div className='flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0'>
                <ul className='flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600'>
                    <li className='hover:text-blue-600 cursor-pointer transition-colors'>Jobs</li>
                    <li className='hover:text-blue-600 cursor-pointer transition-colors'>Terms</li>
                    <li className='hover:text-blue-600 cursor-pointer transition-colors'>Privacy Policy</li>
                </ul>
                
                <p className='text-sm text-gray-500 border-t md:border-t-0 md:border-l border-gray-300 pt-4 md:pt-0 md:pl-8'>
                    Copyright © 2025 Quizee.
                </p>
            </div>

        </div>
    </footer>
  )
}