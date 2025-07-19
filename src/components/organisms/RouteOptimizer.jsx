import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import RouteStopCard from "@/components/molecules/RouteStopCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import courierService from "@/services/api/courierService";
import { toast } from "react-toastify";

const RouteOptimizer = ({ courier, isOpen, onClose, onRouteSaved }) => {
  const [routeData, setRouteData] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isOpen && courier) {
      loadRouteData();
    }
  }, [isOpen, courier]);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      const data = await courierService.getRouteForCourier(courier.Id);
      setRouteData(data);
      setStops(data.stops);
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to load route data");
      console.error("Route loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = stops.findIndex(stop => stop.Id === active.id);
      const newIndex = stops.findIndex(stop => stop.Id === over.id);
      
      const newStops = arrayMove(stops, oldIndex, newIndex);
      setStops(newStops);
      setHasChanges(true);

      try {
        const updatedRoute = await courierService.updateRouteOrder(courier.Id, newStops);
        setRouteData(updatedRoute);
      } catch (error) {
        toast.error("Failed to update route order");
        // Revert changes on error
        setStops(stops);
      }
    }
  };

  const handleOptimizeRoute = async () => {
    try {
      setOptimizing(true);
      const optimizedRoute = await courierService.optimizeRoute(courier.Id, stops);
      setStops(optimizedRoute.stops);
      setRouteData(optimizedRoute);
      setHasChanges(true);
      toast.success(`Route optimized! Estimated time saved: ${optimizedRoute.timeSaved} minutes`);
    } catch (error) {
      toast.error("Failed to optimize route");
      console.error("Route optimization error:", error);
    } finally {
      setOptimizing(false);
    }
  };

  const handleSaveRoute = () => {
    onRouteSaved(routeData);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="Route" size={20} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Route Planning
                </h2>
                <p className="text-sm text-secondary-600">
                  Optimize delivery route for {courier.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-secondary-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
            {/* Route Summary */}
            <div className="lg:w-1/3 p-6 border-r border-secondary-200">
              <h3 className="font-semibold text-secondary-900 mb-4">Route Summary</h3>
              
              {loading ? (
                <Loading type="spinner" />
              ) : routeData ? (
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-secondary-600">Total Stops</span>
                      <span className="font-medium">{stops.length}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-secondary-600">Total Distance</span>
                      <span className="font-medium">{routeData.totalDistance?.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Estimated Time</span>
                      <span className="font-medium">{formatTime(routeData.estimatedTotalTime)}</span>
                    </div>
                  </Card>

                  <div className="space-y-2">
                    <Button
                      onClick={handleOptimizeRoute}
                      disabled={optimizing || stops.length < 2}
                      className="w-full"
                      variant="outline"
                    >
                      {optimizing ? (
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      ) : (
                        <ApperIcon name="Zap" size={16} className="mr-2" />
                      )}
                      {optimizing ? "Optimizing..." : "Auto Optimize"}
                    </Button>

                    <Button
                      onClick={handleSaveRoute}
                      disabled={!hasChanges}
                      className="w-full"
                    >
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      Save Route
                    </Button>
                  </div>

                  {routeData.timeSaved > 0 && (
                    <Card className="p-3 bg-green-50 border-green-200">
                      <div className="flex items-center text-green-700">
                        <ApperIcon name="Clock" size={16} className="mr-2" />
                        <span className="text-sm font-medium">
                          Time saved: {routeData.timeSaved} minutes
                        </span>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-secondary-500">No route data available</p>
              )}
            </div>

            {/* Delivery Stops */}
            <div className="lg:w-2/3 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">Delivery Stops</h3>
                <div className="flex items-center text-sm text-secondary-600">
                  <ApperIcon name="GripVertical" size={16} className="mr-1" />
                  Drag to reorder
                </div>
              </div>

              {loading ? (
                <Loading type="cards" />
              ) : stops.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={stops.map(stop => stop.Id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {stops.map((stop, index) => (
                        <RouteStopCard
                          key={stop.Id}
                          stop={stop}
                          index={index + 1}
                          id={stop.Id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <Card className="p-8 text-center">
                  <ApperIcon name="MapPin" size={48} className="mx-auto text-secondary-400 mb-4" />
                  <h4 className="font-medium text-secondary-900 mb-2">No deliveries assigned</h4>
                  <p className="text-sm text-secondary-600">
                    This courier doesn't have any active deliveries to plan a route for.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteOptimizer;