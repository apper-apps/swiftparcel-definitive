import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";

const MapView = ({ deliveries, couriers, loading }) => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.5074,
    lng: -0.1278 // London coordinates
  });

  // Simulate map markers and interactions
const mapMarkers = React.useMemo(() => {
    if (!deliveries || !couriers) return [];
    
    const deliveryMarkers = deliveries.map(delivery => ({
      id: delivery.Id,
      type: "delivery",
      position: {
        lat: delivery.deliveryAddress?.coordinates?.lat || 51.5074 + (Math.random() - 0.5) * 0.1,
        lng: delivery.deliveryAddress?.coordinates?.lng || -0.1278 + (Math.random() - 0.5) * 0.1
      },
      data: delivery,
      status: delivery.status
    }));

    const courierMarkers = couriers
      .filter(courier => courier.currentLocation)
      .map(courier => ({
        id: `courier-${courier.Id}`,
        type: "courier",
        position: {
          lat: courier.currentLocation?.coordinates?.lat || 51.5074 + (Math.random() - 0.5) * 0.1,
          lng: courier.currentLocation?.coordinates?.lng || -0.1278 + (Math.random() - 0.5) * 0.1
        },
        data: courier,
        status: courier.status
      }));

    return [...deliveryMarkers, ...courierMarkers];
  }, [deliveries, couriers]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Map Container */}
      <div className="flex-1">
        <Card className="h-full relative overflow-hidden">
          {/* Map Header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="bg-white rounded-lg shadow-lg px-4 py-2">
              <h3 className="font-semibold text-secondary-900">Live Delivery Map</h3>
              <p className="text-sm text-secondary-600">
                {mapMarkers.filter(m => m.type === "delivery").length} deliveries, {" "}
                {mapMarkers.filter(m => m.type === "courier").length} active couriers
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="Maximize" size={16} />
              </Button>
            </div>
          </div>

          {/* Simulated Map Area */}
          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
            {/* London Streets Pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-secondary-300"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 30 + 10}px`,
                    height: "2px",
                    transform: `rotate(${Math.random() * 180}deg)`
                  }}
                />
              ))}
            </div>

            {/* Map Markers */}
            {mapMarkers.map((marker, index) => (
              <motion.div
                key={marker.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((marker.position.lng + 0.3) / 0.6) * 100}%`,
                  top: `${((0.15 - (marker.position.lat - 51.45)) / 0.15) * 100}%`
                }}
                onClick={() => marker.type === "delivery" && setSelectedDelivery(marker.data)}
              >
                {marker.type === "delivery" ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                    marker.status === "delivered" ? "bg-green-500" :
                    marker.status === "in-transit" ? "bg-blue-500" :
                    marker.status === "failed" ? "bg-red-500" :
                    "bg-yellow-500"
                  }`}>
                    <ApperIcon name="Package" size={16} className="text-white" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                      marker.status === "available" ? "bg-green-600" :
                      marker.status === "busy" ? "bg-blue-600" :
                      "bg-gray-600"
                    }`}>
                      <ApperIcon name="Truck" size={12} className="text-white" />
                    </div>
                    {marker.status === "busy" && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-400"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Central London Indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-primary-600 rounded-full shadow-lg">
                <div className="w-full h-full bg-primary-600 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-secondary-700 bg-white px-2 py-1 rounded shadow">
                Central London
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
            <h4 className="font-medium text-secondary-900 mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-secondary-600">Delivered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-secondary-600">In Transit</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-secondary-600">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 rounded-full mr-3">
                  <ApperIcon name="Truck" size={8} className="text-white ml-0.5 mt-0.5" />
                </div>
                <span className="text-sm text-secondary-600">Available Courier</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Side Panel */}
      <div className="w-80">
        <Card className="h-full p-6">
          {selectedDelivery ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Delivery Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDelivery(null)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Order Number
                  </label>
                  <p className="text-lg font-semibold text-secondary-900">
                    #{selectedDelivery.orderNumber}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Status
                  </label>
                  <StatusBadge status={selectedDelivery.status} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Customer
                  </label>
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <p className="font-medium text-secondary-900">
                      {selectedDelivery.deliveryAddress.name}
                    </p>
                    <p className="text-sm text-secondary-600">
                      {selectedDelivery.deliveryAddress.street}
                    </p>
                    <p className="text-sm text-secondary-600">
                      {selectedDelivery.deliveryAddress.city}, {selectedDelivery.deliveryAddress.postcode}
                    </p>
                  </div>
                </div>

                {selectedDelivery.courier && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Assigned Courier
                    </label>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <ApperIcon name="User" size={20} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {selectedDelivery.courier.name}
                          </p>
                          <p className="text-sm text-secondary-600">
                            {selectedDelivery.courier.vehicleType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-6">
                  <Button className="flex-1" size="sm">
                    <ApperIcon name="Phone" size={16} className="mr-2" />
                    Call Customer
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <ApperIcon name="MessageSquare" size={16} className="mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                Map Controls
              </h3>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Filter by Status
                  </label>
                  <div className="space-y-2">
                    {["all", "pending", "in-transit", "delivered"].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-secondary-600 capitalize">
                          {status === "all" ? "All Statuses" : status.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Show Couriers
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-600">
                      Display active couriers
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-secondary-200">
                <p className="text-sm text-secondary-600 mb-3">
                  Click on any delivery marker for details
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  <ApperIcon name="MapPin" size={16} className="mr-2" />
                  Center on London
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MapView;