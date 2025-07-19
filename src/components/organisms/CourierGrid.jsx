import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import StatusBadge from "@/components/molecules/StatusBadge";
import Card from "@/components/atoms/Card";

const CourierGrid = ({ couriers, loading, onViewCourier, onPlanRoute }) => {
  if (loading) {
    return <Loading type="cards" />;
  }

  if (!couriers || couriers.length === 0) {
    return (
      <Empty
        title="No couriers available"
        message="No couriers are currently registered in the system. Add couriers to start managing deliveries."
        icon="Users"
        actionLabel="Add Courier"
        onAction={() => console.log("Add courier")}
      />
    );
  }

  return (
    <div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {couriers.map((courier, index) => <motion.div
        key={courier.Id}
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            duration: 0.3,
            delay: index * 0.1
        }}>
        <Card
            hover
            className="p-6 cursor-pointer"
            onClick={() => onViewCourier(courier)}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div
                        className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-3">
                        <ApperIcon name="User" size={24} className="text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-secondary-900">{courier.name}</h3>
                        <p className="text-sm text-secondary-500">{courier.vehicleType}</p>
                    </div>
                </div>
                <StatusBadge status={courier.status} />
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Active Deliveries</span>
                    <span className="font-medium text-secondary-900">
                        {courier.activeDeliveries}/{courier.capacity}
                    </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${courier.activeDeliveries / courier.capacity * 100}%`
                        }} />
                </div>
                {courier.currentLocation && <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="MapPin" size={14} className="mr-2" />
                    {courier.currentLocation.area}
                </div>}
                <div
                    className="flex items-center justify-between pt-2 border-t border-secondary-200">
                    <div className="flex items-center text-sm text-secondary-600">
                        <ApperIcon name="Clock" size={14} className="mr-1" />Last update: 2m ago
                                        </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-secondary-400" />
                </div>
                {courier.activeDeliveries > 0 && <div className="mt-3 pt-3 border-t border-secondary-200">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            onPlanRoute && onPlanRoute(courier);
                        }}
                        className="w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors flex items-center justify-center">
                        <ApperIcon name="Route" size={14} className="mr-2" />Plan Route
                                          </button>
                </div>}
            </div>
        </Card>
    </motion.div>)}
</div>
  );
};

export default CourierGrid;