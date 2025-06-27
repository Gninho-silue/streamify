"use client"

import { useThemeStore } from "../store/useThemeStore"
import { PaletteIcon, CheckIcon, Sparkles, Sun, Moon, Zap } from "lucide-react"
import { useState } from "react"

import { THEMES } from "../constants"

const ThemeSelector = () => {
    const { theme, setTheme } = useThemeStore()
    const [isOpen, setIsOpen] = useState(false)

    const getThemeIcon = (themeName) => {
        switch (themeName.toLowerCase()) {
            case "light":
            case "cupcake":
            case "bumblebee":
                return <Sun className="w-4 h-4" />
            case "dark":
            case "night":
            case "coffee":
                return <Moon className="w-4 h-4" />
            case "synthwave":
            case "cyberpunk":
            case "neon":
                return <Zap className="w-4 h-4" />
            default:
                return <PaletteIcon className="w-4 h-4" />
        }
    }

    const getThemeCategory = (themeName) => {
        const lightThemes = [
            "light",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "retro",
            "garden",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "cmyk",
            "autumn",
            "acid",
            "lemonade",
            "winter",
        ]
        const darkThemes = [
            "dark",
            "night",
            "coffee",
            "dim",
            "nord",
            "sunset",
            "halloween",
            "forest",
            "aqua",
            "luxury",
            "dracula",
            "business",
        ]
        const colorfulThemes = [
            "synthwave",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "cmyk",
            "autumn",
            "acid",
            "lemonade",
            "winter",
        ]

        if (lightThemes.includes(themeName)) return "light"
        if (darkThemes.includes(themeName)) return "dark"
        if (colorfulThemes.includes(themeName)) return "colorful"
        return "other"
    }

    const currentTheme = THEMES.find((t) => t.name === theme)

    // Group themes by category
    const groupedThemes = THEMES.reduce((acc, themeItem) => {
        const category = getThemeCategory(themeItem.name)
        if (!acc[category]) acc[category] = []
        acc[category].push(themeItem)
        return acc
    }, {})

    const categoryLabels = {
        light: "☀️ Light Themes",
        dark: "🌙 Dark Themes",
        colorful: "🎨 Colorful Themes",
        other: "✨ Special Themes",
    }

    return (
        <div className="dropdown dropdown-end">
            <button
                tabIndex={0}
                className="btn btn-ghost btn-circle group hover:bg-primary/10 transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="relative">
                    <PaletteIcon className="w-5 h-5 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                    {/* Active theme indicator */}
                    <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-base-100 transition-all duration-300"
                        style={{ backgroundColor: currentTheme?.colors[0] || "#000" }}
                    ></div>
                </div>
            </button>

            <div
                tabIndex={0}
                className={`dropdown-content mt-3 shadow-2xl bg-base-100 backdrop-blur-lg rounded-2xl w-72 border border-base-300 max-h-96 overflow-hidden transition-all duration-300 ${
                    isOpen ? "animate-in slide-in-from-top-2" : ""
                }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Choose Theme</h3>
                            <p className="text-xs text-base-content/70">Personalize your experience</p>
                        </div>
                    </div>
                </div>

                {/* Current Theme Display */}
                <div className="p-4 bg-base-200/50">
                    <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl border border-primary/20">
                        <div className="flex items-center gap-2">
                            {getThemeIcon(currentTheme?.name)}
                            <span className="font-semibold text-primary">Current: {currentTheme?.label}</span>
                        </div>
                        <div className="ml-auto flex gap-1">
                            {currentTheme?.colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="w-4 h-4 rounded-full ring-2 ring-base-100 ring-offset-1"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Theme Categories */}
                <div className="max-h-64 overflow-y-auto p-2">
                    {Object.entries(groupedThemes).map(([category, themes]) => (
                        <div key={category} className="mb-4">
                            <div className="px-3 py-2 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                                {categoryLabels[category]}
                            </div>
                            <div className="space-y-1">
                                {themes.map((themeItem) => (
                                    <button
                                        key={themeItem.name}
                                        className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group ${
                                            theme === themeItem.name
                                                ? "bg-primary text-primary-content shadow-lg shadow-primary/25 scale-[1.02]"
                                                : "hover:bg-base-200 hover:scale-[1.01]"
                                        }`}
                                        onClick={() => {
                                            setTheme(themeItem.name)
                                            setIsOpen(false)
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {getThemeIcon(themeItem.name)}
                                            <span className="text-sm font-medium">{themeItem.label}</span>
                                        </div>

                                        {/* Color Preview */}
                                        <div className="ml-auto flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {themeItem.colors.map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                            theme === themeItem.name ? "ring-2 ring-primary-content/30" : "group-hover:scale-110"
                                                        }`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                            {theme === themeItem.name && (
                                                <CheckIcon className="w-4 h-4 text-primary-content animate-in zoom-in-50 duration-200" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-base-300 bg-base-200/30">
                    <div className="text-center">
                        <p className="text-xs text-base-content/60">Theme changes apply instantly across the entire app</p>
                        <div className="flex justify-center gap-1 mt-2">
                            <div className="badge badge-primary badge-xs">Auto-save</div>
                            <div className="badge badge-secondary badge-xs">Instant Apply</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThemeSelector
