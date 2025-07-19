import { useState, useEffect } from "react";
import deliveryService from "@/services/api/deliveryService";

const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deliveryService.getAll();
      setDeliveries(data || []);
    } catch (err) {
      setError(err.message);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const searchDeliveries = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await deliveryService.searchDeliveries(query);
      setDeliveries(data || []);
    } catch (err) {
      setError(err.message);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id, status) => {
    try {
      const updatedDelivery = await deliveryService.update(id, { status });
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.Id === id ? updatedDelivery : delivery
        )
      );
      return updatedDelivery;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createDelivery = async (deliveryData) => {
    try {
      const newDelivery = await deliveryService.create(deliveryData);
      setDeliveries(prev => [newDelivery, ...prev]);
      return newDelivery;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  return {
    deliveries,
    loading,
    error,
    loadDeliveries,
    searchDeliveries,
    updateDeliveryStatus,
    createDelivery,
    retryLoad: loadDeliveries
  };
};

export default useDeliveries;