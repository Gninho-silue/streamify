"use client"

import { useState } from "react"
import { Palette, Bell, Shield, Save, Moon, Sun, Monitor } from "lucide-react"

const ProfilePreferences = ({ preferences, onUpdate }) => {
    const [formData, setFormData] = useState({
        theme: preferences?.theme || "system",
        notifications: {
            email: preferences?.notifications?.email ?? true,
            push: preferences?.notifications?.push ?? true,
            sound: preferences?.notifications?.sound ?? true,
        },
        privacy: {
            showOnlineStatus: preferences?.privacy?.showOnlineStatus ?? true,
            showLastSeen: preferences?.privacy?.showLastSeen ?? true,
            allowFriendRequests: preferences?.privacy?.allowFriendRequests ?? true,
        },
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleThemeChange = (e) => {
        const { value } = e.target
        setFormData((prev) => ({
            ...prev,
            theme: value,
        }))
    }

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [name]: checked,
            },
        }))
    }

    const handlePrivacyChange = (e) => {
        const { name, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [name]: checked,
            },
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

    const themeOptions = [
        { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
        { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
        { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Theme Preferences */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Palette className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Theme Preferences</h3>
                        <p className="text-base-content/70">Customize your visual experience</p>
                    </div>
                </div>

                <div className="card bg-base-200/50 p-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Theme Mode</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {themeOptions.map((option) => (
                                <label key={option.value} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={option.value}
                                        checked={formData.theme === option.value}
                                        onChange={handleThemeChange}
                                        className="radio radio-primary hidden"
                                    />
                                    <div
                                        className={`card border-2 transition-all duration-300 ${
                                            formData.theme === option.value
                                                ? "border-primary bg-primary/10 shadow-lg"
                                                : "border-base-300 hover:border-primary/50"
                                        }`}
                                    >
                                        <div className="card-body items-center text-center p-6">
                                            <div
                                                className={`p-3 rounded-2xl mb-3 ${
                                                    formData.theme === option.value ? "bg-primary/20" : "bg-base-300"
                                                }`}
                                            >
                                                {option.icon}
                                            </div>
                                            <h4 className="font-bold">{option.label}</h4>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-warning/10 rounded-2xl">
                        <Bell className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Notification Settings</h3>
                        <p className="text-base-content/70">Control how you receive updates</p>
                    </div>
                </div>

                <div className="card bg-base-200/50 p-6">
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    name="email"
                                    checked={formData.notifications.email}
                                    onChange={handleNotificationChange}
                                    className="checkbox checkbox-primary checkbox-lg"
                                />
                                <div>
                                    <span className="label-text font-medium text-lg">Email Notifications</span>
                                    <p className="text-sm text-base-content/70">Receive updates via email</p>
                                </div>
                            </label>
                        </div>

                        <div className="divider"></div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    name="push"
                                    checked={formData.notifications.push}
                                    onChange={handleNotificationChange}
                                    className="checkbox checkbox-primary checkbox-lg"
                                />
                                <div>
                                    <span className="label-text font-medium text-lg">Push Notifications</span>
                                    <p className="text-sm text-base-content/70">Get instant browser notifications</p>
                                </div>
                            </label>
                        </div>

                        <div className="divider"></div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    name="sound"
                                    checked={formData.notifications.sound}
                                    onChange={handleNotificationChange}
                                    className="checkbox checkbox-primary checkbox-lg"
                                />
                                <div>
                                    <span className="label-text font-medium text-lg">Sound Notifications</span>
                                    <p className="text-sm text-base-content/70">Play sounds for new messages</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Preferences */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-error/10 rounded-2xl">
                        <Shield className="w-6 h-6 text-error" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Privacy & Security</h3>
                        <p className="text-base-content/70">Control your visibility and interactions</p>
                    </div>
                </div>

                <div className="card bg-base-200/50 p-6">
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    name="showOnlineStatus"
                                    checked={formData.privacy.showOnlineStatus}
                                    onChange={handlePrivacyChange}
                                    className="checkbox checkbox-primary checkbox-lg"
                                />
                                <div>
                                    <span className="label-text font-medium text-lg">Show Online Status</span>
                                    <p className="text-sm text-base-content/70">Let others see when you're online</p>
                                </div>
                            </label>
                        </div>

                        <div className="divider"></div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    name="showLastSeen"
                                    checked={formData.privacy.showLastSeen}
                                    onChange={handlePrivacyChange}
                                    className="checkbox checkbox-primary checkbox-lg"
                                />
                                <div>
                                    <span className="label-text font-medium text-lg">Show Last Seen</span>
                                    <p className="text-sm text-base-content/70">Display when you were last active</p>
                                </div>
                            </label>
                        </div>

                        <div className="divider"></div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    name="allowFriendRequests"
                                    checked={formData.privacy.allowFriendRequests}
                                    onChange={handlePrivacyChange}
                                    className="checkbox checkbox-primary checkbox-lg"
                                />
                                <div>
                                    <span className="label-text font-medium text-lg">Allow Friend Requests</span>
                                    <p className="text-sm text-base-content/70">Let others send you friend requests</p>
                                </div>
                            </label>
                        </div>
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
                            Saving Preferences...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Preferences
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default ProfilePreferences
