import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: "SwiftParcel London",
    contactEmail: "operations@swiftparcel.com",
    phone: "+44 20 1234 5678",
    address: "123 Logistics Way, London, E14 5AB",
    defaultPickupTime: "60",
    autoAssignment: true,
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    operatingHours: {
      start: "08:00",
      end: "20:00"
    },
    apiConfig: {
      authType: "apikey",
      webhookUrl: "https://api.swiftparcel.com/webhooks/delivery-updates",
      webhookSecret: "",
      webhookEvents: ["delivery.created", "delivery.delivered"],
      platform: "",
      storeUrl: "",
      storeApiKey: "",
      clientId: "",
      clientSecret: "",
      redirectUri: "",
      jwtSecret: ""
    }
  });

  const handleSettingChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    toast.info("Settings reset to default values");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600 mt-1">
          Configure your SwiftParcel logistics platform
        </p>
      </motion.div>

      {/* Company Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Building2" size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">
                Company Information
              </h2>
              <p className="text-sm text-secondary-600">
                Basic information about your organization
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Company Name" required>
              <Input
                value={settings.companyName}
                onChange={(e) => handleSettingChange("companyName", e.target.value)}
                placeholder="Enter company name"
              />
            </FormField>

            <FormField label="Contact Email" required>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                placeholder="Enter contact email"
              />
            </FormField>

            <FormField label="Phone Number" required>
              <Input
                value={settings.phone}
                onChange={(e) => handleSettingChange("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </FormField>

            <FormField label="Default Pickup Time (minutes)">
              <Select
                value={settings.defaultPickupTime}
                onChange={(e) => handleSettingChange("defaultPickupTime", e.target.value)}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
              </Select>
            </FormField>

            <FormField label="Business Address" className="md:col-span-2">
              <Input
                value={settings.address}
                onChange={(e) => handleSettingChange("address", e.target.value)}
                placeholder="Enter business address"
              />
            </FormField>
          </div>
        </Card>
      </motion.div>

      {/* Operations Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Settings" size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">
                Operations Settings
              </h2>
              <p className="text-sm text-secondary-600">
                Configure delivery and operational preferences
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Operating Hours Start">
                <Input
                  type="time"
                  value={settings.operatingHours.start}
                  onChange={(e) => handleSettingChange("operatingHours.start", e.target.value)}
                />
              </FormField>

              <FormField label="Operating Hours End">
                <Input
                  type="time"
                  value={settings.operatingHours.end}
                  onChange={(e) => handleSettingChange("operatingHours.end", e.target.value)}
                />
              </FormField>
            </div>

            <div className="border-t border-secondary-200 pt-6">
              <FormField label="Automatic Courier Assignment">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoAssignment}
                    onChange={(e) => handleSettingChange("autoAssignment", e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm text-secondary-700">
                    Automatically assign available couriers to new deliveries
                  </span>
                </label>
              </FormField>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Bell" size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">
                Notification Preferences
              </h2>
              <p className="text-sm text-secondary-600">
                Choose how you want to receive updates
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField label="Email Notifications">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange("notifications.email", e.target.checked)}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-secondary-700">
                  Receive delivery updates and alerts via email
                </span>
              </label>
            </FormField>

            <FormField label="SMS Notifications">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleSettingChange("notifications.sms", e.target.checked)}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-secondary-700">
                  Receive urgent alerts via SMS
                </span>
              </label>
            </FormField>

            <FormField label="Push Notifications">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange("notifications.push", e.target.checked)}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-secondary-700">
                  Receive real-time push notifications in the browser
                </span>
              </label>
            </FormField>
          </div>
        </Card>
      </motion.div>

{/* API Configuration Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Code" size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">
                API Configuration & Integration
              </h2>
              <p className="text-sm text-secondary-600">
                Connect with e-commerce platforms and configure secure API access
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Authentication Methods */}
            <div>
              <h3 className="text-md font-medium text-secondary-900 mb-4">Authentication Methods</h3>
              <div className="space-y-4">
                <FormField label="Authentication Type">
                  <Select
                    value={settings.apiConfig?.authType || 'apikey'}
                    onChange={(e) => handleSettingChange('apiConfig.authType', e.target.value)}
                  >
                    <option value="apikey">API Key</option>
                    <option value="oauth2">OAuth 2.0</option>
                    <option value="jwt">JWT Token</option>
                  </Select>
                </FormField>

                {(settings.apiConfig?.authType === 'apikey' || !settings.apiConfig?.authType) && (
                  <FormField label="API Key">
                    <div className="flex gap-3">
                      <Input
                        value="sk_live_abc123xyz789..."
                        readOnly
                        className="flex-1 bg-secondary-50"
                      />
                      <Button variant="outline" onClick={() => toast.info('API key copied to clipboard')}>
                        <ApperIcon name="Copy" size={16} className="mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" onClick={() => toast.success('New API key generated successfully')}>
                        <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </FormField>
                )}

                {settings.apiConfig?.authType === 'oauth2' && (
                  <div className="space-y-4">
                    <FormField label="Client ID">
                      <Input
                        value={settings.apiConfig?.clientId || ''}
                        onChange={(e) => handleSettingChange('apiConfig.clientId', e.target.value)}
                        placeholder="Enter OAuth 2.0 Client ID"
                      />
                    </FormField>
                    <FormField label="Client Secret">
                      <Input
                        type="password"
                        value={settings.apiConfig?.clientSecret || ''}
                        onChange={(e) => handleSettingChange('apiConfig.clientSecret', e.target.value)}
                        placeholder="Enter OAuth 2.0 Client Secret"
                      />
                    </FormField>
                    <FormField label="Redirect URI">
                      <Input
                        value={settings.apiConfig?.redirectUri || ''}
                        onChange={(e) => handleSettingChange('apiConfig.redirectUri', e.target.value)}
                        placeholder="https://your-app.com/oauth/callback"
                      />
                    </FormField>
                  </div>
                )}

                {settings.apiConfig?.authType === 'jwt' && (
                  <FormField label="JWT Secret">
                    <Input
                      type="password"
                      value={settings.apiConfig?.jwtSecret || ''}
                      onChange={(e) => handleSettingChange('apiConfig.jwtSecret', e.target.value)}
                      placeholder="Enter JWT signing secret"
                    />
                  </FormField>
                )}
              </div>
            </div>

            {/* Webhook Configuration */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-md font-medium text-secondary-900 mb-4">Webhook Settings</h3>
              <div className="space-y-4">
                <FormField label="Webhook URL">
                  <Input
                    value={settings.apiConfig?.webhookUrl || 'https://api.swiftparcel.com/webhooks/delivery-updates'}
                    onChange={(e) => handleSettingChange('apiConfig.webhookUrl', e.target.value)}
                    placeholder="Enter webhook URL for delivery updates"
                  />
                </FormField>

                <FormField label="Webhook Secret">
                  <div className="flex gap-3">
                    <Input
                      type="password"
                      value={settings.apiConfig?.webhookSecret || ''}
                      onChange={(e) => handleSettingChange('apiConfig.webhookSecret', e.target.value)}
                      placeholder="Webhook signing secret"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => toast.success('Webhook secret regenerated')}>
                      <ApperIcon name="RefreshCw" size={16} />
                    </Button>
                  </div>
                </FormField>

                <FormField label="Webhook Events">
                  <div className="space-y-2">
                    {[
                      { id: 'delivery.created', label: 'Delivery Created' },
                      { id: 'delivery.assigned', label: 'Delivery Assigned' },
                      { id: 'delivery.in_transit', label: 'Delivery In Transit' },
                      { id: 'delivery.delivered', label: 'Delivery Completed' },
                      { id: 'courier.status_changed', label: 'Courier Status Changed' }
                    ].map((event) => (
                      <label key={event.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.apiConfig?.webhookEvents?.includes(event.id) || false}
                          onChange={(e) => {
                            const currentEvents = settings.apiConfig?.webhookEvents || [];
                            const newEvents = e.target.checked
                              ? [...currentEvents, event.id]
                              : currentEvents.filter(id => id !== event.id);
                            handleSettingChange('apiConfig.webhookEvents', newEvents);
                          }}
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-secondary-700">
                          {event.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </FormField>

                <Button variant="outline" onClick={() => toast.info('Webhook connection tested successfully')}>
                  <ApperIcon name="Zap" size={16} className="mr-2" />
                  Test Webhook Connection
                </Button>
              </div>
            </div>

            {/* E-commerce Platform Integration */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-md font-medium text-secondary-900 mb-4">E-commerce Platform Integration</h3>
              <div className="space-y-4">
                <FormField label="Platform">
                  <Select
                    value={settings.apiConfig?.platform || ''}
                    onChange={(e) => handleSettingChange('apiConfig.platform', e.target.value)}
                  >
                    <option value="">Select Platform</option>
                    <option value="shopify">Shopify</option>
                    <option value="woocommerce">WooCommerce</option>
                    <option value="magento">Magento</option>
                    <option value="bigcommerce">BigCommerce</option>
                    <option value="prestashop">PrestaShop</option>
                    <option value="custom">Custom API</option>
                  </Select>
                </FormField>

                {settings.apiConfig?.platform && (
                  <div className="space-y-4">
                    <FormField label="Store URL">
                      <Input
                        value={settings.apiConfig?.storeUrl || ''}
                        onChange={(e) => handleSettingChange('apiConfig.storeUrl', e.target.value)}
                        placeholder="https://your-store.myshopify.com"
                      />
                    </FormField>

                    <FormField label="Store API Key">
                      <Input
                        type="password"
                        value={settings.apiConfig?.storeApiKey || ''}
                        onChange={(e) => handleSettingChange('apiConfig.storeApiKey', e.target.value)}
                        placeholder="Enter store API key"
                      />
                    </FormField>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" onClick={() => toast.success('Connection test successful')}>
                        <ApperIcon name="Link" size={16} className="mr-2" />
                        Test Connection
                      </Button>
                      <Button variant="outline" onClick={() => toast.info('Orders synced successfully')}>
                        <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                        Sync Orders
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* API Documentation & Tools */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-md font-medium text-secondary-900 mb-4">API Tools & Documentation</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline">
                  <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                  API Documentation
                </Button>
                <Button variant="outline">
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Download SDKs
                </Button>
                <Button variant="outline">
                  <ApperIcon name="Code" size={16} className="mr-2" />
                  Code Examples
                </Button>
                <Button variant="outline">
                  <ApperIcon name="Activity" size={16} className="mr-2" />
                  API Logs
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-4"
      >
        <Button variant="outline" onClick={handleReset}>
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          <ApperIcon name="Save" size={16} className="mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;