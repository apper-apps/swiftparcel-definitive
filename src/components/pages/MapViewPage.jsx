import React, { useState, useEffect } from "react";
import MapView from "@/components/organisms/MapView";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import deliveryService from "@/services/api/deliveryService";
import courierService from "@/services/api/courierService";

const MapViewPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMapData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [deliveriesData, couriersData] = await Promise.all([
        deliveryService.getAll(),
        courierService.getAll()
      ]);
      
      setDeliveries(deliveriesData);
      setCouriers(couriersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, []);

  if (error) {
    return (
      <Error
        title="Failed to load map data"
        message={error}
        onRetry={loadMapData}
      />
    );
  }

  return (
    <MapView 
      deliveries={deliveries}
      couriers={couriers}
      loading={loading}
    />
  );
};

export default MapViewPage;