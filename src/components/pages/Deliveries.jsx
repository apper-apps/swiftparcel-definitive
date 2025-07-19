import React, { useState } from "react";
import { motion } from "framer-motion";
import DeliveryTable from "@/components/organisms/DeliveryTable";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import useDeliveries from "@/hooks/useDeliveries";
import { toast } from "react-toastify";

const Deliveries = () => {
  const { 
    deliveries, 
    loading, 
    error, 
    searchDeliveries, 
    updateDeliveryStatus,
    retryLoad 
  } = useDeliveries();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSearch = async (query) => {
    setSearchTerm(query);
    if (query.trim()) {
      await searchDeliveries(query);
    } else {
      retryLoad();
    }
  };

  const handleViewDetails = (delivery) => {
    toast.info(`Viewing details for delivery #${delivery.orderNumber}`);
  };

  const handleUpdateStatus = async (delivery) => {
    try {
      const newStatus = delivery.status === "pending" ? "assigned" : 
                       delivery.status === "assigned" ? "in-transit" :
                       delivery.status === "in-transit" ? "delivered" : 
                       "pending";
      
      await updateDeliveryStatus(delivery.Id, newStatus);
      toast.success(`Delivery status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update delivery status");
    }
  };

  const filteredDeliveries = React.useMemo(() => {
    if (statusFilter === "all") return deliveries;
    return deliveries.filter(delivery => delivery.status === statusFilter);
  }, [deliveries, statusFilter]);

  if (error && !deliveries.length) {
    return (
      <Error
        title="Failed to load deliveries"
        message={error}
        onRetry={retryLoad}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Deliveries</h1>
          <p className="text-secondary-600 mt-1">
            Manage and track all delivery orders
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Delivery
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by order number, customer name, or address..."
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="min-w-[150px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </Select>
              </div>
              
              <Button variant="outline" size="sm">
                <ApperIcon name="Filter" size={16} className="mr-2" />
                More Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-secondary-600">
          Showing {filteredDeliveries.length} of {deliveries.length} deliveries
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== "all" && ` with status "${statusFilter}"`}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600">Sort by:</span>
          <Select className="min-w-[120px]" defaultValue="newest">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">Status</option>
            <option value="location">Location</option>
          </Select>
        </div>
      </motion.div>

      {/* Delivery Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DeliveryTable
          deliveries={filteredDeliveries}
          loading={loading}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      </motion.div>

      {/* Bulk Actions */}
      {filteredDeliveries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-600">
                    Select all visible deliveries
                  </span>
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ApperIcon name="Users" size={16} className="mr-2" />
                  Assign Couriers
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ApperIcon name="Edit" size={16} className="mr-2" />
                  Bulk Update
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Deliveries;