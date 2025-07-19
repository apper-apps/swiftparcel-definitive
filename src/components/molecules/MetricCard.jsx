import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = "up",
  className 
}) => {
  const isPositive = trend === "up";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("p-6 hover:shadow-lg transition-all duration-200", className)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">{title}</p>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{value}</p>
            {change && (
              <div className={cn(
                "flex items-center mt-2 text-sm",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                <ApperIcon 
                  name={isPositive ? "TrendingUp" : "TrendingDown"} 
                  size={16} 
                  className="mr-1" 
                />
                {change}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
              <ApperIcon name={icon} size={24} className="text-primary-600" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;