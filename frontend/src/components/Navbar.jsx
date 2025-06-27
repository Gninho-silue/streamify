"use client"

import { Link, useLocation, useNavigate } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { logout, getUnreadNotificationCount } from "../lib/api"
import { BellIcon, LogOutIcon, ShipWheelIcon, UserIcon, SettingsIcon, ChevronDownIcon } from "lucide-react"
import ThemeSelector from "./ThemeSelector"
import { useState, useRef, useEffect } from "react"

const Navbar = () => {
  const { authUser } = useAuthUser()
  const location = useLocation()
  const navigate = useNavigate()
  const isChatPage = location.pathname?.startsWith("/chat")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Récupérer le nombre de notifications non lues
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    enabled: !!authUser, // Seulement si l'utilisateur est connecté
  })

  const queryClient = useQueryClient()
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
      navigate("/login", { replace: true })
    },
  })

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setIsUserMenuOpen(false)
    logoutMutation()
  }

  return (
      <nav className="bg-base-100 border-b border-base-300 sticky top-0 z-30 h-16 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo for Chat Page */}
            {isChatPage && (
                <div className="flex items-center">
                  <Link to="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                      <ShipWheelIcon className="size-7 text-primary group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div className="hidden sm:block">
                  <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    Streamify
                  </span>
                      <p className="text-xs text-base-content/60 font-medium -mt-1">Language Exchange</p>
                    </div>
                  </Link>
                </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              {/* Notifications */}
              <div className="relative">
                <Link to="/notifications">
                  <button className="btn btn-ghost btn-circle relative group hover:bg-primary/10 transition-all duration-300">
                    <BellIcon className="size-5 text-base-content/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                    {notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                          <div className="bg-error text-error-content text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-bold shadow-lg animate-bounce">
                            {notificationCount > 99 ? "99+" : notificationCount}
                          </div>
                          <div className="absolute inset-0 bg-error rounded-full animate-ping opacity-75" />
                        </div>
                    )}
                  </button>
                </Link>
              </div>

              {/* Theme Selector */}
              <div className="hidden sm:block">
                <ThemeSelector />
              </div>

              {/* User Menu Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-base-200 transition-all duration-300 group border border-transparent hover:border-base-300"
                >
                  <div className="avatar indicator">
                    <div className="w-10 h-10 rounded-2xl ring ring-primary/20 ring-offset-base-100 ring-offset-1 group-hover:ring-primary/40 transition-all duration-300">
                      <img
                          src={authUser?.profilePicture || "/default-avatar.png"}
                          alt="User Avatar"
                          className="rounded-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="indicator-item badge badge-success badge-xs border-2 border-base-100" />
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                      {authUser?.fullName}
                    </p>
                    <p className="text-xs text-base-content/60 truncate max-w-32">{authUser?.status || "No status"}</p>
                  </div>

                  <ChevronDownIcon
                      className={`size-4 text-base-content/60 transition-all duration-300 group-hover:text-base-content ${
                          isUserMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-4 border-b border-base-300">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-2xl ring ring-primary/30 ring-offset-base-100 ring-offset-2">
                              <img src={authUser?.profilePicture || "/default-avatar.png"} alt="User Avatar" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base-content truncate">{authUser?.fullName}</p>
                            <p className="text-sm text-base-content/70 truncate">{authUser?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                              <span className="text-xs text-success font-medium">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                            to="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-base-200 transition-all duration-200 group"
                        >
                          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-200">
                            <UserIcon className="size-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium">Profile</span>
                            <p className="text-xs text-base-content/60">Manage your account</p>
                          </div>
                        </Link>

                        <Link
                            to="/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-base-200 transition-all duration-200 group"
                        >
                          <div className="p-2 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors duration-200">
                            <SettingsIcon className="size-4 text-secondary" />
                          </div>
                          <div>
                            <span className="font-medium">Settings</span>
                            <p className="text-xs text-base-content/60">Preferences & privacy</p>
                          </div>
                        </Link>

                        {/* Mobile Theme Selector */}
                        <div className="sm:hidden px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-xl">
                              <div className="size-4 bg-gradient-to-r from-primary to-secondary rounded" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-sm">Theme</span>
                              <div className="mt-1">
                                <ThemeSelector />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-base-300 p-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/10 transition-all duration-200 w-full text-left rounded-xl group"
                        >
                          <div className="p-2 bg-error/10 rounded-xl group-hover:bg-error/20 transition-colors duration-200">
                            <LogOutIcon className="size-4 text-error" />
                          </div>
                          <div>
                            <span className="font-medium">Logout</span>
                            <p className="text-xs text-error/70">Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar
