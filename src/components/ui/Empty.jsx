import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by creating your first item.", 
  actionLabel = "Create New",
  onAction,
  icon = "Package",
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-12 text-center max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-3">{title}</h3>
        <p className="text-secondary-600 mb-8 leading-relaxed">{message}</p>
        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default Empty;