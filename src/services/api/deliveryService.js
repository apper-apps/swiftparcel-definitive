import deliveriesData from "@/services/mockData/deliveries.json";

class DeliveryService {
  constructor() {
    this.deliveries = [...deliveriesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.deliveries];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const delivery = this.deliveries.find(d => d.Id === parseInt(id));
    if (!delivery) {
      throw new Error("Delivery not found");
    }
    return { ...delivery };
  }

  async create(deliveryData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newDelivery = {
      Id: Math.max(...this.deliveries.map(d => d.Id)) + 1,
      orderNumber: `SP${new Date().getFullYear()}${String(Math.max(...this.deliveries.map(d => d.Id)) + 1).padStart(3, "0")}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedDelivery: null,
      actualDelivery: null,
      courier: null,
      ...deliveryData
    };
    
    this.deliveries.push(newDelivery);
    return { ...newDelivery };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.deliveries.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Delivery not found");
    }
    
    this.deliveries[index] = { ...this.deliveries[index], ...updates };
    return { ...this.deliveries[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.deliveries.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Delivery not found");
    }
    
    this.deliveries.splice(index, 1);
    return true;
  }

  async getRecentDeliveries(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.deliveries
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(d => ({ ...d }));
  }

  async getDeliveryStats() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const today = new Date().toDateString();
    const todayDeliveries = this.deliveries.filter(d => 
      new Date(d.createdAt).toDateString() === today
    );
    
    return {
      activeDeliveries: this.deliveries.filter(d => 
        ["assigned", "in-transit"].includes(d.status)
      ).length,
      completedToday: this.deliveries.filter(d => 
        d.status === "delivered" && new Date(d.actualDelivery).toDateString() === today
      ).length,
      pendingPickups: this.deliveries.filter(d => d.status === "pending").length,
      successRate: Math.round(
        (this.deliveries.filter(d => d.status === "delivered").length / 
        Math.max(this.deliveries.length, 1)) * 100
      )
    };
  }

  async searchDeliveries(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!query) return [...this.deliveries];
    
    const searchTerm = query.toLowerCase();
    return this.deliveries.filter(delivery =>
      delivery.orderNumber.toLowerCase().includes(searchTerm) ||
      delivery.deliveryAddress.name.toLowerCase().includes(searchTerm) ||
      delivery.deliveryAddress.street.toLowerCase().includes(searchTerm) ||
      delivery.status.toLowerCase().includes(searchTerm)
).map(d => ({ ...d }));
  }

  async bulkCreate(csvFile, onProgress) {
    const Papa = await import('papaparse');
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const { data } = results;
            const totalRows = data.length;
            let processed = 0;
            let successful = 0;
            let failed = 0;
            const errors = [];

            onProgress(0);

            for (let i = 0; i < data.length; i++) {
              const row = data[i];
              const rowNumber = i + 2; // +2 because CSV starts at row 1 and we skip header

              try {
                // Validate required fields
                const requiredFields = ['customerName', 'customerStreet', 'customerCity', 'customerPostcode'];
                const missingFields = requiredFields.filter(field => !row[field] || row[field].trim() === '');
                
                if (missingFields.length > 0) {
                  throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
                }

                // Create delivery object
                const deliveryData = {
                  deliveryAddress: {
                    name: row.customerName.trim(),
                    street: row.customerStreet.trim(),
                    city: row.customerCity.trim(),
                    postcode: row.customerPostcode.trim(),
                    coordinates: { lat: 51.5074, lng: -0.1278 } // Default London coordinates
                  },
                  pickupAddress: {
                    name: row.pickupName?.trim() || 'Pickup Location',
                    street: row.pickupStreet?.trim() || '123 Default Street',
                    city: row.pickupCity?.trim() || 'London',
                    postcode: row.pickupPostcode?.trim() || 'W1A 0AX',
                    coordinates: { lat: 51.5074, lng: -0.1278 }
                  },
                  package: {
                    weight: parseFloat(row.packageWeight) || 1.0,
                    dimensions: row.packageDimensions || '20x15x10cm',
                    type: row.packageType?.trim() || 'General'
                  }
                };

                // Create the delivery
                await this.create(deliveryData);
                successful++;
              } catch (error) {
                failed++;
                errors.push({
                  row: rowNumber,
                  message: error.message
                });
              }

              processed++;
              const progress = Math.round((processed / totalRows) * 100);
              onProgress(progress);

              // Add small delay to show progress
              if (i < data.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }

            resolve({
              total: totalRows,
              successful,
              failed,
              errors: errors.slice(0, 10) // Limit to first 10 errors
            });
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  }
}
export default new DeliveryService();