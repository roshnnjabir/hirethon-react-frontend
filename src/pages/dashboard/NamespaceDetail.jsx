import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Link as LinkIcon, 
  Search, 
  Filter,
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  BarChart3,
  Calendar,
  Eye,
  EyeOff,
  QrCode,
  Download,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const NamespaceDetail = () => {
  const { orgId, namespaceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [filters, setFilters] = useState({
    is_private: null, // null = all, true = private only, false = public only
    sort_by: 'created_at', // created_at, click_count, title
    sort_order: 'desc' // asc, desc
  });
  const [newURL, setNewURL] = useState({ 
    original_url: '', 
    short_code: '', 
    title: '', 
    description: '',
    is_private: false,
    expires_at: ''
  });

  // Fetch namespace details
  const { data: namespace, isLoading: namespaceLoading } = useQuery({
    queryKey: ['namespace', namespaceId],
    queryFn: async () => {
      const response = await api.get(`/namespaces/${namespaceId}/`);
      return response.data;
    },
    enabled: !!namespaceId,
  });

  // Fetch URLs in namespace
  const { data: urls = [], isLoading: urlsLoading } = useQuery({
    queryKey: ['namespace-urls', namespaceId],
    queryFn: async () => {
      const response = await api.get(`/namespaces/${namespaceId}/urls/`);
      return response.data.results || response.data;
    },
    enabled: !!namespaceId,
  });

  // Create URL mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/urls/', {
        ...data,
        namespace: namespaceId
      });
      return response.data;
    },
    onSuccess: (newURL) => {
      queryClient.invalidateQueries(['namespace-urls', namespaceId]);
      setShowCreateModal(false);
      setNewURL({ 
        original_url: '', 
        short_code: '', 
        title: '', 
        description: '',
        is_private: false,
        expires_at: ''
      });
      toast.success('URL created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create URL');
    },
  });

  // Delete URL mutation
  const deleteMutation = useMutation({
    mutationFn: async (urlId) => {
      const response = await api.delete(`/urls/${urlId}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['namespace-urls', namespaceId]);
      toast.success('URL deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete URL');
    },
  });

  // Bulk create mutation
  const bulkCreateMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('namespace', namespaceId);
      
      const response = await api.post('/urls/bulk_create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['namespace-urls', namespaceId]);
      setShowBulkModal(false);
      toast.success(`Successfully created ${data.created_count} URLs!`);
    },
    onError: (error) => {
      toast.error('Failed to bulk create URLs');
    },
  });

  const handleCreateURL = (e) => {
    e.preventDefault();
    if (!newURL.original_url.trim()) return;
    
    const urlData = {
      original_url: newURL.original_url.trim(),
      title: newURL.title.trim() || null,
      description: newURL.description.trim() || null,
      is_private: newURL.is_private,
      expires_at: newURL.expires_at || null
    };

    if (newURL.short_code.trim()) {
      urlData.short_code = newURL.short_code.trim();
    }

    createMutation.mutate(urlData);
  };

  const handleDeleteURL = (urlId, urlTitle) => {
    if (window.confirm(`Are you sure you want to delete "${urlTitle || 'this URL'}"?`)) {
      deleteMutation.mutate(urlId);
    }
  };

  const handleCopyURL = (shortCode) => {
    const fullURL = `${window.location.origin}/${namespace?.name}/${shortCode}`;
    navigator.clipboard.writeText(fullURL);
    toast.success('URL copied to clipboard!');
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      bulkCreateMutation.mutate(file);
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const performExport = () => {
    const data = filteredURLs.map(url => ({
      'Original URL': url.original_url,
      'Short Code': url.short_code,
      'Title': url.title || '',
      'Description': url.description || '',
      'Private': url.is_private ? 'Yes' : 'No',
      'Clicks': url.click_count,
      'Created At': new Date(url.created_at).toLocaleDateString()
    }));

    const filename = `${namespace?.name}-urls-${new Date().toISOString().split('T')[0]}`;

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
    toast.success(`URLs exported as ${exportFormat.toUpperCase()} successfully!`);
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
    // Create Excel content using proper CSV format that Excel trusts
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers,
      ...data.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`))
    ].map(row => row.join(',')).join('\n');

    // Add BOM for UTF-8 to ensure proper encoding in Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`; // Use .csv extension for better Excel compatibility
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = (data, filename) => {
    // Create PDF content using HTML and CSS
    const headers = Object.keys(data[0] || {});
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>URL Export</title>
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
            <h1>URL Export Report</h1>
            <div class="export-info">
              <p><strong>Namespace:</strong> ${namespace?.name}</p>
              <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Total URLs:</strong> ${data.length}</p>
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

    // Create blob and download directly
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`; // Download as HTML file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      is_private: null,
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  const filteredURLs = urls
    .filter(url => {
      // Search filter
      const matchesSearch = url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (url.title && url.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        url.short_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Privacy filter
      const matchesPrivacy = filters.is_private === null || url.is_private === filters.is_private;
      
      return matchesSearch && matchesPrivacy;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sort_by) {
        case 'click_count':
          aValue = a.click_count;
          bValue = b.click_count;
          break;
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }
      
      if (filters.sort_order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (namespaceLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!namespace) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <LinkIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Namespace not found</h3>
          <Button variant="primary" onClick={() => navigate(`/org/${orgId}/namespaces`)}>
            Back to Namespaces
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/org/${orgId}/namespaces`)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-primary-600 rounded-xl flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">{namespace.name}</h1>
                  <p className="text-neutral-600">{urls.length} URLs</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBulkModal(true)}
                icon={<Upload className="w-4 h-4" />}
              >
                Bulk Upload
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Create URL
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                iconPosition="left"
              />
            </div>
            <Button 
              variant="outline" 
              icon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilterModal(true)}
            >
              Filter
            </Button>
            <Button 
              variant="outline" 
              icon={<Download className="w-4 h-4" />}
              onClick={handleExport}
              disabled={filteredURLs.length === 0}
            >
              Export
            </Button>
          </div>
        </div>

        {/* URLs List */}
        {urlsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card">
                <div className="loading-skeleton h-4 w-3/4 mb-3"></div>
                <div className="loading-skeleton h-3 w-full mb-2"></div>
                <div className="loading-skeleton h-3 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredURLs.length > 0 ? (
          <div className="space-y-4">
            {filteredURLs.map((url) => (
              <div key={url.id} className="card group">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-neutral-900 truncate">
                        {url.title || 'Untitled URL'}
                      </h3>
                      {url.is_private && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
                          <EyeOff className="w-3 h-3" />
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-2 truncate">
                      {url.original_url}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        <span>{url.click_count} clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(url.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-mono text-brand-orange">
                        {window.location.origin}/{namespace.name}/{url.short_code}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyURL(url.short_code)}
                        icon={<Copy className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`${window.location.origin}/${namespace.name}/${url.short_code}`, '_blank')}
                        icon={<ExternalLink className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/org/${orgId}/namespaces/${namespaceId}/url/${url.id}`)}
                        icon={<Edit className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteURL(url.id, url.title)}
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <LinkIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {searchTerm ? 'No URLs found' : 'No URLs created yet'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first URL to start shortening links'
              }
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Your First URL
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create URL Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Create New URL</h3>
            <form onSubmit={handleCreateURL} className="space-y-4">
              <Input
                label="Original URL"
                type="url"
                value={newURL.original_url}
                onChange={(e) => setNewURL(prev => ({ ...prev, original_url: e.target.value }))}
                placeholder="https://example.com"
                required
              />
              
              <Input
                label="Custom Short Code (Optional)"
                value={newURL.short_code}
                onChange={(e) => setNewURL(prev => ({ ...prev, short_code: e.target.value }))}
                placeholder="Leave empty for auto-generation"
              />
              
              <Input
                label="Title (Optional)"
                value={newURL.title}
                onChange={(e) => setNewURL(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your URL a title"
              />
              
              <Input
                label="Description (Optional)"
                value={newURL.description}
                onChange={(e) => setNewURL(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this URL is for"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_private"
                  checked={newURL.is_private}
                  onChange={(e) => setNewURL(prev => ({ ...prev, is_private: e.target.checked }))}
                  className="w-4 h-4 text-brand-orange border-neutral-300 rounded focus:ring-brand-orange"
                />
                <label htmlFor="is_private" className="text-sm text-neutral-700">
                  Make this URL private (requires authentication to access)
                </label>
              </div>

              <Input
                label="Expiration Date (Optional)"
                type="datetime-local"
                value={newURL.expires_at}
                onChange={(e) => setNewURL(prev => ({ ...prev, expires_at: e.target.value }))}
              />

              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Preview:</h4>
                <p className="text-xs text-neutral-600 font-mono">
                  {window.location.origin}/{namespace?.name}/{newURL.short_code || 'auto-generated'}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={createMutation.isPending}
                  disabled={!newURL.original_url.trim()}
                  className="flex-1"
                >
                  Create URL
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Bulk Upload URLs</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-600 mb-4">
                  Upload an Excel file with URLs to create multiple short URLs at once
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleBulkUpload}
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload">
                  <Button variant="outline" as="span">
                    Choose File
                  </Button>
                </label>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Excel Format:</h4>
                <div className="text-xs text-neutral-600 space-y-1">
                  <p>• Column A: Original URL (required)</p>
                  <p>• Column B: Custom Short Code (optional)</p>
                  <p>• Column C: Title (optional)</p>
                  <p>• Column D: Description (optional)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Filter URLs</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Privacy
                </label>
                <select
                  value={filters.is_private === null ? 'all' : filters.is_private.toString()}
                  onChange={(e) => {
                    const value = e.target.value === 'all' ? null : e.target.value === 'true';
                    handleFilterChange('is_private', value);
                  }}
                  className="input-field w-full"
                >
                  <option value="all">All URLs</option>
                  <option value="false">Public URLs only</option>
                  <option value="true">Private URLs only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sort by
                </label>
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="created_at">Created Date</option>
                  <option value="click_count">Click Count</option>
                  <option value="title">Title</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sort order
                </label>
                <select
                  value={filters.sort_order}
                  onChange={(e) => handleFilterChange('sort_order', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  Clear Filters
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Export URLs</h3>
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

              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Export Summary:</h4>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>• <strong>{filteredURLs.length}</strong> URLs will be exported</p>
                  <p>• Format: <strong>{exportFormat.toUpperCase()}</strong></p>
                  <p>• Includes: Original URL, Short Code, Title, Description, Privacy, Clicks, Created Date</p>
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
                  disabled={filteredURLs.length === 0}
                  className="flex-1"
                >
                  Export {exportFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamespaceDetail;
