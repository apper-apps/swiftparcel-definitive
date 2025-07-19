import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const DeliveryTable = ({ 
  deliveries, 
  loading, 
  onViewDetails, 
  onUpdateStatus,
  showActions = true 
}) => {
  if (loading) {
    return <Loading type="table" />;
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <Empty
        title="No deliveries found"
        message="No delivery records match your current filters. Try adjusting your search criteria or create a new delivery."
        icon="Package"
        actionLabel="Create Delivery"
        onAction={() => console.log("Create delivery")}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Courier
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Delivery Time
              </th>
              {showActions && (
                <th className="px-6 py-4 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {deliveries.map((delivery, index) => (
              <motion.tr
                key={delivery.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-secondary-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-secondary-900">
                      #{delivery.orderNumber}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {format(new Date(delivery.createdAt), "MMM dd, HH:mm")}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-secondary-900">
                      {delivery.deliveryAddress.name}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {delivery.deliveryAddress.street}, {delivery.deliveryAddress.city}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {delivery.courier ? (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <ApperIcon name="User" size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {delivery.courier.name}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {delivery.courier.vehicleType}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-secondary-400">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={delivery.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {delivery.estimatedDelivery ? (
                    <div>
                      <div>Est: {format(new Date(delivery.estimatedDelivery), "HH:mm")}</div>
                      {delivery.actualDelivery && (
                        <div className="text-green-600">
                          Actual: {format(new Date(delivery.actualDelivery), "HH:mm")}
                        </div>
                      )}
                    </div>
                  ) : (
                    "TBD"
                  )}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(delivery)}
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStatus(delivery)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DeliveryTable;