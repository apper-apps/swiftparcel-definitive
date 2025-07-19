import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const RouteStopCard = ({ stop, index, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatTime = (timeString) => {
    if (!timeString) return "TBD";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'blue';
      case 'in-transit': return 'yellow';
      case 'delivered': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "route-stop-card",
        isDragging && "dragging"
      )}
    >
      <Card 
        className={cn(
          "p-4 transition-all duration-200",
          isDragging ? "shadow-lg scale-105 rotate-2" : "hover:shadow-md"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Drag Handle & Index */}
          <div className="flex flex-col items-center">
            <div
              {...attributes}
              {...listeners}
              className="p-2 rounded-lg hover:bg-secondary-100 cursor-grab active:cursor-grabbing transition-colors"
            >
              <ApperIcon name="GripVertical" size={16} className="text-secondary-400" />
            </div>
            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium mt-2">
              {index}
            </div>
          </div>

          {/* Stop Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-secondary-900 truncate">
                  {stop.address.name}
                </h4>
                <p className="text-sm text-secondary-600 truncate">
                  {stop.address.street}, {stop.address.city}
                </p>
                <p className="text-xs text-secondary-500">
                  {stop.address.postcode}
                </p>
              </div>
              <StatusBadge status={stop.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center text-sm text-secondary-600">
                <ApperIcon name="Clock" size={14} className="mr-2" />
                {formatTime(stop.estimatedTime)}
              </div>
              <div className="flex items-center text-sm text-secondary-600">
                <ApperIcon name="Package" size={14} className="mr-2" />
                {stop.packageInfo.weight}kg
              </div>
              <div className="flex items-center text-sm text-secondary-600">
                <ApperIcon name="Route" size={14} className="mr-2" />
                {stop.distance?.toFixed(1)}km
              </div>
              <div className="flex items-center text-sm text-secondary-600">
                <ApperIcon name="Tag" size={14} className="mr-2" />
                {stop.orderNumber}
              </div>
            </div>

            {/* Package Type */}
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                <ApperIcon name="Box" size={12} className="mr-1" />
                {stop.packageInfo.type}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
              <ApperIcon name="MapPin" size={16} className="text-secondary-400 hover:text-primary-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
              <ApperIcon name="Phone" size={16} className="text-secondary-400 hover:text-green-600" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RouteStopCard;