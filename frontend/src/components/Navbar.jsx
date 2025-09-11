import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageCircle, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 w-full bg-base-100 border-b p-4">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold">
          <MessageCircle className="w-5 h-5 text-primary" />
          Chat
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-2">
          <Link to="/settings" className="flex items-center gap-1 btn btn-sm">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to="/profile" className="flex items-center gap-1 btn btn-sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button onClick={logout} className="flex items-center gap-1 btn btn-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
