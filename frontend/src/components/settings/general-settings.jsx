"use client"

import { useState, useEffect } from "react"
import { Globe, Clock, Languages, Eye } from "lucide-react"

const GeneralSettings = ({ profile, onFormChange }) => {
    const [settings, setSettings] = useState({
        language: profile?.preferences?.language || "en",
        timezone: profile?.preferences?.timezone || "UTC",
        dateFormat: profile?.preferences?.dateFormat || "MM/DD/YYYY",
        timeFormat: profile?.preferences?.timeFormat || "12h",
        country: profile?.preferences?.country || "",
        currency: profile?.preferences?.currency || "USD",
    })

    const [previewTime, setPreviewTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setPreviewTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        onFormChange({ preferences: { ...profile?.preferences, ...settings } })
    }, [settings])

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    const languages = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
        { code: "es", name: "Español", flag: "🇪🇸" },
        { code: "de", name: "Deutsch", flag: "🇩🇪" },
        { code: "it", name: "Italiano", flag: "🇮🇹" },
        { code: "pt", name: "Português", flag: "🇵🇹" },
        { code: "ru", name: "Русский", flag: "🇷🇺" },
        { code: "ja", name: "日本語", flag: "🇯🇵" },
        { code: "ko", name: "한국어", flag: "🇰🇷" },
        { code: "zh", name: "中文", flag: "🇨🇳" },
    ]

    const timezones = [
        "UTC-12:00",
        "UTC-11:00",
        "UTC-10:00",
        "UTC-09:00",
        "UTC-08:00",
        "UTC-07:00",
        "UTC-06:00",
        "UTC-05:00",
        "UTC-04:00",
        "UTC-03:00",
        "UTC-02:00",
        "UTC-01:00",
        "UTC+00:00",
        "UTC+01:00",
        "UTC+02:00",
        "UTC+03:00",
        "UTC+04:00",
        "UTC+05:00",
        "UTC+06:00",
        "UTC+07:00",
        "UTC+08:00",
        "UTC+09:00",
        "UTC+10:00",
        "UTC+11:00",
        "UTC+12:00",
    ]

    const formatPreviewTime = () => {
        const options = {
            timeZone: settings.timezone.replace("UTC", "GMT"),
            hour12: settings.timeFormat === "12h",
            year: "numeric",
            month: settings.dateFormat.includes("MM") ? "2-digit" : "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }
        return previewTime.toLocaleString(settings.language, options)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-2xl w-12">
                        <Globe className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">General Settings</h2>
                    <p className="text-base-content/70">Configure your basic preferences and regional settings</p>
                </div>
            </div>

            {/* Preview Card */}
            <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Live Preview</h3>
                    </div>
                    <div className="bg-base-100 rounded-xl p-4 border">
                        <div className="text-sm text-base-content/70 mb-1">Current time in your timezone:</div>
                        <div className="text-xl font-mono font-bold text-primary">{formatPreviewTime()}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Language Settings */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Languages className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-semibold">Language & Region</h3>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Display Language</span>
                            <span className="label-text-alt text-primary">Required</span>
                        </label>
                        <select
                            className="select select-bordered select-primary w-full"
                            value={settings.language}
                            onChange={(e) => handleChange("language", e.target.value)}
                        >
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                </option>
                            ))}
                        </select>
                        <label className="label">
                            <span className="label-text-alt">This affects the interface language</span>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Country/Region</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered input-primary w-full"
                            placeholder="e.g., United States"
                            value={settings.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Currency</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={settings.currency}
                            onChange={(e) => handleChange("currency", e.target.value)}
                        >
                            <option value="USD">🇺🇸 USD - US Dollar</option>
                            <option value="EUR">🇪🇺 EUR - Euro</option>
                            <option value="GBP">🇬🇧 GBP - British Pound</option>
                            <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                            <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                            <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                        </select>
                    </div>
                </div>

                {/* Time & Date Settings */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-semibold">Time & Date</h3>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Timezone</span>
                            <span className="label-text-alt text-primary">Required</span>
                        </label>
                        <select
                            className="select select-bordered select-accent w-full"
                            value={settings.timezone}
                            onChange={(e) => handleChange("timezone", e.target.value)}
                        >
                            {timezones.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Date Format</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="label cursor-pointer justify-start gap-3 p-3 rounded-lg border hover:bg-base-200 transition-colors">
                                <input
                                    type="radio"
                                    name="dateFormat"
                                    className="radio radio-primary"
                                    value="MM/DD/YYYY"
                                    checked={settings.dateFormat === "MM/DD/YYYY"}
                                    onChange={(e) => handleChange("dateFormat", e.target.value)}
                                />
                                <span className="label-text">MM/DD/YYYY</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3 p-3 rounded-lg border hover:bg-base-200 transition-colors">
                                <input
                                    type="radio"
                                    name="dateFormat"
                                    className="radio radio-primary"
                                    value="DD/MM/YYYY"
                                    checked={settings.dateFormat === "DD/MM/YYYY"}
                                    onChange={(e) => handleChange("dateFormat", e.target.value)}
                                />
                                <span className="label-text">DD/MM/YYYY</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Time Format</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="label cursor-pointer justify-start gap-3 p-3 rounded-lg border hover:bg-base-200 transition-colors">
                                <input
                                    type="radio"
                                    name="timeFormat"
                                    className="radio radio-accent"
                                    value="12h"
                                    checked={settings.timeFormat === "12h"}
                                    onChange={(e) => handleChange("timeFormat", e.target.value)}
                                />
                                <span className="label-text">12 Hour (AM/PM)</span>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3 p-3 rounded-lg border hover:bg-base-200 transition-colors">
                                <input
                                    type="radio"
                                    name="timeFormat"
                                    className="radio radio-accent"
                                    value="24h"
                                    checked={settings.timeFormat === "24h"}
                                    onChange={(e) => handleChange("timeFormat", e.target.value)}
                                />
                                <span className="label-text">24 Hour</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneralSettings
