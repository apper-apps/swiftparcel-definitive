import couriersData from "@/services/mockData/couriers.json";
class CourierService {
  constructor() {
    this.couriers = [...couriersData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.couriers];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const courier = this.couriers.find(c => c.Id === parseInt(id));
    if (!courier) {
      throw new Error("Courier not found");
    }
    return { ...courier };
  }

  async create(courierData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newCourier = {
      Id: Math.max(...this.couriers.map(c => c.Id)) + 1,
      status: "available",
      activeDeliveries: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      completedDeliveries: 0,
      rating: 5.0,
      currentLocation: null,
      ...courierData
    };
    
    this.couriers.push(newCourier);
    return { ...newCourier };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.couriers.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Courier not found");
    }
    
    this.couriers[index] = { ...this.couriers[index], ...updates };
    return { ...this.couriers[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.couriers.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Courier not found");
    }
    
    this.couriers.splice(index, 1);
    return true;
  }

  async getAvailableCouriers() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.couriers
      .filter(courier => courier.status === "available")
      .map(c => ({ ...c }));
  }

  async updateLocation(id, location) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.couriers.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Courier not found");
    }
    
    this.couriers[index].currentLocation = location;
    return { ...this.couriers[index] };
  }

  async getCourierStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      total: this.couriers.length,
      available: this.couriers.filter(c => c.status === "available").length,
busy: this.couriers.filter(c => c.status === "busy").length,
      offline: this.couriers.filter(c => c.status === "offline").length
    };
  }

  async getRouteForCourier(courierId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Import delivery service to get courier's assigned deliveries
    const deliveryService = await import('./deliveryService.js');
    const allDeliveries = await deliveryService.default.getAll();
    
    const courierDeliveries = allDeliveries.filter(delivery => 
      delivery.courier && delivery.courier.id === parseInt(courierId) &&
      (delivery.status === 'assigned' || delivery.status === 'in-transit')
    );

    const routeStops = courierDeliveries.map(delivery => ({
      Id: delivery.Id,
      orderNumber: delivery.orderNumber,
      address: delivery.deliveryAddress,
      estimatedTime: delivery.estimatedDelivery,
      packageInfo: delivery.package,
      status: delivery.status,
      distance: this.calculateDistance(delivery.pickupAddress.coordinates, delivery.deliveryAddress.coordinates)
    }));

    return {
      courierId: parseInt(courierId),
      stops: routeStops,
      totalDistance: routeStops.reduce((sum, stop) => sum + stop.distance, 0),
      estimatedTotalTime: routeStops.length * 15 // 15 minutes per stop average
    };
  }

  async optimizeRoute(courierId, stops) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple optimization algorithm - sort by proximity
    const optimizedStops = [...stops].sort((a, b) => {
      // Sort by distance from pickup to delivery
      return a.distance - b.distance;
    });

    // Recalculate total metrics
    const totalDistance = optimizedStops.reduce((sum, stop) => sum + stop.distance, 0);
    const estimatedTotalTime = optimizedStops.length * 12; // Optimized to 12 minutes per stop

    return {
      courierId: parseInt(courierId),
      stops: optimizedStops,
      totalDistance,
      estimatedTotalTime,
      timeSaved: (stops.length * 15) - estimatedTotalTime
    };
  }

  async updateRouteOrder(courierId, reorderedStops) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Calculate new metrics based on reordered stops
    const totalDistance = reorderedStops.reduce((sum, stop) => sum + stop.distance, 0);
    const estimatedTotalTime = reorderedStops.length * 13; // Manual reorder efficiency

    return {
      courierId: parseInt(courierId),
      stops: reorderedStops,
      totalDistance,
      estimatedTotalTime,
      success: true
    };
  }

  calculateDistance(coord1, coord2) {
    // Simple distance calculation (Haversine formula approximation)
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }
}

export default new CourierService();