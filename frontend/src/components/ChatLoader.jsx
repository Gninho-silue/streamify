import React from 'react'
import { LoaderIcon } from 'react-hot-toast'

const ChatLoader = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center p-4'>
        <LoaderIcon className="animate-spin h-12 w-12 text-primary" />
        <p className="text-lg text-gray-700">Loading chat...</p>
        <p className="text-sm text-gray-500">Please wait while we set up your chat experience.</p>
    </div>
  )
}

export default ChatLoader
