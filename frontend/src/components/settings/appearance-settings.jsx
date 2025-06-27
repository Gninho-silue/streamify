"use client"

import { useState, useEffect } from "react"
import { Palette, Monitor, Sun, Moon, Sparkles, Type, Eye, Zap } from "lucide-react"
import { useThemeStore } from "../../store/useThemeStore"
import ThemeSelector from "../ThemeSelector"

const AppearanceSettings = ({ profile, onFormChange }) => {
    const { theme, setTheme } = useThemeStore()
    const [settings, setSettings] = useState({
        theme: theme || "light",
        fontSize: profile?.preferences?.appearance?.fontSize || "medium",
        fontFamily: profile?.preferences?.appearance?.fontFamily || "system",
        compactMode: profile?.preferences?.appearance?.compactMode ?? false,
        animations: profile?.preferences?.appearance?.animations ?? true,
        highContrast: profile?.preferences?.appearance?.highContrast ?? false,
        reducedMotion: profile?.preferences?.appearance?.reducedMotion ?? false,
    })

    useEffect(() => {
        onFormChange({
            preferences: {
                ...profile?.preferences,
                appearance: settings,
            },
        })
    }, [settings])

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
        if (key === "theme") {
            setTheme(value)
        }
    }

    const themeCategories = {
        light: {
            name: "Light Themes",
            icon: <Sun className="w-5 h-5" />,
            themes: [
                "light",
                "cupcake",
                "bumblebee",
                "emerald",
                "corporate",
                "retro",
                "cyberpunk",
                "valentine",
                "garden",
                "lofi",
                "pastel",
                "fantasy",
                "wireframe",
                "cmyk",
            ],
        },
        dark: {
            name: "Dark Themes",
            icon: <Moon className="w-5 h-5" />,
            themes: [
                "dark",
                "synthwave",
                "halloween",
                "forest",
                "aqua",
                "luxury",
                "dracula",
                "night",
                "coffee",
                "winter",
                "dim",
                "nord",
                "sunset",
            ],
        },
    }

    const fontSizes = [
        { value: "small", label: "Small", preview: "text-sm" },
        { value: "medium", label: "Medium", preview: "text-base" },
        { value: "large", label: "Large", preview: "text-lg" },
        { value: "extra-large", label: "Extra Large", preview: "text-xl" },
    ]

    const fontFamilies = [
        { value: "system", label: "System Default", preview: "font-sans" },
        { value: "serif", label: "Serif", preview: "font-serif" },
        { value: "mono", label: "Monospace", preview: "font-mono" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="avatar placeholder">
                    <div className="bg-info text-info-content rounded-2xl w-12">
                        <Palette className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Appearance Settings</h2>
                    <p className="text-base-content/70">Customize the look and feel of your interface</p>
                </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Theme Selection
                </h3>

                <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <Monitor className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Current Theme: {theme}</h4>
                        </div>
                        <ThemeSelector />
                    </div>
                </div>

                {Object.entries(themeCategories).map(([category, data]) => (
                    <div key={category} className="space-y-4">
                        <h4 className="font-medium flex items-center gap-3 text-base-content/80">
                            {data.icon}
                            {data.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {data.themes.map((themeName) => (
                                <button
                                    key={themeName}
                                    onClick={() => handleChange("theme", themeName)}
                                    className={`btn btn-sm justify-start gap-2 ${theme === themeName ? "btn-primary" : "btn-outline"}`}
                                    data-theme={themeName}
                                >
                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                    {themeName}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Typography */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Type className="w-5 h-5 text-secondary" />
                    Typography
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-300">
                        <div className="card-body">
                            <h4 className="font-medium mb-4">Font Size</h4>
                            <div className="space-y-3">
                                {fontSizes.map((size) => (
                                    <label
                                        key={size.value}
                                        className="label cursor-pointer justify-start gap-4 p-3 rounded-lg border hover:bg-base-200 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="fontSize"
                                            className="radio radio-secondary"
                                            value={size.value}
                                            checked={settings.fontSize === size.value}
                                            onChange={(e) => handleChange("fontSize", e.target.value)}
                                        />
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{size.label}</span>
                                            <span className={`${size.preview} text-base-content/70`}>Sample text</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300">
                        <div className="card-body">
                            <h4 className="font-medium mb-4">Font Family</h4>
                            <div className="space-y-3">
                                {fontFamilies.map((font) => (
                                    <label
                                        key={font.value}
                                        className="label cursor-pointer justify-start gap-4 p-3 rounded-lg border hover:bg-base-200 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="fontFamily"
                                            className="radio radio-accent"
                                            value={font.value}
                                            checked={settings.fontFamily === font.value}
                                            onChange={(e) => handleChange("fontFamily", e.target.value)}
                                        />
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{font.label}</span>
                                            <span className={`${font.preview} text-base-content/70`}>Sample text</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Display Options */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Eye className="w-5 h-5 text-accent" />
                    Display Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5 text-info" />
                                    <span className="font-medium">Compact Mode</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-info"
                                    checked={settings.compactMode}
                                    onChange={(e) => handleChange("compactMode", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Reduce spacing for a more compact interface</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-warning" />
                                    <span className="font-medium">Animations</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-warning"
                                    checked={settings.animations}
                                    onChange={(e) => handleChange("animations", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Enable smooth animations and transitions</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Eye className="w-5 h-5 text-error" />
                                    <span className="font-medium">High Contrast</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-error"
                                    checked={settings.highContrast}
                                    onChange={(e) => handleChange("highContrast", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Increase contrast for better visibility</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Moon className="w-5 h-5 text-primary" />
                                    <span className="font-medium">Reduced Motion</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={settings.reducedMotion}
                                    onChange={(e) => handleChange("reducedMotion", e.target.checked)}
                                />
                            </div>
                            <p className="text-sm text-base-content/70">Minimize motion for accessibility</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="card bg-gradient-to-br from-accent/10 to-info/5 border border-accent/20">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-5 h-5 text-accent" />
                        <h4 className="font-semibold">Live Preview</h4>
                    </div>
                    <div className="mockup-window border bg-base-300">
                        <div className="flex justify-center px-4 py-16 bg-base-200">
                            <div className={`card bg-base-100 shadow-xl max-w-sm ${settings.compactMode ? "compact" : ""}`}>
                                <div className="card-body">
                                    <h2
                                        className={`card-title ${settings.fontSize === "small" ? "text-sm" : settings.fontSize === "large" ? "text-lg" : settings.fontSize === "extra-large" ? "text-xl" : "text-base"} ${settings.fontFamily === "serif" ? "font-serif" : settings.fontFamily === "mono" ? "font-mono" : "font-sans"}`}
                                    >
                                        Sample Card
                                    </h2>
                                    <p
                                        className={`${settings.fontSize === "small" ? "text-xs" : settings.fontSize === "large" ? "text-base" : settings.fontSize === "extra-large" ? "text-lg" : "text-sm"} ${settings.fontFamily === "serif" ? "font-serif" : settings.fontFamily === "mono" ? "font-mono" : "font-sans"} text-base-content/70`}
                                    >
                                        This is how your content will look with the current settings.
                                    </p>
                                    <div className="card-actions justify-end">
                                        <button className="btn btn-primary btn-sm">Action</button>
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

export default AppearanceSettings
