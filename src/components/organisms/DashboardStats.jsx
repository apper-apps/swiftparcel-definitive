import React from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-secondary-200 rounded w-20"></div>
                  <div className="h-8 bg-secondary-200 rounded w-16"></div>
                  <div className="h-3 bg-secondary-200 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-secondary-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Active Deliveries",
      value: stats.activeDeliveries,
      change: "+12%",
      trend: "up",
      icon: "Truck"
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      change: "+8%",
      trend: "up",
      icon: "CheckCircle"
    },
    {
      title: "Pending Pickups",
      value: stats.pendingPickups,
      change: "-5%",
      trend: "down",
      icon: "Clock"
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: "+2%",
      trend: "up",
      icon: "Target"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <MetricCard {...metric} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;