"use client"

import { useState, useEffect } from "react"
import { Shield, Eye, Users, Lock, Globe, UserCheck, MessageSquare, Phone } from "lucide-react"

const PrivacySettings = ({ profile, onFormChange }) => {
    const [settings, setSettings] = useState({
        showOnlineStatus: profile?.preferences?.privacy?.showOnlineStatus ?? true,
        showLastSeen: profile?.preferences?.privacy?.showLastSeen ?? true,
        allowFriendRequests: profile?.preferences?.privacy?.allowFriendRequests ?? true,
        profileVisibility: profile?.preferences?.privacy?.profileVisibility || "public",
        messagePrivacy: profile?.preferences?.privacy?.messagePrivacy || "friends",
        callPrivacy: profile?.preferences?.privacy?.callPrivacy || "friends",
        searchable: profile?.preferences?.privacy?.searchable ?? true,
        showActivity: profile?.preferences?.privacy?.showActivity ?? true,
        dataCollection: profile?.preferences?.privacy?.dataCollection ?? true,
        analytics: profile?.preferences?.privacy?.analytics ?? true,
    })

    useEffect(() => {
        onFormChange({
            preferences: {
                ...profile?.preferences,
                privacy: settings,
            },
        })
    }, [settings])

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    const visibilityOptions = [
        {
            value: "public",
            label: "Public",
            description: "Anyone can see your profile",
            icon: <Globe className="w-4 h-4" />,
        },
        {
            value: "friends",
            label: "Friends Only",
            description: "Only your friends can see your profile",
            icon: <Users className="w-4 h-4" />,
        },
        {
            value: "private",
            label: "Private",
            description: "Only you can see your profile",
            icon: <Lock className="w-4 h-4" />,
        },
    ]

    const communicationOptions = [
        { value: "everyone", label: "Everyone", description: "Anyone can contact you" },
        { value: "friends", label: "Friends Only", description: "Only your friends can contact you" },
        { value: "nobody", label: "Nobody", description: "No one can contact you" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="avatar placeholder">
                    <div className="bg-accent text-accent-content rounded-2xl w-12">
                        <Shield className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Privacy Settings</h2>
                    <p className="text-base-content/70">Control who can see your information and interact with you</p>
                </div>
            </div>

            {/* Profile Visibility */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Eye className="w-5 h-5 text-primary" />
                    Profile Visibility
                </h3>

                <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                        <h4 className="font-medium mb-4">Who can see your profile?</h4>
                        <div className="space-y-3">
                            {visibilityOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className="label cursor-pointer justify-start gap-4 p-4 rounded-lg border hover:bg-base-200 transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="profileVisibility"
                                        className="radio radio-primary"
                                        value={option.value}
                                        checked={settings.profileVisibility === option.value}
                                        onChange={(e) => handleChange("profileVisibility", e.target.value)}
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="text-primary">{option.icon}</div>
                                        <div>
                                            <div className="font-medium">{option.label}</div>
                                            <div className="text-sm text-base-content/70">{option.description}</div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity & Status */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-secondary" />
                    Activity & Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                                    <span className="font-medium">Show Online Status</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success"
                                    checked={settings.showOnlineStatus}
                                    onChange={(e) => handleChange("showOnlineStatus", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Let others see when you're online</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Eye className="w-5 h-5 text-info" />
                                    <span className="font-medium">Show Last Seen</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-info"
                                    checked={settings.showLastSeen}
                                    onChange={(e) => handleChange("showLastSeen", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Show when you were last active</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-accent" />
                                    <span className="font-medium">Show Activity</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-accent"
                                    checked={settings.showActivity}
                                    onChange={(e) => handleChange("showActivity", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Show your recent activity to friends</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-warning" />
                                    <span className="font-medium">Searchable</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-warning"
                                    checked={settings.searchable}
                                    onChange={(e) => handleChange("searchable", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Allow others to find you in search</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Communication Privacy */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    Communication Privacy
                </h3>

                <div className="space-y-6">
                    <div className="card bg-base-100 border border-base-300">
                        <div className="card-body">
                            <h4 className="font-medium mb-4 flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Who can send you messages?
                            </h4>
                            <div className="space-y-3">
                                {communicationOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="label cursor-pointer justify-start gap-4 p-3 rounded-lg border hover:bg-base-200 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="messagePrivacy"
                                            className="radio radio-primary"
                                            value={option.value}
                                            checked={settings.messagePrivacy === option.value}
                                            onChange={(e) => handleChange("messagePrivacy", e.target.value)}
                                        />
                                        <div>
                                            <div className="font-medium">{option.label}</div>
                                            <div className="text-sm text-base-content/70">{option.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300">
                        <div className="card-body">
                            <h4 className="font-medium mb-4 flex items-center gap-3">
                                <Phone className="w-5 h-5 text-secondary" />
                                Who can call you?
                            </h4>
                            <div className="space-y-3">
                                {communicationOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="label cursor-pointer justify-start gap-4 p-3 rounded-lg border hover:bg-base-200 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="callPrivacy"
                                            className="radio radio-secondary"
                                            value={option.value}
                                            checked={settings.callPrivacy === option.value}
                                            onChange={(e) => handleChange("callPrivacy", e.target.value)}
                                        />
                                        <div>
                                            <div className="font-medium">{option.label}</div>
                                            <div className="text-sm text-base-content/70">{option.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span className="font-medium">Allow Friend Requests</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={settings.allowFriendRequests}
                                    onChange={(e) => handleChange("allowFriendRequests", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Allow others to send you friend requests</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data & Analytics */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Lock className="w-5 h-5 text-warning" />
                    Data & Analytics
                </h3>

                <div className="alert alert-info">
                    <Shield className="w-5 h-5" />
                    <div>
                        <h4 className="font-bold">Your Privacy Matters</h4>
                        <div className="text-sm">
                            We use this data to improve your experience and provide better recommendations.
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-warning" />
                                    <span className="font-medium">Data Collection</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-warning"
                                    checked={settings.dataCollection}
                                    onChange={(e) => handleChange("dataCollection", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Allow us to collect usage data to improve the service</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Eye className="w-5 h-5 text-error" />
                                    <span className="font-medium">Analytics</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-error"
                                    checked={settings.analytics}
                                    onChange={(e) => handleChange("analytics", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Help us understand how you use the platform</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacySettings
