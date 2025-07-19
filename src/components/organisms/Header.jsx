import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, searchValue, onSearchChange }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-secondary-200 lg:ml-64 px-4 lg:px-8 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-secondary-900">
              Delivery Operations
            </h2>
            <p className="text-sm text-secondary-600">
              Monitor and manage your London deliveries
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search deliveries..."
            className="w-64 hidden md:block"
          />
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <ApperIcon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;