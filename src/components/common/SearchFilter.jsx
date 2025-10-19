import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Calendar, Tag, Globe } from 'lucide-react';
import Input from './Input';
import Select from './Select';
import Button from './Button';

const SearchFilter = ({ onSearch, onFilterChange, filters = {}, showAdvanced = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || 'all',
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
    tags: filters.tags || '',
    isPrivate: filters.isPrivate || 'all',
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [localFilters, onFilterChange]);

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      status: 'all',
      dateFrom: '',
      dateTo: '',
      tags: '',
      isPrivate: 'all',
    };
    setLocalFilters(clearedFilters);
    setSearchTerm('');
    
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
    if (onSearch) {
      onSearch('');
    }
  }, [onFilterChange, onSearch]);

  const hasActiveFilters = 
    searchTerm ||
    localFilters.status !== 'all' ||
    localFilters.dateFrom ||
    localFilters.dateTo ||
    localFilters.tags ||
    localFilters.isPrivate !== 'all';

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search URLs, titles, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {showAdvanced && (
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#FFC107] text-white text-xs rounded-full">
                •
              </span>
            )}
          </Button>
        )}
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      {showFilters && showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Status
            </label>
            <Select
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All URLs</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </Select>
          </div>

          {/* Privacy filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Privacy
            </label>
            <Select
              value={localFilters.isPrivate}
              onChange={(e) => handleFilterChange('isPrivate', e.target.value)}
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Select>
          </div>

          {/* Date from */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              From Date
            </label>
            <Input
              type="date"
              value={localFilters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          {/* Date to */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              To Date
            </label>
            <Input
              type="date"
              value={localFilters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          {/* Tags filter */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              placeholder="e.g., marketing, campaign, 2024"
              value={localFilters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;

