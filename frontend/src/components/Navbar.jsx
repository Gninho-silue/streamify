import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { logout, getUnreadNotificationCount } from "../lib/api";
import { BellIcon, LogOutIcon, ShipWheelIcon, UserIcon, SettingsIcon, ChevronDownIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Récupérer le nombre de notifications non lues
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    enabled: !!authUser // Seulement si l'utilisateur est connecté
  });

  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); 
      navigate("/login", { replace: true });
    } 
  });

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logoutMutation();
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-full">
          {/* Logo and Logout Button */}
          { isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                 <span className="text-3xl font-bold font-mono bg-clip-text 
                    text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Notifications avec badge */}
            <Link to='/notifications' className="relative">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="size-6 text-base-content opacity-70" />
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </div>
                )}
              </button>
            </Link>
            
            <ThemeSelector/>

            {/* User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors"
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={authUser?.profilePicture || "/default-avatar.png"} alt="User Avatar" />
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{authUser?.fullName}</p>
                  <p className="text-xs text-base-content/70">{authUser?.status}</p>
                </div>
                <ChevronDownIcon className={`size-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-base-100 rounded-lg shadow-lg border border-base-300 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-base-300">
                    <p className="text-sm font-medium">{authUser?.fullName}</p>
                    <p className="text-xs text-base-content/70">{authUser?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200 transition-colors"
                    >
                      <UserIcon className="size-4" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200 transition-colors"
                    >
                      <SettingsIcon className="size-4" />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-base-300 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors w-full text-left"
                    >
                      <LogOutIcon className="size-4" />
                      Logout
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

export default Navbar;
