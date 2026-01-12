import React from 'react'
import logo from '../assets/logo22.png'
export default function Footer() {
  return (
    <div className='bg-gray-50 flex justify-around items-center relative bottom-0'>
        <div>
        <img src={logo} alt="" className='h-9'/>
        </div>
        <div>
            <ul className='flex justify-around space-x-5' >
                <li>
                    <p>Copyright © 2025 Quizee.</p>
                </li>
                <li><p>Jobs</p></li>
                <li><p>Terms</p></li>
                <li><p>Privacy Policy</p></li>
            </ul>
        </div>
    </div>
  )
}
