import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UserIcon, SettingsIcon, BanIcon } from "lucide-react";


const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text 
          text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="menu p-4">
          <li>
            <Link to="/" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""}`}>
             <HomeIcon className="size-5 text-base-content opacity-70" />
              Home
            </Link>
          </li>
           <li>
            <Link to="/friends" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/friends" ? "btn-active" : ""}`}>
             <UserIcon className="size-5 text-base-content opacity-70" />
              Friends
            </Link>
          </li>
           <li>
            <Link to="/notifications" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/notifications" ? "btn-active" : ""}`}>
             <BellIcon className="size-5 text-base-content opacity-70" />
              Notifications
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/profile" ? "btn-active" : ""}`}>
             <SettingsIcon className="size-5 text-base-content opacity-70" />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/blocked-users" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/blocked-users" ? "btn-active" : ""}`}>
             <BanIcon className="size-5 text-base-content opacity-70" />
              Blocked Users
            </Link>
          </li>
        
        </ul>
      </nav>
      {/** USER PROFILE */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePicture || "/default-avatar.png"} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{authUser?.fullName || "Guest"}</h2>
            <p className="text-sm text-base-content/70">{authUser?.status || "No status"}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`size-2 rounded-full ${authUser?.availability === 'available' ? 'bg-success' : authUser?.availability === 'busy' ? 'bg-error' : 'bg-warning'}`} />
              <small className="text-xs text-base-content/70">{authUser?.availability || 'offline'}</small>
            </div>
          </div>  
        </div>
      </div>


        
    </aside>
  )
}

export default Sidebar;