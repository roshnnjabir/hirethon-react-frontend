import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
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
  Share2,
  Clock,
  Globe,
  Lock
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ShortURLDetail = () => {
  const { orgId, namespaceId, urlId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Fetch URL details
  const { data: url, isLoading: urlLoading } = useQuery({
    queryKey: ['url', urlId],
    queryFn: async () => {
      const response = await api.get(`/urls/${urlId}/`);
      return response.data;
    },
    enabled: !!urlId,
  });

  // Fetch URL analytics
  const { data: analytics = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['url-analytics', urlId],
    queryFn: async () => {
      const response = await api.get(`/urls/${urlId}/analytics/`);
      return response.data.results || response.data;
    },
    enabled: !!urlId,
  });

  // Fetch namespace details
  const { data: namespace } = useQuery({
    queryKey: ['namespace', namespaceId],
    queryFn: async () => {
      const response = await api.get(`/namespaces/${namespaceId}/`);
      return response.data;
    },
    enabled: !!namespaceId,
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
      navigate(`/org/${orgId}/namespaces/${namespaceId}`);
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

  if (urlLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <ExternalLink className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">URL not found</h3>
          <Button variant="primary" onClick={() => navigate(`/org/${orgId}/namespaces/${namespaceId}`)}>
            Back to Namespace
          </Button>
        </div>
      </div>
    );
  }

  const fullURL = namespace ? `${window.location.origin}/${namespace.name}/${url.short_code}` : '';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/org/${orgId}/namespaces/${namespaceId}`)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900">
                {url.title || 'Untitled URL'}
              </h1>
              <p className="text-neutral-600">{fullURL}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                icon={<Edit className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* URL Details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">URL Details</h2>
              
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
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Analytics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  <h3 className="font-medium text-neutral-900">Recent Clicks</h3>
                  {analytics.slice(0, 10).map((click, index) => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
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
                  icon={<QrCode className="w-4 h-4" />}
                  className="w-full"
                >
                  Generate QR Code
                </Button>
              </div>
            </div>

            {/* URL Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">URL Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Short Code:</span>
                  <span className="font-mono text-neutral-900">{url.short_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Namespace:</span>
                  <span className="text-neutral-900">{namespace?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Created:</span>
                  <span className="text-neutral-900">
                    {new Date(url.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    url.is_active 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-error-100 text-error-700'
                  }`}>
                    {url.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortURLDetail;
