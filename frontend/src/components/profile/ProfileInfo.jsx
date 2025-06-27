"use client"

import { useState } from "react"
import { User, MapPin, Globe, MessageSquare, Plus, X, Save } from "lucide-react"
import { LANGUAGES } from "../../constants"

const ProfileInfo = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        nativeLanguage: profile.nativeLanguage || "",
        learningLanguage: profile.learningLanguage || "",
        location: profile.location || "",
        status: profile.status || "",
        availability: profile.availability || "available",
        interests: profile.interests || [],
    })

    const [newInterest, setNewInterest] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onUpdate(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData((prev) => ({
                ...prev,
                interests: [...prev.interests, newInterest.trim()],
            }))
            setNewInterest("")
        }
    }

    const handleRemoveInterest = (interest) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.filter((i) => i !== interest),
        }))
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddInterest()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Personal Information</h3>
                        <p className="text-base-content/70">Basic details about yourself</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Full Name</span>
                            <span className="label-text-alt text-error">Required</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="input input-bordered input-lg focus:input-primary"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Status Message</span>
                        </label>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input input-bordered input-lg focus:input-primary"
                            placeholder="What's on your mind?"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Location</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute top-1/2 transform -translate-y-1/2 left-4 w-5 h-5 text-base-content/70" />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input input-bordered input-lg pl-12 focus:input-primary"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Availability Status</span>
                        </label>
                        <select
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            className="select select-bordered select-lg focus:select-primary"
                        >
                            <option value="available">🟢 Available</option>
                            <option value="busy">🔴 Busy</option>
                            <option value="away">🟡 Away</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Language Information Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-secondary/10 rounded-2xl">
                        <Globe className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Language Exchange</h3>
                        <p className="text-base-content/70">Your language learning journey</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Native Language</span>
                            <span className="label-text-alt text-error">Required</span>
                        </label>
                        <select
                            name="nativeLanguage"
                            value={formData.nativeLanguage}
                            onChange={handleChange}
                            className="select select-bordered select-lg focus:select-primary"
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
                            <span className="label-text-alt text-error">Required</span>
                        </label>
                        <select
                            name="learningLanguage"
                            value={formData.learningLanguage}
                            onChange={handleChange}
                            className="select select-bordered select-lg focus:select-primary"
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

            {/* Bio Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-accent/10 rounded-2xl">
                        <MessageSquare className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">About You</h3>
                        <p className="text-base-content/70">Tell others about yourself</p>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Bio</span>
                        <span className="label-text-alt">{formData.bio.length}/500 characters</span>
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="textarea textarea-bordered textarea-lg h-32 focus:textarea-primary"
                        placeholder="Tell us about yourself, your interests, language learning goals..."
                        maxLength={500}
                    />
                </div>
            </div>

            {/* Interests Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-success/10 rounded-2xl">
                        <Plus className="w-6 h-6 text-success" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Interests & Hobbies</h3>
                        <p className="text-base-content/70">What do you enjoy doing?</p>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Add Interest</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input input-bordered input-lg flex-1 focus:input-primary"
                            placeholder="e.g., Music, Sports, Cooking..."
                            maxLength={30}
                        />
                        <button
                            type="button"
                            onClick={handleAddInterest}
                            className="btn btn-primary btn-lg gap-2"
                            disabled={!newInterest.trim()}
                        >
                            <Plus className="w-5 h-5" />
                            Add
                        </button>
                    </div>
                </div>

                {/* Interests Display */}
                {formData.interests.length > 0 && (
                    <div className="space-y-3">
                        <p className="font-medium text-base-content/80">Your Interests:</p>
                        <div className="flex flex-wrap gap-3">
                            {formData.interests.map((interest, index) => (
                                <div key={index} className="badge badge-primary badge-lg gap-2 p-4">
                                    <span>{interest}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInterest(interest)}
                                        className="btn btn-ghost btn-xs text-primary-content hover:bg-primary-content/20"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-base-300">
                <button
                    type="submit"
                    className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default ProfileInfo
