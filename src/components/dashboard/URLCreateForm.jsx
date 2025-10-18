import React, { useState, useCallback } from 'react';
import { Link as LinkIcon, Plus, Upload, Download } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormField from '../common/FormField';
import FileUpload from '../common/FileUpload';
import { isValidURL, generateRandomString } from '../../utils/helpers';
import toast from 'react-hot-toast';

const URLCreateForm = ({
  isOpen,
  onClose,
  onSubmit,
  namespaces = [],
  defaultNamespace = null,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    original_url: '',
    title: '',
    description: '',
    short_code: '',
    namespace: defaultNamespace?.id || '',
    is_private: false,
    expires_at: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const generateShortCode = useCallback(() => {
    const randomCode = generateRandomString(6);
    setFormData(prev => ({
      ...prev,
      short_code: randomCode,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.original_url.trim()) {
      newErrors.original_url = 'URL is required';
    } else if (!isValidURL(formData.original_url)) {
      newErrors.original_url = 'Please enter a valid URL';
    }

    if (!formData.namespace) {
      newErrors.namespace = 'Namespace is required';
    }

    if (formData.short_code && !/^[a-zA-Z0-9_-]+$/.test(formData.short_code)) {
      newErrors.short_code = 'Short code can only contain letters, numbers, hyphens, and underscores';
    }

    if (formData.expires_at && new Date(formData.expires_at) <= new Date()) {
      newErrors.expires_at = 'Expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
      toast.success('Short URL created successfully!');
    } catch (error) {
      console.error('Error creating URL:', error);
      toast.error('Failed to create short URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ file: uploadedFile, namespace: formData.namespace });
      handleClose();
      toast.success('URLs uploaded successfully!');
    } catch (error) {
      console.error('Error uploading URLs:', error);
      toast.error('Failed to upload URLs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      original_url: '',
      title: '',
      description: '',
      short_code: '',
      namespace: defaultNamespace?.id || '',
      is_private: false,
      expires_at: '',
    });
    setErrors({});
    setUploadedFile(null);
    setShowBulkUpload(false);
    onClose();
  };

  const downloadTemplate = () => {
    // In a real app, this would download the template from the API
    const templateData = [
      ['original_url', 'title', 'description', 'short_code'],
      ['https://example.com', 'Example URL', 'This is an example', 'example'],
    ];
    
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'url-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title={showBulkUpload ? 'Bulk Upload URLs' : 'Create Short URL'}
      className={className}
    >
      <div className="space-y-6">
        {/* Toggle between single and bulk upload */}
        <div className="flex gap-2">
          <Button
            variant={!showBulkUpload ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowBulkUpload(false)}
            icon={<LinkIcon className="w-4 h-4" />}
          >
            Single URL
          </Button>
          <Button
            variant={showBulkUpload ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowBulkUpload(true)}
            icon={<Upload className="w-4 h-4" />}
          >
            Bulk Upload
          </Button>
        </div>

        {!showBulkUpload ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Original URL"
              name="original_url"
              type="url"
              value={formData.original_url}
              onChange={handleChange}
              error={errors.original_url}
              required
              placeholder="https://example.com"
            />

            <FormField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Optional title for the URL"
            />

            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Namespace"
                name="namespace"
                value={formData.namespace}
                onChange={handleChange}
                error={errors.namespace}
                required
                type="select"
              >
                <option value="">Select namespace</option>
                {namespaces.map((ns) => (
                  <option key={ns.id} value={ns.id}>
                    {ns.name}
                  </option>
                ))}
              </FormField>

              <div className="space-y-2">
                <FormField
                  label="Short Code"
                  name="short_code"
                  value={formData.short_code}
                  onChange={handleChange}
                  error={errors.short_code}
                  placeholder="Leave empty for auto-generate"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateShortCode}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Expiry Date"
                name="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={handleChange}
                error={errors.expires_at}
              />

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_private"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleChange}
                  className="rounded border-neutral-300 text-brand-orange focus:ring-brand-orange"
                />
                <label htmlFor="is_private" className="text-sm text-neutral-700">
                  Private URL (requires authentication)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                icon={<LinkIcon className="w-4 h-4" />}
              >
                Create URL
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                Bulk Upload Instructions
              </h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Upload an Excel file (.xlsx or .xls) with your URLs</li>
                <li>• Include columns: original_url, title, description, short_code</li>
                <li>• Short codes are optional and will be auto-generated if empty</li>
                <li>• Maximum file size: 5MB</li>
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-neutral-900">
                Select Namespace
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                icon={<Download className="w-4 h-4" />}
              >
                Download Template
              </Button>
            </div>

            <FormField
              label="Namespace"
              name="namespace"
              value={formData.namespace}
              onChange={handleChange}
              error={errors.namespace}
              required
              type="select"
            >
              <option value="">Select namespace</option>
              {namespaces.map((ns) => (
                <option key={ns.id} value={ns.id}>
                  {ns.name}
                </option>
              ))}
            </FormField>

            <FileUpload
              accept=".xlsx,.xls"
              onFileSelect={setUploadedFile}
              placeholder="Upload Excel file with URLs"
              helpText="Excel files only (.xlsx, .xls)"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleBulkSubmit}
                loading={isLoading}
                disabled={!uploadedFile || !formData.namespace}
                icon={<Upload className="w-4 h-4" />}
              >
                Upload URLs
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default URLCreateForm;
