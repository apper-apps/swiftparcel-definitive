import apiConfigsData from "@/services/mockData/apiConfigs.json";

class ApiConfigService {
  constructor() {
    this.configs = [...apiConfigsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.configs];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const config = this.configs.find(c => c.Id === parseInt(id));
    if (!config) {
      throw new Error("API configuration not found");
    }
    return { ...config };
  }

  async create(configData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newConfig = {
      Id: Math.max(...this.configs.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      ...configData
    };
    
    this.configs.push(newConfig);
    return { ...newConfig };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.configs.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("API configuration not found");
    }
    
    this.configs[index] = { 
      ...this.configs[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.configs[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.configs.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("API configuration not found");
    }
    
    this.configs.splice(index, 1);
    return true;
  }

  async getActiveConfig() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const activeConfig = this.configs.find(config => config.isActive);
    return activeConfig ? { ...activeConfig } : null;
  }

  async testConnection(configId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const config = this.configs.find(c => c.Id === parseInt(configId));
    if (!config) {
      throw new Error("Configuration not found");
    }
    
    // Simulate connection test
    const success = Math.random() > 0.2; // 80% success rate
    return {
      success,
      message: success ? "Connection successful" : "Connection failed",
      timestamp: new Date().toISOString()
    };
  }

  async validateWebhook(webhookUrl) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate webhook validation
    const isValid = webhookUrl && webhookUrl.startsWith('https://');
    return {
      valid: isValid,
      message: isValid ? "Webhook URL is valid" : "Invalid webhook URL format"
    };
  }

  async getApiStats() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return {
      totalConfigs: this.configs.length,
      activeConfigs: this.configs.filter(c => c.isActive).length,
      platforms: [...new Set(this.configs.map(c => c.platform))].filter(Boolean),
      lastSync: new Date().toISOString()
    };
  }
}

export default new ApiConfigService();