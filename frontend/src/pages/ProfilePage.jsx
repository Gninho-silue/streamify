"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProfile, updateProfile, updatePreferences } from "../lib/api"
import toast from "react-hot-toast"
import ProfileHeader from "../components/profile/ProfileHeader"
import ProfileInfo from "../components/profile/ProfileInfo"
import ProfilePreferences from "../components/profile/ProfilePreferences"
import ProfileSocial from "../components/profile/ProfileSocial"
import ProfileLoader from "../components/profile/ProfileLoader"
import { User, Settings, Link2, Sparkles, Shield } from "lucide-react"

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("info")
    const queryClient = useQueryClient()

    const { data: profile, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            toast.success("Profile updated successfully! ✨", {
                duration: 4000,
                icon: "🎉",
            })
        },
        onError: (error) => {
            console.error("Profile update error:", error)
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to update profile. Please check your data and try again."
            toast.error(errorMessage)
        },
    })

    const updatePreferencesMutation = useMutation({
        mutationFn: updatePreferences,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            toast.success("Preferences updated successfully! ⚙️", {
                duration: 4000,
                icon: "✅",
            })
        },
        onError: (error) => {
            console.error("Preferences update error:", error)
            const errorMessage =
                error.response?.data?.message || error.message || "Failed to update preferences. Please try again."
            toast.error(errorMessage)
        },
    })

    if (isLoading) return <ProfileLoader />

    const handleProfileUpdate = (data) => {
        try {
            // Validation basique des données
            if (data.fullName && data.fullName.trim().length < 2) {
                toast.error("Full name must be at least 2 characters long")
                return
            }

            if (data.bio && data.bio.length > 500) {
                toast.error("Bio must be less than 500 characters")
                return
            }

            updateProfileMutation.mutate(data)
        } catch (error) {
            console.error("Profile update validation error:", error)
            toast.error("Invalid data provided. Please check your input.")
        }
    }

    const handlePreferencesUpdate = (data) => {
        try {
            updatePreferencesMutation.mutate(data)
        } catch (error) {
            console.error("Preferences update error:", error)
            toast.error("Failed to update preferences. Please try again.")
        }
    }

    const tabs = [
        {
            id: "info",
            label: "Profile Info",
            icon: <User className="w-4 h-4" />,
            description: "Personal information and bio",
        },
        {
            id: "social",
            label: "Social Links",
            icon: <Link2 className="w-4 h-4" />,
            description: "Connect your social accounts",
        },
        {
            id: "preferences",
            label: "Preferences",
            icon: <Settings className="w-4 h-4" />,
            description: "Privacy and notification settings",
        },
    ]

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Profile Management
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Your Profile
                    </h1>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                        Manage your personal information, preferences, and social connections
                    </p>
                </div>

                {/* Profile Header */}
                <ProfileHeader profile={profile} onUpdate={handleProfileUpdate} />

                {/* Tabs Section */}
                <div className="mt-12">
                    {/* Tab Navigation */}
                    <div className="card bg-base-100 shadow-xl border border-base-300 mb-8">
                        <div className="card-body p-0">
                            <div className="tabs tabs-boxed bg-transparent p-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`tab tab-lg gap-2 transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? "tab-active bg-primary text-primary-content shadow-lg"
                                                : "hover:bg-base-200"
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.icon}
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Description */}
                            <div className="px-4 pb-4">
                                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                    <div className="p-2 bg-primary/10 rounded-lg">{tabs.find((tab) => tab.id === activeTab)?.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                                        <p className="text-sm text-base-content/70">
                                            {tabs.find((tab) => tab.id === activeTab)?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body p-8">
                            <div className="animate-in slide-in-from-right-5 duration-300">
                                {activeTab === "info" && <ProfileInfo profile={profile} onUpdate={handleProfileUpdate} />}
                                {activeTab === "social" && <ProfileSocial profile={profile} onUpdate={handleProfileUpdate} />}
                                {activeTab === "preferences" && (
                                    <ProfilePreferences preferences={profile.preferences} onUpdate={handlePreferencesUpdate} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8">
                    <div className="alert alert-info shadow-lg">
                        <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold mb-1">Privacy & Security</h3>
                                <p className="text-sm">
                                    Your personal information is encrypted and secure. Only you can see and modify your private details.
                                    Public information helps other language learners connect with you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
