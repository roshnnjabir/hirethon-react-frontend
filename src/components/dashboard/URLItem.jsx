import React, { memo } from 'react';
import { Link as LinkIcon, ExternalLink, Copy, Edit2, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * URL list item with stats and actions
 * Memoized for performance
 */
const URLItem = memo(({
  url,
  onEdit,
  onDelete,
  onClick,
  showNamespace = false,
  className = '',
}) => {
  const handleCopy = async (e) => {
    e.stopPropagation();
    const namespacePart = url.namespace_name || url.namespace;
    const shortUrl = `${window.location.origin}/${namespacePart}/${url.short_code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Short URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(url);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(url);
  };

  const handleClick = () => {
    onClick?.(url);
  };

  const handleOpenOriginal = (e) => {
    e.stopPropagation();
    window.open(url.original_url, '_blank', 'noopener,noreferrer');
  };

  // Check if this is optimistic data
  const isOptimistic = url._optimistic;

  return (
    <div 
      className={`
        flex items-center justify-between p-4 border-b border-neutral-200 
        last:border-b-0 hover:bg-neutral-50 transition-all group
        ${onClick ? 'cursor-pointer' : ''}
        ${isOptimistic ? 'opacity-60 animate-pulse' : ''}
        ${className}
      `}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <LinkIcon className="w-5 h-5 text-primary-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {url.title || url.original_url}
            </p>
            {url.is_private && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-700 flex-shrink-0">
                <Eye className="w-3 h-3 mr-1" />
                Private
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span className="font-mono truncate">
              {showNamespace && url.namespace_name && `${url.namespace_name}/`}{url.short_code}
            </span>
            <span>•</span>
            <span>{url.click_count || 0} clicks</span>
            {url.expires_at && (
              <>
                <span>•</span>
                <span>Expires {new Date(url.expires_at).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4">
        <button
          onClick={handleCopy}
          className="p-2 text-neutral-400 hover:text-primary-500 hover:bg-white rounded transition-colors"
          title="Copy short URL"
          aria-label="Copy short URL"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={handleOpenOriginal}
          className="p-2 text-neutral-400 hover:text-info-500 hover:bg-white rounded transition-colors"
          title="Open original URL"
          aria-label="Open original URL"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-2 text-neutral-400 hover:text-primary-500 hover:bg-white rounded transition-colors"
            title="Edit URL"
            aria-label="Edit URL"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-neutral-400 hover:text-error-500 hover:bg-white rounded transition-colors"
            title="Delete URL"
            aria-label="Delete URL"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.url?.id === nextProps.url?.id &&
    prevProps.url?.click_count === nextProps.url?.click_count &&
    prevProps.url?.is_private === nextProps.url?.is_private
  );
});

URLItem.displayName = 'URLItem';

export default URLItem;

