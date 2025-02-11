import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <div className='flex w-full  justify-between items-center px-4 my-1'>
            <div className=' text-sm opacity-80'>© 2025 All rights reserved.</div>
            <Link className=' hover:underline  text-sm opacity-80' href={''}>@pratikgrv</Link></div>
    )
}

export default Footer