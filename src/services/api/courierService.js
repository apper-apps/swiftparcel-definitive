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
}

export default new CourierService();