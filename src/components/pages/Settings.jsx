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

      {/* API Integration */}
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
                API Integration
              </h2>
              <p className="text-sm text-secondary-600">
                Connect with e-commerce platforms and external services
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField label="API Key">
              <div className="flex gap-3">
                <Input
                  value="sk_live_abc123xyz789..."
                  readOnly
                  className="flex-1 bg-secondary-50"
                />
                <Button variant="outline">
                  <ApperIcon name="Copy" size={16} className="mr-2" />
                  Copy
                </Button>
              </div>
            </FormField>

            <FormField label="Webhook URL">
              <Input
                value="https://api.swiftparcel.com/webhooks/delivery-updates"
                placeholder="Enter webhook URL for delivery updates"
              />
            </FormField>

            <div className="flex items-center gap-3">
              <Button variant="outline">
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Regenerate API Key
              </Button>
              <Button variant="outline">
                <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                API Documentation
              </Button>
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