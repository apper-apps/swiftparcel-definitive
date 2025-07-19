import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4">
              <div className="w-8 h-8 bg-secondary-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-secondary-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
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

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-2 h-2 bg-primary-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: 0
          }}
        />
        <motion.div
          className="w-2 h-2 bg-primary-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: 0.2
          }}
        />
        <motion.div
          className="w-2 h-2 bg-primary-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: 0.4
          }}
        />
        <span className="ml-4 text-secondary-600 font-medium">Loading...</span>
      </motion.div>
    </div>
  );
};

export default Loading;