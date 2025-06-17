import { CallControls, CallingState, SpeakerLayout, StreamTheme, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { useNavigate } from 'react-router';

const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState  = useCallCallingState();

    const navigate = useNavigate();

    if ( callingState === CallingState.LEFT) return navigate("/");



  return (
    <StreamTheme>
        <SpeakerLayout />
          
        <CallControls />
       
    </StreamTheme>
  )
}

export default CallContent
