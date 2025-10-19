import React, { useState, useCallback } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import FormField from '../common/FormField';
import Textarea from '../common/Textarea';
import Checkbox from '../common/Checkbox';

/**
 * Modal for creating a new short URL
 */
const CreateURLModal = ({ isOpen, onClose, onSubmit, isLoading, namespaces = [] }) => {
  const [formData, setFormData] = useState({
    original_url: '',
    short_code: '',
    namespace: '',
    title: '',
    description: '',
    is_private: false,
    expires_at: '',
    generate_qr: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate URL
    if (!formData.original_url.trim()) {
      newErrors.original_url = 'Original URL is required';
    } else {
      try {
        new URL(formData.original_url);
      } catch (e) {
        newErrors.original_url = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }

    // Validate namespace
    if (!formData.namespace) {
      newErrors.namespace = 'Please select a namespace';
    }

    // Validate short code if provided
    if (formData.short_code && !/^[a-zA-Z0-9_-]+$/.test(formData.short_code)) {
      newErrors.short_code = 'Short code can only contain letters, numbers, hyphens, and underscores';
    }

    // Validate expiration date if provided
    if (formData.expires_at) {
      const expiryDate = new Date(formData.expires_at);
      if (expiryDate <= new Date()) {
        newErrors.expires_at = 'Expiration date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean up form data
    const cleanData = {
      original_url: formData.original_url.trim(),
      namespace: parseInt(formData.namespace),
      is_private: formData.is_private,
      generate_qr: formData.generate_qr,
    };

    // Add optional fields if provided
    if (formData.short_code) cleanData.short_code = formData.short_code.trim();
    if (formData.title) cleanData.title = formData.title.trim();
    if (formData.description) cleanData.description = formData.description.trim();
    if (formData.expires_at) cleanData.expires_at = formData.expires_at;

    onSubmit(cleanData);
  }, [formData, validateForm, onSubmit]);

  const handleClose = useCallback(() => {
    setFormData({
      original_url: '',
      short_code: '',
      namespace: '',
      title: '',
      description: '',
      is_private: false,
      expires_at: '',
      generate_qr: false,
    });
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Short URL"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Original URL */}
        <FormField
          label="Original URL"
          error={errors.original_url}
          required
        >
          <Input
            value={formData.original_url}
            onChange={(e) => handleChange('original_url', e.target.value)}
            placeholder="https://example.com/very/long/url"
            autoFocus
            disabled={isLoading}
          />
        </FormField>

        {/* Namespace */}
        <FormField
          label="Namespace"
          error={errors.namespace}
          required
        >
          <Select
            value={formData.namespace}
            onChange={(e) => handleChange('namespace', e.target.value)}
            disabled={isLoading}
          >
            <option value="">Select a namespace</option>
            {namespaces.map(ns => (
              <option key={ns.id} value={ns.id}>
                {ns.name}
              </option>
            ))}
          </Select>
        </FormField>

        {/* Short Code (optional) */}
        <FormField
          label="Custom Short Code"
          error={errors.short_code}
          hint="Leave blank to auto-generate"
        >
          <Input
            value={formData.short_code}
            onChange={(e) => handleChange('short_code', e.target.value)}
            placeholder="my-link"
            disabled={isLoading}
          />
        </FormField>

        {/* Title (optional) */}
        <FormField
          label="Title"
          hint="Optional - helps you identify the link"
        >
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="My awesome link"
            disabled={isLoading}
          />
        </FormField>

        {/* Description (optional) */}
        <FormField
          label="Description"
          hint="Optional"
        >
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What this link is for..."
            rows={3}
            disabled={isLoading}
          />
        </FormField>

        {/* Expiration Date (optional) */}
        <FormField
          label="Expiration Date"
          error={errors.expires_at}
          hint="Optional - link will stop working after this date"
        >
          <Input
            type="datetime-local"
            value={formData.expires_at}
            onChange={(e) => handleChange('expires_at', e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Checkboxes */}
        <div className="space-y-2">
          <Checkbox
            checked={formData.is_private}
            onChange={(e) => handleChange('is_private', e.target.checked)}
            label="Private URL"
            hint="Requires authentication to access"
            disabled={isLoading}
          />
          <Checkbox
            checked={formData.generate_qr}
            onChange={(e) => handleChange('generate_qr', e.target.checked)}
            label="Generate QR Code"
            hint="Create a scannable QR code for this link"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            Create Short URL
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateURLModal;

