import React, { useState } from "react";
import { motion } from "framer-motion";
import CourierGrid from "@/components/organisms/CourierGrid";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import useCouriers from "@/hooks/useCouriers";
import { toast } from "react-toastify";

const Couriers = () => {
  const { couriers, loading, error, updateCourierStatus, retryLoad } = useCouriers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleViewCourier = (courier) => {
    toast.info(`Viewing details for courier ${courier.name}`);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const filteredCouriers = React.useMemo(() => {
    let filtered = couriers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(courier =>
        courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(courier => courier.status === statusFilter);
    }

    return filtered;
  }, [couriers, searchTerm, statusFilter]);

  // Calculate stats
  const stats = React.useMemo(() => {
    return {
      total: couriers.length,
      available: couriers.filter(c => c.status === "available").length,
      busy: couriers.filter(c => c.status === "busy").length,
      offline: couriers.filter(c => c.status === "offline").length
    };
  }, [couriers]);

  if (error && !couriers.length) {
    return (
      <Error
        title="Failed to load couriers"
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
          <h1 className="text-2xl font-bold text-secondary-900">Courier Fleet</h1>
          <p className="text-secondary-600 mt-1">
            Manage your delivery team and track performance
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Courier
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary-900">{stats.total}</div>
          <div className="text-sm text-secondary-600">Total Couriers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          <div className="text-sm text-secondary-600">Available</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.busy}</div>
          <div className="text-sm text-secondary-600">On Delivery</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.offline}</div>
          <div className="text-sm text-secondary-600">Offline</div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search couriers by name or vehicle type..."
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
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
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

      {/* Status Filter Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <span className="text-sm text-secondary-600">Quick filters:</span>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            statusFilter === "all" 
              ? "bg-primary-100 text-primary-700" 
              : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setStatusFilter("available")}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            statusFilter === "available" 
              ? "bg-green-100 text-green-700" 
              : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
          }`}
        >
          Available ({stats.available})
        </button>
        <button
          onClick={() => setStatusFilter("busy")}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            statusFilter === "busy" 
              ? "bg-blue-100 text-blue-700" 
              : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
          }`}
        >
          Busy ({stats.busy})
        </button>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-secondary-600">
          Showing {filteredCouriers.length} of {couriers.length} couriers
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== "all" && ` with status "${statusFilter}"`}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600">Sort by:</span>
          <Select className="min-w-[120px]" defaultValue="name">
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="rating">Rating</option>
            <option value="deliveries">Deliveries</option>
          </Select>
        </div>
      </motion.div>

      {/* Courier Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CourierGrid
          couriers={filteredCouriers}
          loading={loading}
          onViewCourier={handleViewCourier}
        />
      </motion.div>
    </div>
  );
};

export default Couriers;