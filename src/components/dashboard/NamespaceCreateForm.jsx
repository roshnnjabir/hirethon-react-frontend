import React, { useState, useCallback } from 'react';
import { FolderOpen, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormField from '../common/FormField';
import { namespacesAPI } from '../../api/namespaces';
import toast from 'react-hot-toast';

const NamespaceCreateForm = ({
  isOpen,
  onClose,
  onSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear availability status when name changes
    if (name === 'name' && availabilityStatus) {
      setAvailabilityStatus(null);
    }
  }, [errors, availabilityStatus]);

  const checkAvailability = useCallback(async () => {
    if (!formData.name.trim()) {
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const response = await namespacesAPI.checkAvailability(formData.name);
      setAvailabilityStatus(response.available ? 'available' : 'unavailable');
      
      if (!response.available) {
        setErrors(prev => ({
          ...prev,
          name: 'This namespace name is already taken',
        }));
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityStatus('error');
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [formData.name]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Namespace name is required';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.name)) {
      newErrors.name = 'Namespace name can only contain letters, numbers, hyphens, and underscores';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Namespace name must be at least 3 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Namespace name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check availability before submitting
    if (availabilityStatus !== 'available') {
      await checkAvailability();
      if (availabilityStatus !== 'available') {
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
      toast.success('Namespace created successfully!');
    } catch (error) {
      console.error('Error creating namespace:', error);
      toast.error('Failed to create namespace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
    });
    setErrors({});
    setAvailabilityStatus(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title="Create Namespace"
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <FormField
            label="Namespace Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="my-namespace"
            helpText="Only letters, numbers, hyphens, and underscores allowed. Must be globally unique."
          />

          {formData.name && (
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={checkAvailability}
                loading={isCheckingAvailability}
                disabled={!formData.name.trim() || isCheckingAvailability}
              >
                Check Availability
              </Button>
              
              {availabilityStatus === 'available' && (
                <div className="flex items-center space-x-1 text-sm text-brand-gold">
                  <Check className="w-4 h-4" />
                  <span>Available</span>
                </div>
              )}
              
              {availabilityStatus === 'unavailable' && (
                <div className="flex items-center space-x-1 text-sm text-brand-crimson">
                  <span>Not available</span>
                </div>
              )}
            </div>
          )}

          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Optional description for this namespace"
            helpText="Brief description of what this namespace is used for"
          />
        </div>

        <div className="bg-neutral-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-neutral-900 mb-2">
            Namespace Guidelines
          </h4>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Namespace names are globally unique across all organizations</li>
            <li>• Use descriptive names that reflect your brand or purpose</li>
            <li>• Avoid special characters and spaces</li>
            <li>• URLs will be accessible at: yourdomain.com/namespace/shortcode</li>
          </ul>
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
            disabled={availabilityStatus === 'unavailable'}
            icon={<FolderOpen className="w-4 h-4" />}
          >
            Create Namespace
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NamespaceCreateForm;
