import { toast } from "react-toastify";

class DeliveryService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.tableName = 'delivery';
    
    // Define all fields from the delivery table
    this.fields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } },
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
      { "field": { "Name": "created_at" } },
      { "field": { "Name": "estimated_delivery" } },
      { "field": { "Name": "actual_delivery" } },
      { "field": { "Name": "package_weight" } },
      { "field": { "Name": "package_dimensions" } },
      { "field": { "Name": "package_type" } },
      { "field": { "Name": "courier" } }
    ];

    // Identify lookup fields for special handling
    this.lookupFields = ['courier'];
  }

  prepareLookupFields(data) {
    const prepared = {...data};
    this.lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        // Handle both object and direct ID inputs
        prepared[fieldName] = parseInt(
          prepared[fieldName]?.Id || prepared[fieldName]
        );
      }
    });
    return prepared;
  }

  async getAll() {
    try {
      const params = {
        fields: this.fields,
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
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
        console.error("Error fetching deliveries:", error?.response?.data?.message);
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
        console.error(`Error fetching delivery with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(deliveryData) {
    try {
      // Only include updateable fields and convert lookup fields
      const updateableData = this.prepareLookupFields({
        Name: deliveryData.Name || `Delivery ${Date.now()}`,
        Tags: deliveryData.Tags || "",
        Owner: deliveryData.Owner ? parseInt(deliveryData.Owner) : null,
        order_number: deliveryData.order_number || `SP${new Date().getFullYear()}${String(Date.now()).slice(-3)}`,
        status: deliveryData.status || "pending",
        pickup_address_name: deliveryData.pickup_address_name || deliveryData.pickupAddress?.name || "",
        pickup_address_street: deliveryData.pickup_address_street || deliveryData.pickupAddress?.street || "",
        pickup_address_city: deliveryData.pickup_address_city || deliveryData.pickupAddress?.city || "",
        pickup_address_postcode: deliveryData.pickup_address_postcode || deliveryData.pickupAddress?.postcode || "",
        delivery_address_name: deliveryData.delivery_address_name || deliveryData.deliveryAddress?.name || "",
        delivery_address_street: deliveryData.delivery_address_street || deliveryData.deliveryAddress?.street || "",
        delivery_address_city: deliveryData.delivery_address_city || deliveryData.deliveryAddress?.city || "",
        delivery_address_postcode: deliveryData.delivery_address_postcode || deliveryData.deliveryAddress?.postcode || "",
        created_at: deliveryData.created_at || new Date().toISOString(),
        estimated_delivery: deliveryData.estimated_delivery || deliveryData.estimatedDelivery || null,
        actual_delivery: deliveryData.actual_delivery || deliveryData.actualDelivery || null,
        package_weight: parseFloat(deliveryData.package_weight || deliveryData.package?.weight || 1.0),
        package_dimensions: deliveryData.package_dimensions || deliveryData.package?.dimensions || "",
        package_type: deliveryData.package_type || deliveryData.package?.type || "",
        courier: deliveryData.courier?.Id || deliveryData.courier?.id || deliveryData.courier || null
      });

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
          console.error(`Failed to create delivery ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating delivery:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, updates) {
    try {
      // Only include updateable fields and convert lookup fields
      const updateableData = this.prepareLookupFields({
        Id: parseInt(id),
        ...(updates.Name && { Name: updates.Name }),
        ...(updates.Tags !== undefined && { Tags: updates.Tags }),
        ...(updates.Owner && { Owner: parseInt(updates.Owner) }),
        ...(updates.order_number && { order_number: updates.order_number }),
        ...(updates.status && { status: updates.status }),
        ...(updates.pickup_address_name && { pickup_address_name: updates.pickup_address_name }),
        ...(updates.pickup_address_street && { pickup_address_street: updates.pickup_address_street }),
        ...(updates.pickup_address_city && { pickup_address_city: updates.pickup_address_city }),
        ...(updates.pickup_address_postcode && { pickup_address_postcode: updates.pickup_address_postcode }),
        ...(updates.delivery_address_name && { delivery_address_name: updates.delivery_address_name }),
        ...(updates.delivery_address_street && { delivery_address_street: updates.delivery_address_street }),
        ...(updates.delivery_address_city && { delivery_address_city: updates.delivery_address_city }),
        ...(updates.delivery_address_postcode && { delivery_address_postcode: updates.delivery_address_postcode }),
        ...(updates.created_at && { created_at: updates.created_at }),
        ...(updates.estimated_delivery !== undefined && { estimated_delivery: updates.estimated_delivery }),
        ...(updates.actual_delivery !== undefined && { actual_delivery: updates.actual_delivery }),
        ...(updates.package_weight !== undefined && { package_weight: parseFloat(updates.package_weight) }),
        ...(updates.package_dimensions && { package_dimensions: updates.package_dimensions }),
        ...(updates.package_type && { package_type: updates.package_type }),
        ...(updates.courier !== undefined && { courier: updates.courier })
      });

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
          console.error(`Failed to update delivery ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating delivery:", error?.response?.data?.message);
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
          console.error(`Failed to delete delivery ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting delivery:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async getRecentDeliveries(limit = 5) {
    try {
      const params = {
        fields: this.fields,
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent deliveries:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getDeliveryStats() {
    try {
      const params = {
        aggregators: [
          {
            id: "activeDeliveries",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
            where: [{ FieldName: "status", Operator: "ExactMatch", Values: ["assigned", "in-transit"] }]
          },
          {
            id: "pendingPickups",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
            where: [{ FieldName: "status", Operator: "EqualTo", Values: ["pending"] }]
          },
          {
            id: "completedToday",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
            where: [
              { FieldName: "status", Operator: "EqualTo", Values: ["delivered"] },
              { FieldName: "actual_delivery", Operator: "RelativeMatch", Values: ["Today"] }
            ]
          },
          {
            id: "totalDeliveries",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }]
          },
          {
            id: "successfulDeliveries",
            fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
            where: [{ FieldName: "status", Operator: "EqualTo", Values: ["delivered"] }]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return { activeDeliveries: 0, completedToday: 0, pendingPickups: 0, successRate: 0 };
      }

      const stats = { activeDeliveries: 0, completedToday: 0, pendingPickups: 0, successRate: 0 };
      
      if (response.aggregators) {
        let totalDeliveries = 0;
        let successfulDeliveries = 0;
        
        response.aggregators.forEach(agg => {
          if (agg.id === 'totalDeliveries') {
            totalDeliveries = agg.value || 0;
          } else if (agg.id === 'successfulDeliveries') {
            successfulDeliveries = agg.value || 0;
          } else {
            stats[agg.id] = agg.value || 0;
          }
        });
        
        stats.successRate = totalDeliveries > 0 ? Math.round((successfulDeliveries / totalDeliveries) * 100) : 0;
      }

      return stats;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching delivery stats:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { activeDeliveries: 0, completedToday: 0, pendingPickups: 0, successRate: 0 };
    }
  }

  async searchDeliveries(query) {
    try {
      if (!query) return await this.getAll();

      const params = {
        fields: this.fields,
        where: [
          {
            FieldName: "order_number",
            Operator: "Contains",
            Values: [query]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
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
        console.error("Error searching deliveries:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
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
              const rowNumber = i + 2;

              try {
                const requiredFields = ['customerName', 'customerStreet', 'customerCity', 'customerPostcode'];
                const missingFields = requiredFields.filter(field => !row[field] || row[field].trim() === '');
                
                if (missingFields.length > 0) {
                  throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
                }

                const deliveryData = {
                  delivery_address_name: row.customerName.trim(),
                  delivery_address_street: row.customerStreet.trim(),
                  delivery_address_city: row.customerCity.trim(),
                  delivery_address_postcode: row.customerPostcode.trim(),
                  pickup_address_name: row.pickupName?.trim() || 'Pickup Location',
                  pickup_address_street: row.pickupStreet?.trim() || '123 Default Street',
                  pickup_address_city: row.pickupCity?.trim() || 'London',
                  pickup_address_postcode: row.pickupPostcode?.trim() || 'W1A 0AX',
                  package_weight: parseFloat(row.packageWeight) || 1.0,
                  package_dimensions: row.packageDimensions || '20x15x10cm',
                  package_type: row.packageType?.trim() || 'General'
                };

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

              if (i < data.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }

            resolve({
              total: totalRows,
              successful,
              failed,
              errors: errors.slice(0, 10)
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