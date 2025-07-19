import { useState, useEffect } from "react";
import courierService from "@/services/api/courierService";

const useCouriers = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCouriers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courierService.getAll();
      setCouriers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCourierStatus = async (id, status) => {
    try {
      const updatedCourier = await courierService.update(id, { status });
      setCouriers(prev => 
        prev.map(courier => 
          courier.Id === id ? updatedCourier : courier
        )
      );
      return updatedCourier;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadCouriers();
  }, []);

  return {
    couriers,
    loading,
    error,
    loadCouriers,
    updateCourierStatus,
    retryLoad: loadCouriers
  };
};

export default useCouriers;