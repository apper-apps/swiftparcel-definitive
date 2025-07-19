import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    pending: {
      variant: "warning",
      icon: "Clock",
      label: "Pending"
    },
    assigned: {
      variant: "info",
      icon: "User",
      label: "Assigned"
    },
    "in-transit": {
      variant: "primary",
      icon: "Truck",
      label: "In Transit"
    },
    delivered: {
      variant: "success",
      icon: "CheckCircle",
      label: "Delivered"
    },
    failed: {
      variant: "danger",
      icon: "XCircle",
      label: "Failed"
    },
    available: {
      variant: "success",
      icon: "CheckCircle",
      label: "Available"
    },
    busy: {
      variant: "warning",
      icon: "Clock",
      label: "Busy"
    },
    offline: {
      variant: "default",
      icon: "CircleOff",
      label: "Offline"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={className}>
      <ApperIcon name={config.icon} size={12} className="mr-1" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;