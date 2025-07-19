import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import DeliveryTable from "@/components/organisms/DeliveryTable";
import Couriers from "@/components/pages/Couriers";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import useDeliveries from "@/hooks/useDeliveries";
import deliveryService from "@/services/deliveryService";
const Deliveries = () => {
  const { 
    deliveries, 
    loading, 
    error, 
    searchDeliveries, 
    updateDeliveryStatus,
    retryLoad 
  } = useDeliveries();
  
const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);
  const handleSearch = async (query) => {
    setSearchTerm(query);
    if (query.trim()) {
      await searchDeliveries(query);
    } else {
      retryLoad();
    }
  };

  const handleViewDetails = (delivery) => {
    toast.info(`Viewing details for delivery #${delivery.orderNumber}`);
  };

  const handleUpdateStatus = async (delivery) => {
    try {
      const newStatus = delivery.status === "pending" ? "assigned" : 
                       delivery.status === "assigned" ? "in-transit" :
                       delivery.status === "in-transit" ? "delivered" : 
                       "pending";
      
      await updateDeliveryStatus(delivery.Id, newStatus);
      toast.success(`Delivery status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update delivery status");
}
  };

  const handleBulkUpload = async (file) => {
    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      setUploadResults(null);
      
      const results = await deliveryService.bulkCreate(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadResults(results);
      setUploadStatus('completed');
      
      if (results.successful > 0) {
        retryLoad(); // Refresh the deliveries list
        toast.success(`Successfully imported ${results.successful} deliveries`);
      }
      
      if (results.failed > 0) {
        toast.warning(`${results.failed} deliveries failed to import. Check details below.`);
      }
    } catch (error) {
      setUploadStatus('error');
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  const resetUpload = () => {
    setUploadProgress(0);
    setUploadStatus(null);
    setUploadResults(null);
  };
  const filteredDeliveries = React.useMemo(() => {
    if (statusFilter === "all") return deliveries;
    return deliveries.filter(delivery => delivery.status === statusFilter);
  }, [deliveries, statusFilter]);

  if (error && !deliveries.length) {
    return (
      <Error
        title="Failed to load deliveries"
        message={error}
        onRetry={retryLoad}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Deliveries</h1>
          <p className="text-secondary-600 mt-1">
            Manage and track all delivery orders
</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button 
            variant="outline"
            onClick={() => setShowBulkUpload(true)}
          >
            <ApperIcon name="Upload" size={16} className="mr-2" />
            Bulk Upload
          </Button>
          <Button>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Delivery
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by order number, customer name, or address..."
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="min-w-[150px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </Select>
              </div>
              
              <Button variant="outline" size="sm">
                <ApperIcon name="Filter" size={16} className="mr-2" />
                More Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-secondary-600">
          Showing {filteredDeliveries.length} of {deliveries.length} deliveries
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== "all" && ` with status "${statusFilter}"`}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600">Sort by:</span>
          <Select className="min-w-[120px]" defaultValue="newest">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">Status</option>
            <option value="location">Location</option>
          </Select>
        </div>
      </motion.div>

      {/* Delivery Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DeliveryTable
          deliveries={filteredDeliveries}
          loading={loading}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      </motion.div>

      {/* Bulk Actions */}
      {filteredDeliveries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-600">
                    Select all visible deliveries
                  </span>
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ApperIcon name="Users" size={16} className="mr-2" />
                  Assign Couriers
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ApperIcon name="Edit" size={16} className="mr-2" />
                  Bulk Update
                </Button>
              </div>
            </div>
          </Card>
</motion.div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <BulkUploadModal
          isOpen={showBulkUpload}
          onClose={() => {
            setShowBulkUpload(false);
            resetUpload();
          }}
          onUpload={handleBulkUpload}
          progress={uploadProgress}
          status={uploadStatus}
          results={uploadResults}
        />
      )}
    </div>
  );
};

const BulkUploadModal = ({ isOpen, onClose, onUpload, progress, status, results }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type === 'text/csv') {
      onUpload(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const downloadTemplate = () => {
    const headers = ['customerName', 'customerStreet', 'customerCity', 'customerPostcode', 'pickupName', 'pickupStreet', 'pickupCity', 'pickupPostcode', 'packageWeight', 'packageType'];
    const sampleRow = ['John Doe', '123 Main St', 'London', 'SW1A 1AA', 'Store ABC', '456 Shop St', 'London', 'W1A 0AX', '2.5', 'Electronics'];
    
    const csvContent = [headers, sampleRow].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'delivery_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Bulk Upload Deliveries</h2>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          {status !== 'uploading' && status !== 'completed' && (
            <>
              <div className="mb-6">
                <Button
                  variant="info"
                  size="sm"
                  onClick={downloadTemplate}
                  className="mb-4"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Download CSV Template
                </Button>
                <p className="text-sm text-secondary-600">
                  Download the template to see the required format for your CSV file.
                </p>
              </div>

              <div
                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center py-12">
                  <ApperIcon name="Upload" size={48} className="mx-auto mb-4 text-secondary-400" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    Drop your CSV file here
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    Or click to browse and select your file
                  </p>
                  <Button variant="outline">
                    Select CSV File
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </>
          )}

          {status === 'uploading' && (
            <div className="text-center py-8">
              <div className="mb-4">
                <ApperIcon name="Upload" size={48} className="mx-auto text-primary-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Uploading Deliveries...
              </h3>
              <div className="w-full bg-secondary-200 rounded-full h-2 mb-4">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-secondary-600">{progress}% complete</p>
            </div>
          )}

          {status === 'completed' && results && (
            <div className="py-6">
              <div className="text-center mb-6">
                <ApperIcon name="CheckCircle" size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Upload Complete
                </h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.successful}</div>
                  <div className="text-sm text-green-700">Successful</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{results.total}</div>
                  <div className="text-sm text-blue-700">Total</div>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-secondary-900 mb-2">Errors:</h4>
                  <div className="max-h-40 overflow-y-auto bg-red-50 rounded-lg p-3">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => window.location.reload()}>
                  View Updated List
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-600 mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Upload Failed
              </h3>
              <p className="text-secondary-600 mb-4">
                There was an error processing your file. Please check the format and try again.
              </p>
              <Button variant="outline" onClick={() => {
                setUploadStatus(null);
                setUploadProgress(0);
              }}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Deliveries;