import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  BarChart3,
  Calendar,
  Eye,
  QrCode,
  Download,
  Share2,
  Clock,
  Globe,
  Lock,
  Link as LinkIcon,
  X
} from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const URLDetailModal = ({ isOpen, onClose, urlId, namespaceId, orgId }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  // Fetch URL details
  const { data: url, isLoading: urlLoading } = useQuery({
    queryKey: ['url', urlId],
    queryFn: async () => {
      const response = await api.get(`/urls/${urlId}/`);
      return response.data;
    },
    enabled: !!urlId && isOpen,
  });

  // Fetch URL analytics
  const { data: analytics = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['url-analytics', urlId],
    queryFn: async () => {
      const response = await api.get(`/urls/${urlId}/analytics/`);
      return response.data.results || response.data;
    },
    enabled: !!urlId && isOpen,
  });

  // Fetch namespace details
  const { data: namespace } = useQuery({
    queryKey: ['namespace', namespaceId],
    queryFn: async () => {
      const response = await api.get(`/namespaces/${namespaceId}/`);
      return response.data;
    },
    enabled: !!namespaceId && isOpen,
  });

  // Update URL mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(`/urls/${urlId}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['url', urlId]);
      setIsEditing(false);
      toast.success('URL updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update URL');
    },
  });

  // Delete URL mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/urls/${urlId}/`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('URL deleted successfully!');
      onClose();
      // Refresh the namespace URLs list
      queryClient.invalidateQueries(['namespace-urls', namespaceId]);
    },
    onError: (error) => {
      toast.error('Failed to delete URL');
    },
  });

  const handleEdit = () => {
    if (url) {
      setEditData({
        title: url.title || '',
        description: url.description || '',
        is_private: url.is_private,
        expires_at: url.expires_at ? url.expires_at.slice(0, 16) : ''
      });
      setIsEditing(true);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate(editData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handleCopyURL = () => {
    if (url && namespace) {
      const fullURL = `${window.location.origin}/${namespace.name}/${url.short_code}`;
      navigator.clipboard.writeText(fullURL);
      toast.success('URL copied to clipboard!');
    }
  };

  const handleShare = () => {
    if (url && namespace) {
      const fullURL = `${window.location.origin}/${namespace.name}/${url.short_code}`;
      if (navigator.share) {
        navigator.share({
          title: url.title || 'Short URL',
          text: url.description || '',
          url: fullURL
        });
      } else {
        navigator.clipboard.writeText(fullURL);
        toast.success('URL copied to clipboard!');
      }
    }
  };

  const handleGenerateQR = () => {
    if (url && namespace) {
      const fullURL = `${window.location.origin}/${namespace.name}/${url.short_code}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullURL)}`;
      window.open(qrUrl, '_blank');
      toast.success('QR code generated!');
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const performExport = () => {
    if (!url || !namespace) return;

    const data = [{
      'Original URL': url.original_url,
      'Short Code': url.short_code,
      'Title': url.title || '',
      'Description': url.description || '',
      'Private': url.is_private ? 'Yes' : 'No',
      'Clicks': url.click_count,
      'Created At': new Date(url.created_at).toLocaleDateString(),
      'Short URL': `${window.location.origin}/${namespace.name}/${url.short_code}`
    }];

    const filename = `${namespace.name}-${url.short_code}-details`;

    switch (exportFormat) {
      case 'csv':
        exportToCSV(data, filename);
        break;
      case 'excel':
        exportToExcel(data, filename);
        break;
      case 'pdf':
        exportToPDF(data, filename);
        break;
      default:
        exportToCSV(data, filename);
    }

    setShowExportModal(false);
    toast.success(`URL details exported as ${exportFormat.toUpperCase()} successfully!`);
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers,
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`))
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers,
      ...data.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`))
    ].map(row => row.join(',')).join('\n');

    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>URL Details Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .header { text-align: center; margin-bottom: 20px; }
            .export-info { font-size: 12px; color: #666; margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>URL Details Report</h1>
            <div class="export-info">
              <p><strong>URL:</strong> ${url?.title || 'Untitled'}</p>
              <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditData({});
    setShowExportModal(false);
    onClose();
  };

  if (!isOpen || !url) return null;

  const fullURL = namespace ? `${window.location.origin}/${namespace.name}/${url.short_code}` : '';

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title={url.title || 'URL Details'} size="xl">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {url.title || 'Untitled URL'}
              </h2>
              <p className="text-sm text-neutral-600 font-mono">{fullURL}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                icon={<Edit className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* URL Details */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-neutral-900">URL Details</h3>
            
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label="Title"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your URL a title"
                />
                
                <Input
                  label="Description"
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this URL is for"
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_private_edit"
                    checked={editData.is_private}
                    onChange={(e) => setEditData(prev => ({ ...prev, is_private: e.target.checked }))}
                    className="w-4 h-4 text-brand-orange border-neutral-300 rounded focus:ring-brand-orange"
                  />
                  <label htmlFor="is_private_edit" className="text-sm text-neutral-700">
                    Make this URL private (requires authentication to access)
                  </label>
                </div>

                <Input
                  label="Expiration Date"
                  type="datetime-local"
                  value={editData.expires_at}
                  onChange={(e) => setEditData(prev => ({ ...prev, expires_at: e.target.value }))}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={updateMutation.isPending}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Original URL</label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-neutral-500" />
                    <a 
                      href={url.original_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-brand-orange hover:text-primary-600 truncate flex-1"
                    >
                      {url.original_url}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Short URL</label>
                  <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                    <LinkIcon className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-mono text-neutral-900 flex-1">{fullURL}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyURL}
                      icon={<Copy className="w-4 h-4" />}
                    />
                  </div>
                </div>

                {url.title && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                    <p className="text-sm text-neutral-900">{url.title}</p>
                  </div>
                )}

                {url.description && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                    <p className="text-sm text-neutral-900">{url.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {url.is_private ? (
                      <Lock className="w-4 h-4 text-brand-crimson" />
                    ) : (
                      <Globe className="w-4 h-4 text-brand-teal" />
                    )}
                    <span className="text-sm text-neutral-600">
                      {url.is_private ? 'Private URL' : 'Public URL'}
                    </span>
                  </div>

                  {url.expires_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">
                        Expires: {new Date(url.expires_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Analytics */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-neutral-900">Analytics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-brand-orange mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900">{url.click_count}</p>
                <p className="text-sm text-neutral-600">Total Clicks</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <Calendar className="w-6 h-6 text-brand-teal mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900">
                  {new Date(url.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-neutral-600">Created</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <Eye className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900">
                  {analytics.length}
                </p>
                <p className="text-sm text-neutral-600">Unique Visitors</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <Clock className="w-6 h-6 text-brand-skyBlue mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900">
                  {url.last_clicked_at ? new Date(url.last_clicked_at).toLocaleDateString() : 'Never'}
                </p>
                <p className="text-sm text-neutral-600">Last Clicked</p>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="loading-skeleton h-12"></div>
                ))}
              </div>
            ) : analytics.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-900">Recent Clicks</h4>
                {analytics.slice(0, 5).map((click, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {click.ip_address || 'Unknown IP'}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {click.user_agent || 'Unknown browser'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-900">
                        {new Date(click.clicked_at).toLocaleString()}
                      </p>
                      {click.referer && (
                        <p className="text-xs text-neutral-600 truncate max-w-32">
                          From: {click.referer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No clicks yet</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-neutral-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="primary"
                onClick={handleCopyURL}
                icon={<Copy className="w-4 h-4" />}
                className="w-full"
              >
                Copy URL
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                icon={<Share2 className="w-4 h-4" />}
                className="w-full"
              >
                Share URL
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(fullURL, '_blank')}
                icon={<ExternalLink className="w-4 h-4" />}
                className="w-full"
              >
                Test URL
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateQR}
                icon={<QrCode className="w-4 h-4" />}
                className="w-full"
              >
                Generate QR
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                icon={<Download className="w-4 h-4" />}
                className="w-full"
              >
                Export Details
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Export URL Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Export Format
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-4 h-4 text-brand-orange border-neutral-300 focus:ring-brand-orange"
                    />
                    <div>
                      <div className="font-medium text-neutral-900">CSV</div>
                      <div className="text-sm text-neutral-600">Comma-separated values, compatible with Excel</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-4 h-4 text-brand-orange border-neutral-300 focus:ring-brand-orange"
                    />
                    <div>
                      <div className="font-medium text-neutral-900">Excel (.csv)</div>
                      <div className="text-sm text-neutral-600">Excel-compatible CSV format</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-4 h-4 text-brand-orange border-neutral-300 focus:ring-brand-orange"
                    />
                    <div>
                      <div className="font-medium text-neutral-900">HTML Report</div>
                      <div className="text-sm text-neutral-600">Downloadable HTML report</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={performExport}
                  className="flex-1"
                >
                  Export {exportFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default URLDetailModal;
