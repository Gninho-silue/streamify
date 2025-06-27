"use client"

import { useState } from "react"
import { Github, Linkedin, Twitter, Globe, Save, ExternalLink } from "lucide-react"

const ProfileSocial = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState({
        socialLinks: {
            website: profile.socialLinks?.website || "",
            twitter: profile.socialLinks?.twitter || "",
            linkedin: profile.socialLinks?.linkedin || "",
            github: profile.socialLinks?.github || "",
        },
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            socialLinks: {
                ...prev.socialLinks,
                [name]: value,
            },
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onUpdate({ socialLinks: formData.socialLinks })
        } finally {
            setIsSubmitting(false)
        }
    }

    const socialPlatforms = [
        {
            key: "website",
            label: "Personal Website",
            icon: <Globe className="w-5 h-5" />,
            placeholder: "https://yourwebsite.com",
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            key: "twitter",
            label: "Twitter",
            icon: <Twitter className="w-5 h-5" />,
            placeholder: "https://twitter.com/username",
            color: "text-info",
            bgColor: "bg-info/10",
        },
        {
            key: "linkedin",
            label: "LinkedIn",
            icon: <Linkedin className="w-5 h-5" />,
            placeholder: "https://linkedin.com/in/username",
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            key: "github",
            label: "GitHub",
            icon: <Github className="w-5 h-5" />,
            placeholder: "https://github.com/username",
            color: "text-base-content",
            bgColor: "bg-base-300/50",
        },
    ]

    const isValidUrl = (url) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center gap-3 justify-center mb-4">
                    <div className="p-3 bg-secondary/10 rounded-2xl">
                        <ExternalLink className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Social Connections</h3>
                        <p className="text-base-content/70">Connect your social media profiles</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Social Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {socialPlatforms.map((platform) => (
                        <div key={platform.key} className="card bg-base-200/50 p-6 border border-base-300">
                            <div className="form-control">
                                <label className="label">
                  <span className="label-text font-medium flex items-center gap-3">
                    <div className={`p-2 ${platform.bgColor} rounded-xl`}>
                      <span className={platform.color}>{platform.icon}</span>
                    </div>
                      {platform.label}
                  </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        name={platform.key}
                                        value={formData.socialLinks[platform.key]}
                                        onChange={handleChange}
                                        className="input input-bordered input-lg w-full focus:input-primary pr-12"
                                        placeholder={platform.placeholder}
                                    />
                                    {formData.socialLinks[platform.key] && isValidUrl(formData.socialLinks[platform.key]) && (
                                        <a
                                            href={formData.socialLinks[platform.key]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                            title="Visit link"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                {formData.socialLinks[platform.key] && !isValidUrl(formData.socialLinks[platform.key]) && (
                                    <div className="label">
                                        <span className="label-text-alt text-error">Please enter a valid URL</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Preview Section */}
                <div className="card bg-base-100 border border-base-300 p-6">
                    <h4 className="font-bold text-lg mb-4">Preview</h4>
                    <div className="flex flex-wrap gap-3">
                        {socialPlatforms.map((platform) => {
                            const url = formData.socialLinks[platform.key]
                            if (!url || !isValidUrl(url)) return null

                            return (
                                <a
                                    key={platform.key}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline gap-2 hover:scale-105 transition-all duration-300"
                                >
                                    {platform.icon}
                                    {platform.label}
                                </a>
                            )
                        })}
                        {!Object.values(formData.socialLinks).some((url) => url && isValidUrl(url)) && (
                            <p className="text-base-content/70 italic">Add social links to see preview</p>
                        )}
                    </div>
                </div>

                {/* Info Alert */}
                <div className="alert alert-info">
                    <div className="flex items-start gap-3">
                        <ExternalLink className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold mb-1">Social Media Tips</h3>
                            <p className="text-sm">
                                Adding your social media profiles helps other language learners connect with you and discover shared
                                interests. All links will open in a new tab for security.
                            </p>
                        </div>
                    </div>
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
                                Saving Links...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Social Links
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProfileSocial
