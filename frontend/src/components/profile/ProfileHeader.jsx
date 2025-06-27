"use client"

import { useState } from "react"
import { CameraIcon, Upload, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { compressImage, validateImageFile } from "../../utils/imageUtils"
import toast from "react-hot-toast"

const ProfileHeader = ({ profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [coverImage, setCoverImage] = useState(profile.coverPicture)
    const [profileImage, setProfileImage] = useState(profile.profilePicture)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleImageUpload = async (file, type) => {
        try {
            setIsUploading(true)
            setUploadProgress(0)

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90))
            }, 100)

            // Valider le fichier
            validateImageFile(file)

            // Compresser l'image
            const compressedImage = await compressImage(
                file,
                type === "profile" ? 400 : 800,
                type === "profile" ? 400 : 600,
                0.8,
            )

            clearInterval(progressInterval)
            setUploadProgress(100)

            // Mettre à jour l'état local
            if (type === "cover") {
                setCoverImage(compressedImage)
                onUpdate({ coverPicture: compressedImage })
            } else {
                setProfileImage(compressedImage)
                onUpdate({ profilePicture: compressedImage })
            }

            toast.success(`${type === "cover" ? "Cover" : "Profile"} image updated successfully! ✨`, {
                icon: "🎉",
                duration: 3000,
            })
        } catch (error) {
            console.error("Image upload error:", error)
            toast.error(error.message || "Failed to upload image. Please try again.")
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            handleImageUpload(file, "cover")
        }
    }

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            handleImageUpload(file, "profile")
        }
    }

    const getAvailabilityConfig = (availability) => {
        switch (availability) {
            case "available":
                return { color: "bg-success", text: "Available", pulse: "animate-pulse" }
            case "busy":
                return { color: "bg-error", text: "Busy", pulse: "" }
            default:
                return { color: "bg-warning", text: "Away", pulse: "" }
        }
    }

    const availabilityConfig = getAvailabilityConfig(profile.availability)

    return (
        <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
            {/* Cover Image Section */}
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                {coverImage ? (
                    <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <div className="text-center">
                            <Upload className="w-12 h-12 text-base-content/40 mx-auto mb-2" />
                            <span className="text-base-content/60 font-medium">Add a cover image</span>
                        </div>
                    </div>
                )}

                {/* Cover Image Upload Button */}
                <label
                    className={`absolute bottom-4 right-4 btn btn-circle btn-lg bg-base-100/90 backdrop-blur-sm border-base-300 hover:bg-base-100 shadow-lg transition-all duration-300 ${
                        isUploading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                    }`}
                >
                    <CameraIcon className="w-6 h-6" />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleCoverImageChange}
                        disabled={isUploading}
                    />
                </label>

                {/* Upload Progress Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="card bg-base-100 shadow-2xl p-6">
                            <div className="text-center space-y-4">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <div>
                                    <p className="font-bold mb-2">Uploading Image...</p>
                                    <div className="w-48 bg-base-300 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-base-content/70 mt-2">{uploadProgress}% complete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Info Section */}
            <div className="relative px-8 py-6">
                {/* Profile Image */}
                <div className="absolute -top-16 left-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-base-100 overflow-hidden bg-base-300 shadow-2xl">
                            {profileImage ? (
                                <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <CameraIcon className="w-8 h-8 text-base-content/40" />
                                </div>
                            )}
                        </div>

                        {/* Profile Image Upload Button */}
                        <label
                            className={`absolute bottom-2 right-2 btn btn-circle btn-sm bg-primary text-primary-content border-2 border-base-100 shadow-lg transition-all duration-300 ${
                                isUploading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                            }`}
                        >
                            <CameraIcon className="w-4 h-4" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleProfileImageChange}
                                disabled={isUploading}
                            />
                        </label>
                    </div>
                </div>

                {/* User Info */}
                <div className="ml-40 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                            <div className={`badge ${availabilityConfig.color} gap-2 text-white`}>
                                <div className={`w-2 h-2 rounded-full bg-current ${availabilityConfig.pulse}`} />
                                {availabilityConfig.text}
                            </div>
                        </div>
                        <p className="text-base-content/70 text-lg">{profile.status || "No status set"}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {profile.nativeLanguage && (
                                <div className="badge badge-primary gap-1">
                                    <span className="font-bold">Native:</span>
                                    {profile.nativeLanguage}
                                </div>
                            )}
                            {profile.learningLanguage && (
                                <div className="badge badge-secondary gap-1">
                                    <span className="font-bold">Learning:</span>
                                    {profile.learningLanguage}
                                </div>
                            )}
                            {profile.location && <div className="badge badge-accent gap-1">📍 {profile.location}</div>}
                        </div>
                    </div>

                    {/* Edit Button */}
                    <button
                        className="btn btn-primary gap-2 btn-lg shadow-lg hover:shadow-primary/25 transition-all duration-300"
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={isUploading}
                    >
                        <Sparkles className="w-5 h-5" />
                        {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                </div>

                {/* Stats Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-base-200/50 rounded-2xl p-4">
                        <div className="stat-figure text-primary">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Profile Status</div>
                        <div className="stat-value text-primary text-lg">Complete</div>
                        <div className="stat-desc">All sections filled</div>
                    </div>

                    <div className="stat bg-base-200/50 rounded-2xl p-4">
                        <div className="stat-figure text-secondary">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Member Since</div>
                        <div className="stat-value text-secondary text-lg">2024</div>
                        <div className="stat-desc">Active learner</div>
                    </div>

                    <div className="stat bg-base-200/50 rounded-2xl p-4">
                        <div className="stat-figure text-accent">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Privacy</div>
                        <div className="stat-value text-accent text-lg">Secure</div>
                        <div className="stat-desc">Data protected</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
