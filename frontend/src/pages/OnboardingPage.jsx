"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  CameraIcon,
  ShipWheelIcon,
  ShuffleIcon,
  MapPinIcon,
  Globe,
  User,
  Languages,
  Sparkles,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

import { completeOnboarding } from "../lib/api"
import useAuthUser from "../hooks/useAuthUser.js"
import { LANGUAGES } from "../constants/index.js"

const OnboardingPage = () => {
  const { authUser } = useAuthUser()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePicture: authUser?.profilePicture || "",
    location: authUser?.location || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Welcome to Streamify! Your profile is now complete!")
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
      navigate("/")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onboardingMutation(formState)
  }

  const handleRandomAvatar = () => {
    const index = Math.floor(Math.random() * 100) + 1
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}`

    setFormState((prevState) => ({
      ...prevState,
      profilePicture: randomAvatar,
    }))
    toast.success("New avatar generated! Looking good! ✨")
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formState.fullName.trim() !== ""
      case 2:
        return formState.profilePicture !== ""
      case 3:
        return formState.nativeLanguage !== "" && formState.learningLanguage !== ""
      case 4:
        return true // Bio and location are optional
      default:
        return false
    }
  }

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return <User className="w-5 h-5" />
      case 2:
        return <CameraIcon className="w-5 h-5" />
      case 3:
        return <Languages className="w-5 h-5" />
      case 4:
        return <Globe className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center p-4">
        <div className="card bg-base-100 w-full max-w-4xl shadow-2xl border border-base-300">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <ShipWheelIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
                  <p className="text-sm text-base-content/60 font-medium">Language Exchange Platform</p>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Complete Your Profile
              </h1>
              <p className="text-base-content/70 text-lg">Let's set up your language learning journey!</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <ul className="steps steps-horizontal w-full">
                {[1, 2, 3, 4].map((step) => (
                    <li
                        key={step}
                        className={`step ${step <= currentStep ? "step-primary" : ""} ${
                            step < currentStep ? "step-success" : ""
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {getStepIcon(step)}
                        <span className="hidden sm:inline">
                      {step === 1 && "Basic Info"}
                          {step === 2 && "Profile Picture"}
                          {step === 3 && "Languages"}
                          {step === 4 && "Details"}
                    </span>
                      </div>
                    </li>
                ))}
              </ul>
              <div className="text-center mt-4">
              <span className="text-sm text-base-content/60">
                Step {currentStep} of {totalSteps}
              </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                    <div className="text-center mb-6">
                      <div className="p-4 bg-primary/10 rounded-2xl inline-block mb-4">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">What's your name?</h2>
                      <p className="text-base-content/70">This is how other learners will know you</p>
                    </div>

                    <div className="form-control max-w-md mx-auto">
                      <label className="label">
                        <span className="label-text font-medium">Full Name</span>
                      </label>
                      <input
                          type="text"
                          placeholder="Enter your full name"
                          className="input input-bordered input-lg w-full focus:input-primary"
                          value={formState.fullName}
                          onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                          required
                      />
                    </div>
                  </div>
              )}

              {/* Step 2: Profile Picture */}
              {currentStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                    <div className="text-center mb-6">
                      <div className="p-4 bg-secondary/10 rounded-2xl inline-block mb-4">
                        <CameraIcon className="w-8 h-8 text-secondary" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Choose your avatar</h2>
                      <p className="text-base-content/70">A picture helps others connect with you</p>
                    </div>

                    <div className="flex flex-col items-center space-y-6">
                      <div className="avatar">
                        <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                          {formState.profilePicture ? (
                              <img
                                  src={formState.profilePicture || "/placeholder.svg"}
                                  alt="Profile"
                                  className="w-full h-full object-cover rounded-full"
                              />
                          ) : (
                              <div className="flex items-center justify-center h-full bg-base-300">
                                <CameraIcon className="w-12 h-12 text-base-content/40" />
                              </div>
                          )}
                        </div>
                      </div>

                      <button type="button" className="btn btn-primary gap-2 btn-lg" onClick={handleRandomAvatar}>
                        <ShuffleIcon className="w-5 h-5" />
                        Generate Random Avatar
                      </button>
                    </div>
                  </div>
              )}

              {/* Step 3: Languages */}
              {currentStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                    <div className="text-center mb-6">
                      <div className="p-4 bg-accent/10 rounded-2xl inline-block mb-4">
                        <Languages className="w-8 h-8 text-accent" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Language Exchange</h2>
                      <p className="text-base-content/70">What languages do you speak and want to learn?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Native Language</span>
                          <span className="label-text-alt text-primary">Required</span>
                        </label>
                        <select
                            className="select select-bordered select-lg focus:select-primary"
                            value={formState.nativeLanguage}
                            onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                            required
                        >
                          <option value="">Select your native language</option>
                          {LANGUAGES.map((language) => (
                              <option key={language} value={language.toLowerCase()}>
                                {language}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Learning Language</span>
                          <span className="label-text-alt text-primary">Required</span>
                        </label>
                        <select
                            className="select select-bordered select-lg focus:select-primary"
                            value={formState.learningLanguage}
                            onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                            required
                        >
                          <option value="">Select language to learn</option>
                          {LANGUAGES.map((language) => (
                              <option key={`learning-${language}`} value={language.toLowerCase()}>
                                {language}
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
              )}

              {/* Step 4: Additional Details */}
              {currentStep === 4 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                    <div className="text-center mb-6">
                      <div className="p-4 bg-success/10 rounded-2xl inline-block mb-4">
                        <Sparkles className="w-8 h-8 text-success" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Tell us more about you</h2>
                      <p className="text-base-content/70">Help others get to know you better (optional)</p>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Bio</span>
                          <span className="label-text-alt">Optional</span>
                        </label>
                        <textarea
                            placeholder="Tell us about your interests, hobbies, or language learning goals..."
                            className="textarea textarea-bordered textarea-lg focus:textarea-primary h-32"
                            value={formState.bio}
                            onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Location</span>
                          <span className="label-text-alt">Optional</span>
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-4 w-5 h-5 text-base-content/70" />
                          <input
                              type="text"
                              placeholder="City, Country"
                              className="input input-bordered input-lg w-full pl-12 focus:input-primary"
                              value={formState.location}
                              onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8">
                <button
                    type="button"
                    className={`btn btn-outline ${currentStep === 1 ? "btn-disabled" : ""}`}
                    onClick={prevStep}
                    disabled={currentStep === 1}
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((step) => (
                      <div
                          key={step}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              step === currentStep ? "bg-primary scale-125" : step < currentStep ? "bg-success" : "bg-base-300"
                          }`}
                      />
                  ))}
                </div>

                {currentStep < totalSteps ? (
                    <button
                        type="button"
                        className={`btn btn-primary ${!isStepValid(currentStep) ? "btn-disabled" : ""}`}
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                    >
                      Next
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="btn btn-success gap-2 btn-lg"
                        disabled={isPending || !isStepValid(currentStep)}
                    >
                      {isPending ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Setting up...
                          </>
                      ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Complete Setup
                          </>
                      )}
                    </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}

export default OnboardingPage
