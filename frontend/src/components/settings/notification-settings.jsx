"use client"

import { useState, useEffect } from "react"
import { Bell, Mail, Smartphone, Volume2, Moon, Users, MessageCircle } from "lucide-react"

const NotificationSettings = ({ profile, onFormChange }) => {
    const [settings, setSettings] = useState({
        email: profile?.preferences?.notifications?.email ?? true,
        push: profile?.preferences?.notifications?.push ?? true,
        sound: profile?.preferences?.notifications?.sound ?? true,
        desktop: profile?.preferences?.notifications?.desktop ?? true,
        marketing: profile?.preferences?.notifications?.marketing ?? false,
        security: profile?.preferences?.notifications?.security ?? true,
        friends: profile?.preferences?.notifications?.friends ?? true,
        messages: profile?.preferences?.notifications?.messages ?? true,
        calls: profile?.preferences?.notifications?.calls ?? true,
        doNotDisturb: profile?.preferences?.notifications?.doNotDisturb ?? false,
        quietHoursStart: profile?.preferences?.notifications?.quietHoursStart || "22:00",
        quietHoursEnd: profile?.preferences?.notifications?.quietHoursEnd || "08:00",
        soundVolume: profile?.preferences?.notifications?.soundVolume || 50,
    })

    useEffect(() => {
        onFormChange({
            preferences: {
                ...profile?.preferences,
                notifications: settings,
            },
        })
    }, [settings])

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    const notificationTypes = [
        {
            key: "messages",
            title: "Messages",
            description: "New messages from friends and contacts",
            icon: <MessageCircle className="w-5 h-5" />,
            color: "text-primary",
        },
        {
            key: "calls",
            title: "Calls",
            description: "Incoming voice and video calls",
            icon: <Smartphone className="w-5 h-5" />,
            color: "text-secondary",
        },
        {
            key: "friends",
            title: "Friend Requests",
            description: "New friend requests and acceptances",
            icon: <Users className="w-5 h-5" />,
            color: "text-accent",
        },
        {
            key: "security",
            title: "Security Alerts",
            description: "Login attempts and security updates",
            icon: <Bell className="w-5 h-5" />,
            color: "text-warning",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="avatar placeholder">
                    <div className="bg-secondary text-secondary-content rounded-2xl w-12">
                        <Bell className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Notification Settings</h2>
                    <p className="text-base-content/70">Control how and when you receive notifications</p>
                </div>
            </div>

            {/* Do Not Disturb */}
            <div className="card bg-gradient-to-br from-info/10 to-primary/5 border border-info/20">
                <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Moon className="w-6 h-6 text-info" />
                            <div>
                                <h3 className="font-semibold text-lg">Do Not Disturb</h3>
                                <p className="text-sm text-base-content/70">Silence notifications during quiet hours</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-info toggle-lg"
                            checked={settings.doNotDisturb}
                            onChange={(e) => handleChange("doNotDisturb", e.target.checked)}
                        />
                    </div>

                    {settings.doNotDisturb && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top duration-300">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Quiet Hours Start</span>
                                </label>
                                <input
                                    type="time"
                                    className="input input-bordered input-info"
                                    value={settings.quietHoursStart}
                                    onChange={(e) => handleChange("quietHoursStart", e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Quiet Hours End</span>
                                </label>
                                <input
                                    type="time"
                                    className="input input-bordered input-info"
                                    value={settings.quietHoursEnd}
                                    onChange={(e) => handleChange("quietHoursEnd", e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Methods */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    Notification Methods
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <span className="font-medium">Email Notifications</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={settings.email}
                                    onChange={(e) => handleChange("email", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Receive notifications via email</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-secondary" />
                                    <span className="font-medium">Push Notifications</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-secondary"
                                    checked={settings.push}
                                    onChange={(e) => handleChange("push", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Mobile and browser push notifications</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Volume2 className="w-5 h-5 text-accent" />
                                    <span className="font-medium">Sound Notifications</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-accent"
                                    checked={settings.sound}
                                    onChange={(e) => handleChange("sound", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Play sounds for notifications</p>

                            {settings.sound && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top duration-300">
                                    <label className="label">
                                        <span className="label-text-alt">Volume: {settings.soundVolume}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={settings.soundVolume}
                                        className="range range-accent range-sm"
                                        onChange={(e) => handleChange("soundVolume", Number.parseInt(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-info" />
                                    <span className="font-medium">Desktop Notifications</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-info"
                                    checked={settings.desktop}
                                    onChange={(e) => handleChange("desktop", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Show desktop notifications</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Types */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Bell className="w-5 h-5 text-secondary" />
                    What to notify me about
                </h3>

                <div className="space-y-4">
                    {notificationTypes.map((type) => (
                        <div
                            key={type.key}
                            className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="card-body py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`${type.color}`}>{type.icon}</div>
                                        <div>
                                            <h4 className="font-medium">{type.title}</h4>
                                            <p className="text-sm text-base-content/70">{type.description}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings[type.key]}
                                        onChange={(e) => handleChange(type.key, e.target.checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Marketing */}
            <div className="card bg-gradient-to-br from-warning/10 to-error/5 border border-warning/20">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-3">
                                <Mail className="w-5 h-5 text-warning" />
                                Marketing Communications
                            </h3>
                            <p className="text-sm text-base-content/70 mt-1">
                                Receive updates about new features, tips, and promotional content
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-warning toggle-lg"
                            checked={settings.marketing}
                            onChange={(e) => handleChange("marketing", e.target.checked)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationSettings
