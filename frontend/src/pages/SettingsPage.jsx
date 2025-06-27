"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProfile, updatePreferences } from "../lib/api"
import toast from "react-hot-toast"
import {
    BellIcon,
    ShieldIcon,
    PaletteIcon,
    GlobeIcon,
    UserIcon,
    Settings,
    Save,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react"
import { useThemeStore } from "../store/useThemeStore"
import SettingsLoader from "../components/settings/settings-loader"
import GeneralSettings from "../components/settings/general-settings"
import NotificationSettings from "../components/settings/notification-settings"
import PrivacySettings from "../components/settings/privacy-settings"
import AppearanceSettings from "../components/settings/appearance-settings"
import AccountSettings from "../components/settings/account-settings"

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("general")
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [formData, setFormData] = useState({})
    const queryClient = useQueryClient()
    const { theme } = useThemeStore()

    const { data: profile, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    })

    const updatePreferencesMutation = useMutation({
        mutationFn: updatePreferences,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            setHasUnsavedChanges(false)
            toast.success("Settings updated successfully")
        },
        onError: (error) => {
            console.error("Settings update error:", error)
            toast.error(error.response?.data?.message || "Failed to update settings")
        },
    })

    // Track form changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                e.returnValue = ""
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [hasUnsavedChanges])

    if (isLoading) {
        return <SettingsLoader />
    }

    const handleFormChange = (data) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setHasUnsavedChanges(true)
    }

    const handleSaveChanges = () => {
        updatePreferencesMutation.mutate(formData)
    }

    const tabs = [
        {
            id: "general",
            label: "General",
            icon: <GlobeIcon className="w-5 h-5" />,
            description: "Language, timezone, and basic preferences",
            color: "text-primary",
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: <BellIcon className="w-5 h-5" />,
            description: "Email, push, and sound notifications",
            color: "text-secondary",
        },
        {
            id: "privacy",
            label: "Privacy",
            icon: <ShieldIcon className="w-5 h-5" />,
            description: "Visibility and interaction controls",
            color: "text-accent",
        },
        {
            id: "appearance",
            label: "Appearance",
            icon: <PaletteIcon className="w-5 h-5" />,
            description: "Themes, fonts, and display options",
            color: "text-info",
        },
        {
            id: "account",
            label: "Account",
            icon: <UserIcon className="w-5 h-5" />,
            description: "Security, data, and account management",
            color: "text-warning",
        },
    ]

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="hero bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl mb-8">
                        <div className="hero-content text-center py-12">
                            <div className="max-w-2xl">
                                <div className="badge badge-primary badge-lg gap-2 mb-4">
                                    <Settings className="w-4 h-4" />
                                    Account Settings
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Customize Your Experience
                                </h1>
                                <p className="text-lg text-base-content/80 max-w-xl mx-auto">
                                    Personalize your account settings and preferences to make the platform work perfectly for you
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Unsaved Changes Alert */}
                    {hasUnsavedChanges && (
                        <div className="alert alert-warning shadow-lg mb-6 animate-in slide-in-from-top duration-300">
                            <AlertTriangle className="w-5 h-5" />
                            <div className="flex-1">
                                <h3 className="font-bold">Unsaved Changes</h3>
                                <div className="text-sm opacity-80">
                                    You have unsaved changes that will be lost if you leave this page.
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-sm btn-ghost" onClick={() => setHasUnsavedChanges(false)}>
                                    Discard
                                </button>
                                <button
                                    className="btn btn-sm btn-primary gap-2"
                                    onClick={handleSaveChanges}
                                    disabled={updatePreferencesMutation.isPending}
                                >
                                    {updatePreferencesMutation.isPending ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col xl:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="xl:w-80">
                            <div className="card bg-base-100 shadow-xl border border-base-300 sticky top-8">
                                <div className="card-body p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary text-primary-content rounded-2xl w-12">
                                                <Settings className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="card-title text-lg">Settings</h2>
                                            <p className="text-sm text-base-content/70">Manage your preferences</p>
                                        </div>
                                    </div>

                                    <nav className="space-y-2">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                                                    activeTab === tab.id
                                                        ? "bg-gradient-to-r from-primary/20 to-secondary/10 shadow-lg scale-[1.02]"
                                                        : "hover:bg-base-200 hover:scale-[1.01]"
                                                }`}
                                            >
                                                <div className="flex items-start gap-4 p-4 text-left">
                                                    <div
                                                        className={`${tab.color} ${activeTab === tab.id ? "scale-110" : ""} transition-transform duration-300`}
                                                    >
                                                        {tab.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className={`font-semibold mb-1 ${activeTab === tab.id ? tab.color : ""} transition-colors duration-300`}
                                                        >
                                                            {tab.label}
                                                        </div>
                                                        <div className="text-xs text-base-content/60 leading-relaxed">{tab.description}</div>
                                                    </div>
                                                    {activeTab === tab.id && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                                {activeTab === tab.id && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
                                                )}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            <div className="card bg-base-100 shadow-xl border border-base-300">
                                <div className="card-body p-8">
                                    <div className="animate-in fade-in slide-in-from-right duration-500">
                                        {activeTab === "general" && <GeneralSettings profile={profile} onFormChange={handleFormChange} />}
                                        {activeTab === "notifications" && (
                                            <NotificationSettings profile={profile} onFormChange={handleFormChange} />
                                        )}
                                        {activeTab === "privacy" && <PrivacySettings profile={profile} onFormChange={handleFormChange} />}
                                        {activeTab === "appearance" && (
                                            <AppearanceSettings profile={profile} onFormChange={handleFormChange} />
                                        )}
                                        {activeTab === "account" && <AccountSettings profile={profile} onFormChange={handleFormChange} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
