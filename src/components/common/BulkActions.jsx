import React from 'react';
import { Trash2, Edit, X, Check } from 'lucide-react';
import Button from './Button';

const BulkActions = ({ selectedCount, onDelete, onEdit, onClear, onSelectAll, totalCount }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-neutral-200 rounded-xl shadow-xl px-6 py-4 flex items-center gap-4 backdrop-blur-sm bg-white/95">
        {/* Selection info */}
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-[#FFC107]" />
          <span className="font-medium text-neutral-900">
            {selectedCount} selected
          </span>
          {totalCount && (
            <button
              onClick={onSelectAll}
              className="text-sm text-[#FFC107] hover:underline ml-2"
            >
              {selectedCount === totalCount ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-neutral-200" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>

        {/* Clear button */}
        <button
          onClick={onClear}
          className="ml-2 p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>
      </div>
    </div>
  );
};

export default BulkActions;

