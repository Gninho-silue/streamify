import { VideoIcon } from 'lucide-react'


const CallButton = ({ handleVideoCall, handleAudioCall}) => {
  return (
    <div className='p=3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0'>
        <button className='btn btn-success btn-sm text-white'
            onClick={handleVideoCall}
           
            >
            <VideoIcon className='w-4 h-4 mr-2' />
            Video 
        </button>
        
        
      
    </div>
  )
}

export default CallButton;
