import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import DeliveryTable from "@/components/organisms/DeliveryTable";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import deliveryService from "@/services/api/deliveryService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    completedToday: 0,
    pendingPickups: 0,
    successRate: 0
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, deliveriesData] = await Promise.all([
        deliveryService.getDeliveryStats(),
        deliveryService.getRecentDeliveries(8)
      ]);
      
      setStats(statsData);
      setRecentDeliveries(deliveriesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (delivery) => {
toast.info(`Viewing details for delivery #${delivery.order_number || delivery.orderNumber}`);
  };

  const handleUpdateStatus = (delivery) => {
    toast.info(`Updating status for delivery #${delivery.order_number || delivery.orderNumber}`);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load dashboard"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to SwiftParcel</h1>
            <p className="text-primary-100 text-lg">
              Your logistics command center for London deliveries
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ApperIcon name="Truck" size={40} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} loading={false} />

      {/* Recent Deliveries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Recent Deliveries
              </h2>
              <p className="text-secondary-600">
                Latest delivery updates and status changes
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export
              </Button>
              <Button size="sm">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                New Delivery
              </Button>
            </div>
          </div>

          <DeliveryTable
            deliveries={recentDeliveries}
            loading={false}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
          />
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Plus" size={32} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-2">
            Create Delivery
          </h3>
          <p className="text-secondary-600 text-sm">
            Add a new delivery to the system
          </p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Map" size={32} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-2">
            View Map
          </h3>
          <p className="text-secondary-600 text-sm">
            Track live delivery locations
          </p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BarChart3" size={32} className="text-purple-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-2">
            View Reports
          </h3>
          <p className="text-secondary-600 text-sm">
            Analyze delivery performance
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;