import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  BellIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser';
import { logout } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

function Navbar() {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { mutate: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logged out successfully');
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.clear();
      navigate('/login');
      window.location.reload();
    },
    onError: () => {
      toast.error('Logout failed');
      navigate('/login');
    },
  });

  const handleLogout = () => {
    logoutMutation();
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">

          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 transition-colors"
            >
              <BellIcon className="size-5" />
              <span className="hidden sm:inline">Notifications</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full ring-2 ring-primary/20">
                    <img
                      src={authUser?.profilePic || '/default-avatar.png'}
                      alt={authUser?.fullName || 'User'}
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{authUser?.fullName || 'User'}</p>
                  <p className="text-xs opacity-60">Online</p>
                </div>
                <ChevronDownIcon className="size-4 opacity-60" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-base-100 rounded-lg shadow-lg border border-base-300 py-2 z-50">
                  <div className="px-4 py-3 border-b border-base-300">
                    <p className="text-sm font-medium">{authUser?.fullName}</p>
                    <p className="text-xs opacity-60">{authUser?.email}</p>
                  </div>

                  <Link
                    to="/onboarding"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <UserIcon className="size-4" />
                    Profile
                  </Link>

                  <div className="border-t border-base-300 my-1"></div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors w-full text-left"
                  >
                    <LogOutIcon className="size-4" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="btn btn-ghost btn-sm p-2"
            >
              {isMobileMenuOpen ? (
                <XIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-base-300 py-4">
            <div className="space-y-2">
              <Link
                to="/notifications"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BellIcon className="size-5" />
                Notifications
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon className="size-5" />
                Profile
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-base-200 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <SettingsIcon className="size-5" />
                Settings
              </Link>

              <div className="border-t border-base-300 my-2"></div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors w-full text-left"
              >
                <LogOutIcon className="size-5" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
