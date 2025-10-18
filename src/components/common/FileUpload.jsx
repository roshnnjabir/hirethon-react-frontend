import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';
import { formatFileSize, getFileExtension } from '../../utils/helpers';

const FileUpload = ({
  accept = '.xlsx,.xls',
  maxSize = 5 * 1024 * 1024, // 5MB
  onFileSelect,
  onFileRemove,
  multiple = false,
  disabled = false,
  className = '',
  placeholder = 'Click to upload or drag and drop',
  helpText = 'Excel files only (.xlsx, .xls)',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = `.${getFileExtension(file.name)}`;
    if (!allowedTypes.includes(fileExtension)) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return errors;
  }, [accept, maxSize]);

  const handleFileSelect = useCallback((files) => {
    const fileArray = Array.from(files);
    const newFiles = [];
    const newErrors = [];

    fileArray.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        newFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'ready',
        });
      } else {
        newErrors.push(...fileErrors.map(error => `${file.name}: ${error}`));
      }
    });

    if (newFiles.length > 0) {
      setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
      onFileSelect?.(multiple ? newFiles : newFiles[0]);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }
  }, [validateFile, multiple, onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback((fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    onFileRemove?.(fileId);
  }, [onFileRemove]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-brand-orange bg-brand-orange/5'
            : 'border-neutral-300 hover:border-neutral-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-2">
          <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
          <p className="text-sm text-neutral-600">
            {placeholder}
          </p>
          <p className="text-xs text-neutral-500">
            {helpText}
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-900">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.status === 'ready' && (
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-brand-crimson" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  icon={<X className="w-4 h-4" />}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-brand-crimson flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
