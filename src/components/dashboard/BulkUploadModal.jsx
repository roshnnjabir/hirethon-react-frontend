import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { shorturlsAPI } from '../../api/shorturls';
import { emailsAPI } from '../../api/emails';
import toast from 'react-hot-toast';

const BulkUploadModal = ({ isOpen, onClose, namespaceId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const fileInputRef = useRef(null);
  const statusCheckInterval = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please select a valid Excel or CSV file');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !namespaceId) {
      toast.error('Please select a file and namespace');
      return;
    }

    setIsUploading(true);
    setUploadProgress({ status: 'uploading', message: 'Uploading file...' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('namespace', namespaceId);

      const response = await shorturlsAPI.bulkUpload(formData, namespaceId);
      
      if (response.status === 'processing') {
        setUploadProgress({
          status: 'processing',
          message: `Processing ${response.total_urls} URLs...`,
          taskId: response.task_id,
          estimatedTime: response.estimated_time
        });
        
        // Start checking task status
        startStatusCheck(response.task_id);
      } else {
        // Handle immediate response (fallback)
        setUploadProgress({
          status: 'completed',
          message: 'Upload completed successfully!',
          result: response
        });
        setIsUploading(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({
        status: 'error',
        message: error.response?.data?.error || 'Upload failed. Please try again.'
      });
      setIsUploading(false);
    }
  };

  const startStatusCheck = (taskId) => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }

    statusCheckInterval.current = setInterval(async () => {
      try {
        const statusResponse = await shorturlsAPI.checkTaskStatus(taskId);
        setTaskStatus(statusResponse);

        if (statusResponse.status === 'SUCCESS') {
          setUploadProgress({
            status: 'completed',
            message: 'Bulk upload completed successfully!',
            result: statusResponse.result
          });
          setIsUploading(false);
          clearInterval(statusCheckInterval.current);
          onSuccess?.();
          
          // Send notification email
          try {
            await emailsAPI.sendCustomEmail(
              [statusResponse.result.created_by_email],
              'Bulk URL Upload Complete',
              'bulk_upload_complete',
              {
                created_by_name: statusResponse.result.created_by_name,
                namespace_name: statusResponse.result.namespace_name,
                created_count: statusResponse.result.created_count,
                failed_count: statusResponse.result.failed_count,
                created_urls: statusResponse.result.created_urls
              }
            );
            toast.success('Notification email sent!');
          } catch (emailError) {
            console.error('Failed to send notification email:', emailError);
          }
        } else if (statusResponse.status === 'FAILURE') {
          setUploadProgress({
            status: 'error',
            message: statusResponse.error || 'Upload failed'
          });
          setIsUploading(false);
          clearInterval(statusCheckInterval.current);
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 2000); // Check every 2 seconds
  };

  const handleClose = () => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }
    setFile(null);
    setUploadProgress(null);
    setTaskStatus(null);
    setIsUploading(false);
    onClose();
  };

  const downloadTemplate = async () => {
    try {
      const blob = await shorturlsAPI.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bulk_upload_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Upload URLs</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!uploadProgress && (
            <div className="space-y-6">
              <div className="text-center">
                <FileSpreadsheet className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Excel File
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload an Excel file with your URLs. Download the template to see the required format.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Download Template
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {file ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Choose File
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Excel (.xlsx, .xls) or CSV files only
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>
          )}

          {uploadProgress && (
            <div className="space-y-6">
              <div className="text-center">
                {uploadProgress.status === 'uploading' && (
                  <>
                    <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Uploading File
                    </h3>
                  </>
                )}
                
                {uploadProgress.status === 'processing' && (
                  <>
                    <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Processing URLs
                    </h3>
                    <p className="text-gray-600 mb-2">{uploadProgress.message}</p>
                    <p className="text-sm text-gray-500">
                      Estimated time: {uploadProgress.estimatedTime}
                    </p>
                  </>
                )}
                
                {uploadProgress.status === 'completed' && (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Complete!
                    </h3>
                    {uploadProgress.result && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                        <p className="text-sm text-green-800">
                          <strong>Created:</strong> {uploadProgress.result.created_count} URLs
                        </p>
                        {uploadProgress.result.failed_count > 0 && (
                          <p className="text-sm text-orange-800">
                            <strong>Failed:</strong> {uploadProgress.result.failed_count} URLs
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
                
                {uploadProgress.status === 'error' && (
                  <>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Failed
                    </h3>
                    <p className="text-red-600">{uploadProgress.message}</p>
                  </>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {uploadProgress.status === 'completed' ? 'Done' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
