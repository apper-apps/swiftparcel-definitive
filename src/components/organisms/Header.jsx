import React from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle, searchValue, onSearchChange }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-secondary-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-secondary-50 rounded-lg">
            <ApperIcon name="Search" size={16} className="text-secondary-400" />
            <input
              type="text"
              placeholder="Search deliveries, couriers..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary-600">
              Welcome, {user?.firstName || user?.name || 'User'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <ApperIcon name="LogOut" size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;