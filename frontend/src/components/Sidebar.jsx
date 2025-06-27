"use client"

import { Link, useLocation } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { BellIcon, HomeIcon, ShipWheelIcon, UserIcon, SettingsIcon, BanIcon, Sparkles } from "lucide-react"

const Sidebar = () => {
    const { authUser } = useAuthUser()
    const location = useLocation()
    const currentPath = location.pathname

    const navigationItems = [
        {
            path: "/home",
            icon: HomeIcon,
            label: "Home",
            description: "Dashboard and overview",
        },
        {
            path: "/friends",
            icon: UserIcon,
            label: "Friends",
            description: "Your learning partners",
        },
        {
            path: "/notifications",
            icon: BellIcon,
            label: "Notifications",
            description: "Updates and messages",
        },
        {
            path: "/blocked-users",
            icon: BanIcon,
            label: "Blocked Users",
            description: "Manage blocked contacts",
        },
        {
            path: "/profile",
            icon: SettingsIcon,
            label: "Profile",
            description: "Account settings",
        },
    ]

    const getAvailabilityConfig = (availability) => {
        switch (availability) {
            case "available":
                return { color: "bg-success", text: "Available", pulse: "animate-pulse" }
            case "busy":
                return { color: "bg-error", text: "Busy", pulse: "" }
            default:
                return { color: "bg-warning", text: "Away", pulse: "" }
        }
    }

    const availabilityConfig = getAvailabilityConfig(authUser?.availability)

    return (
        <aside className="w-64 bg-base-100 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 shadow-lg">
            {/* Header with Logo */}
            <div className="p-6 border-b border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <ShipWheelIcon className="size-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div>
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
                        <p className="text-xs text-base-content/60 font-medium">Language Exchange</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-4 space-y-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentPath === item.path

                        return (
                            <div key={item.path} className="relative group">
                                <Link
                                    to={item.path}
                                    className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]
                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-lg shadow-primary/25"
                                            : "hover:bg-base-200 text-base-content/80 hover:text-base-content"
                                    }
                  `}
                                >
                                    <div
                                        className={`
                    p-2 rounded-xl transition-all duration-300
                    ${isActive ? "bg-white/20" : "bg-base-300/50 group-hover:bg-base-300"}
                  `}
                                    >
                                        <Icon
                                            className={`
                      size-5 transition-all duration-300
                      ${
                                                isActive
                                                    ? "text-primary-content"
                                                    : "text-base-content/70 group-hover:text-base-content group-hover:scale-110"
                                            }
                    `}
                                        />
                                    </div>
                                    <div className="flex-1">
                    <span
                        className={`
                      font-semibold text-sm
                      ${isActive ? "text-primary-content" : ""}
                    `}
                    >
                      {item.label}
                    </span>
                                        <p
                                            className={`
                      text-xs mt-0.5 transition-colors duration-300
                      ${isActive ? "text-primary-content/80" : "text-base-content/50 group-hover:text-base-content/70"}
                    `}
                                        >
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && <div className="w-1 h-8 bg-white/30 rounded-full" />}
                                </Link>

                                {/* Hover effect background */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-base-300 bg-gradient-to-r from-base-200/50 to-base-300/30">
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                            <div className="avatar indicator">
                                <div className="w-12 h-12 rounded-2xl ring ring-primary/20 ring-offset-base-100 ring-offset-2 group-hover:ring-primary/40 transition-all duration-300">
                                    <img
                                        src={authUser?.profilePicture || "/default-avatar.png"}
                                        alt="User Avatar"
                                        className="rounded-2xl group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <span
                                    className={`
                  indicator-item badge badge-sm border-2 border-base-100 ${availabilityConfig.color} ${availabilityConfig.pulse}
                `}
                                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors duration-300">
                                    {authUser?.fullName || "Guest"}
                                </h3>
                                <p className="text-xs text-base-content/70 truncate">{authUser?.status || "No status"}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${availabilityConfig.color} ${availabilityConfig.pulse}`} />
                                    <span className="text-xs text-base-content/60 font-medium">{availabilityConfig.text}</span>
                                </div>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Sparkles className="w-4 h-4 text-primary/60" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
