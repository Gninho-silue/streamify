import { BellIcon } from 'lucide-react'
import React from 'react'

const NoNotificationsFound = () => {
  return (
    <div className='flex flex-col items-center justify-center  py-16 text-center'>
        <div className='size-16 rounded-full bg-base-300 flex items-center justify-center mb-4'>
            <BellIcon className='size-8 text-gray-500' />
        </div>
      <h2 className='text-xl font-semibold text-gray-700'>No Notifications Found</h2>
      <p className='text-gray-500'>You have no new notifications at the moment.</p>
      
    </div>
  )
}

export default NoNotificationsFound
