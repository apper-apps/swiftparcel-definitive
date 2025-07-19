import { toast } from "react-toastify";

class CourierService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.tableName = 'courier';
    
    // Define all fields from the courier table
    this.fields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } },
      { "field": { "Name": "status" } },
      { "field": { "Name": "current_location" } },
      { "field": { "Name": "active_deliveries" } },
      { "field": { "Name": "capacity" } },
      { "field": { "Name": "vehicle_type" } },
      { "field": { "Name": "joined_date" } },
      { "field": { "Name": "completed_deliveries" } },
      { "field": { "Name": "rating" } },
      { "field": { "Name": "phone" } }
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.fields,
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching couriers:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.fields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching courier with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(courierData) {
    try {
      // Only include updateable fields
      const updateableData = {
        Name: courierData.Name || courierData.name,
        Tags: courierData.Tags || "",
        Owner: courierData.Owner ? parseInt(courierData.Owner) : null,
        status: courierData.status || "available",
        current_location: courierData.current_location || courierData.currentLocation || "",
        active_deliveries: parseInt(courierData.active_deliveries || courierData.activeDeliveries || 0),
        capacity: parseInt(courierData.capacity || 3),
        vehicle_type: courierData.vehicle_type || courierData.vehicleType || "",
        joined_date: courierData.joined_date || courierData.joinedDate || new Date().toISOString().split('T')[0],
        completed_deliveries: parseInt(courierData.completed_deliveries || courierData.completedDeliveries || 0),
        rating: parseFloat(courierData.rating || 5.0),
        phone: courierData.phone || ""
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create courier ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating courier:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, updates) {
    try {
      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        ...(updates.Name && { Name: updates.Name }),
        ...(updates.Tags !== undefined && { Tags: updates.Tags }),
        ...(updates.Owner && { Owner: parseInt(updates.Owner) }),
        ...(updates.status && { status: updates.status }),
        ...(updates.current_location !== undefined && { current_location: updates.current_location }),
        ...(updates.active_deliveries !== undefined && { active_deliveries: parseInt(updates.active_deliveries) }),
        ...(updates.capacity !== undefined && { capacity: parseInt(updates.capacity) }),
        ...(updates.vehicle_type && { vehicle_type: updates.vehicle_type }),
        ...(updates.joined_date && { joined_date: updates.joined_date }),
        ...(updates.completed_deliveries !== undefined && { completed_deliveries: parseInt(updates.completed_deliveries) }),
        ...(updates.rating !== undefined && { rating: parseFloat(updates.rating) }),
        ...(updates.phone && { phone: updates.phone })
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update courier ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating courier:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: Array.isArray(id) ? id : [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete courier ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting courier:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async getAvailableCouriers() {
    try {
      const params = {
        fields: this.fields,
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["available"]
          }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching available couriers:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

async getCourierStats() {
    try {
      const params = {
        aggregators: [
          {
            id: "total",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }]
          },
          {
            id: "available",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
            where: [{ FieldName: "status", Operator: "EqualTo", Values: ["available"] }]
          },
          {
            id: "busy", 
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
            where: [{ FieldName: "status", Operator: "EqualTo", Values: ["busy"] }]
          },
          {
            id: "offline",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
            where: [{ FieldName: "status", Operator: "EqualTo", Values: ["offline"] }]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return { total: 0, available: 0, busy: 0, offline: 0 };
      }

      const stats = { total: 0, available: 0, busy: 0, offline: 0 };
      
      if (response.aggregators) {
        response.aggregators.forEach(agg => {
          stats[agg.id] = agg.value || 0;
        });
      }

      return stats;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courier stats:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { total: 0, available: 0, busy: 0, offline: 0 };
    }
  }

  async updateRouteOrder(courierId, orderedStops) {
    try {
      // This would typically update the route order in the database
      // For now, return the optimized route data
      return {
        deliveries: orderedStops,
        routeStops: orderedStops.map((stop, index) => ({
          ...stop,
          sequence: index + 1
        })),
        optimizedRoute: orderedStops,
        totalDistance: orderedStops.length * 2.5,
        estimatedTime: orderedStops.length * 15,
        courierCapacity: 10,
        totalWeight: orderedStops.reduce((sum, stop) => sum + (stop.packageWeight || 0), 0)
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating route order:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async optimizeRoute(courierId, stops) {
    try {
      // Simulate route optimization algorithm
      const optimizedStops = [...stops].sort((a, b) => {
        // Simple optimization based on postcode
        const postcodeA = a.address?.postcode || '';
        const postcodeB = b.address?.postcode || '';
        return postcodeA.localeCompare(postcodeB);
      });

      const timeSaved = Math.floor(Math.random() * 30) + 10; // 10-40 minutes saved

      return {
        deliveries: optimizedStops,
        routeStops: optimizedStops.map((stop, index) => ({
          ...stop,
          sequence: index + 1
        })),
        optimizedRoute: optimizedStops,
        totalDistance: optimizedStops.length * 2.2, // Slightly reduced distance
        estimatedTime: optimizedStops.length * 12, // Reduced time
        timeSaved: timeSaved,
        courierCapacity: 10,
        totalWeight: optimizedStops.reduce((sum, stop) => sum + (stop.packageWeight || 0), 0)
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error optimizing route:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getRouteForCourier(courierId) {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Id" } },
          { "field": { "Name": "Name" } },
          { "field": { "Name": "order_number" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "pickup_address_name" } },
          { "field": { "Name": "pickup_address_street" } },
          { "field": { "Name": "pickup_address_city" } },
          { "field": { "Name": "pickup_address_postcode" } },
          { "field": { "Name": "delivery_address_name" } },
          { "field": { "Name": "delivery_address_street" } },
          { "field": { "Name": "delivery_address_city" } },
          { "field": { "Name": "delivery_address_postcode" } },
          { "field": { "Name": "estimated_delivery" } },
          { "field": { "Name": "package_weight" } },
          { "field": { "Name": "package_type" } },
          { "field": { "Name": "courier" } }
        ],
        where: [
          { FieldName: "courier", Operator: "EqualTo", Values: [parseInt(courierId)] },
          { FieldName: "status", Operator: "ExactMatch", Values: ["pending", "assigned", "in-transit"] }
        ],
        orderBy: [
          { fieldName: "estimated_delivery", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("delivery", params);
      
      if (!response.success) {
        console.error(response.message);
        return { deliveries: [], optimizedRoute: [], totalDistance: 0, estimatedTime: 0 };
      }

      const deliveries = response.data || [];
      
      // Format route data for optimization
      const routeStops = deliveries.map((delivery, index) => ({
        id: delivery.Id,
        orderId: delivery.order_number,
        type: 'delivery',
        priority: delivery.status === 'assigned' ? 'high' : 'normal',
        address: {
          name: delivery.delivery_address_name,
          street: delivery.delivery_address_street,
          city: delivery.delivery_address_city,
          postcode: delivery.delivery_address_postcode,
          fullAddress: `${delivery.delivery_address_street}, ${delivery.delivery_address_city} ${delivery.delivery_address_postcode}`
        },
        pickupAddress: {
          name: delivery.pickup_address_name,
          street: delivery.pickup_address_street,
          city: delivery.pickup_address_city,
          postcode: delivery.pickup_address_postcode,
          fullAddress: `${delivery.pickup_address_street}, ${delivery.pickup_address_city} ${delivery.pickup_address_postcode}`
        },
        estimatedTime: delivery.estimated_delivery,
        packageWeight: delivery.package_weight || 0,
        packageType: delivery.package_type || 'standard',
        status: delivery.status,
        sequence: index + 1
      }));

      return {
        deliveries: deliveries,
        routeStops: routeStops,
        optimizedRoute: routeStops, // Initially same as stops, can be optimized
        totalDistance: routeStops.length * 2.5, // Estimated 2.5km average per stop
        estimatedTime: routeStops.length * 15, // Estimated 15 minutes per stop
        courierCapacity: 10, // Default capacity
        totalWeight: routeStops.reduce((sum, stop) => sum + stop.packageWeight, 0)
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courier route:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { deliveries: [], routeStops: [], optimizedRoute: [], totalDistance: 0, estimatedTime: 0 };
    }
  }
}

export default new CourierService();