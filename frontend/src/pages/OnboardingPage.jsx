import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CameraIcon, LoaderIcon, MapIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { useState } from 'react';

import { completeOnboarding } from '../lib/api';
import  useAuthUser  from '../hooks/useAuthUser.js';
import { LANGUAGES } from '../constants/index.js';
const OnboardingPage = () => {

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [ formState, setFormState ] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    profilePicture: authUser?.profilePicture || '',
    location: authUser?.location || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
  });


  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success('Onboarding completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      navigate('/'); 
    },
    onError: (error) =>{
      toast.error(error.response.data.message);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
     const index = Math.floor(Math.random() * 100) + 1 
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}`; 

    setFormState((prevState) => ({
      ...prevState,
      profilePicture: randomAvatar
    }));
    toast.success("Random Profile Picture generated !")
  };


  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Profile Container */}

            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                { formState.profilePicture ? (
                  <img src={formState.profilePicture} alt="Profile" className='w-full h-full object-cover' />
                ) : ( 
                  <div className='flex items-center justify-center h-full '>
                    <CameraIcon className='size-16 text-base-content opacity-40' />
                  </div>
                )}
              </div>
              {/* Generate Random Profile Picture */}
              <div className='flex items-center gap-2'>
                <button type='button' className='btn btn-accent btn-sm' onClick={handleRandomAvatar}>
                  <ShuffleIcon className='size-4 mr-2' />
                  Generate Random Avatar
                </button>

              </div>
              { /* Form Fields */}
              <div className='form-control space-y-4 w-full'>
                <label className='label'>
                  <span className='label-text'>Full Name</span>
                </label>
                <input
                  type='text'
                  placeholder='Full Name'
                  className='input input-bordered w-full'
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                />
              </div> 
              <div className='form-control space-y-4 w-full'> 
                <label className='label'>
                  <span className='label-text'>Bio</span>
                </label>
                <textarea
                  placeholder='Bio'
                  className='textarea textarea-bordered w-full'
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                />
              </div>
              { /* Language Selection */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>

                <div className='form-control space-y-4 w-full'>
                  <label className='label'>
                    <span className='label-text'> Native Language</span>
                  </label>
                  <select
                    name='nativeLanguage'
                    className='select select-bordered w-full'
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  >
                    <option value=''>Select Your Native Language</option>
                    { LANGUAGES.map((language) => (
                      <option key={language} value={language.toLowerCase()}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-control space-y-4 w-full'>
                  <label className='label'>
                    <span className='label-text'> Learning Language</span>
                  </label>  
                  <select
                    name='learningLanguage'
                    className='select select-bordered w-full'
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({ ... formState, learningLanguage: e.target.value })}  
                    >
                      <option value="">Select Your Learning  Language</option>
                        {LANGUAGES.map((language) => (
                          <option key={`learning-${language}`} value={language.toLowerCase()}>
                            { language }
                          </option>
                        ))}

                    </select>
                </div>  
            </div>
             <div className='form-control space-y-4 w-full'>
                <label className='label'>
                  <span className='label-text'>Location</span>
                </label>
                <div className='relative'>
                  <MapPinIcon className='absolute top-1/2 transform -translate-y1/2 left-3 size-5
                      text-base-content opacity-70' />
                  <input
                  type='text'
                  name='location'
                  placeholder='City, Country'
                  className='input input-bordered w-full'
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                />
                </div>
                
              </div>  
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
              { !isPending ? (
                <>
                  <ShipWheelIcon className='size-5 mr-2' />
                  Complete Onboarding
                </> 
              ) : (
                <> 
                  <LoaderIcon className='animate-spin size-5 mr-2' />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default OnboardingPage;
