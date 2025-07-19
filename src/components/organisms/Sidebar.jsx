import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/deliveries", label: "Deliveries", icon: "Package" },
    { path: "/map", label: "Map View", icon: "Map" },
    { path: "/couriers", label: "Couriers", icon: "Users" },
    { path: "/settings", label: "Settings", icon: "Settings" },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => onClose?.()}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
            : "text-secondary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700"
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={item.icon} 
            size={20} 
            className={cn(
              "mr-3 transition-transform duration-200",
              isActive 
                ? "text-white" 
                : "text-secondary-400 group-hover:text-primary-600"
            )} 
          />
          {item.label}
        </>
      )}
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex h-screen w-64 bg-white border-r border-secondary-200 fixed left-0 top-0 z-30">
      <div className="flex flex-col w-full">
        <div className="flex items-center px-6 py-8 border-b border-secondary-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Truck" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">SwiftParcel</h1>
              <p className="text-xs text-secondary-500">Logistics Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-secondary-200">
          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
              <ApperIcon name="Building2" size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                London Operations
              </p>
              <p className="text-xs text-secondary-500">Active Region</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-2">
                <ApperIcon name="Truck" size={20} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-secondary-900">SwiftParcel</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-secondary-600" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;