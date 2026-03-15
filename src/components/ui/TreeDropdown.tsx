import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

export type TreeNode = {
  label: string;
  value: string;
  children?: TreeNode[];
};

export function TreeDropdown({ value, onChange, options, placeholder = "请选择" }: { value: string, onChange: (val: string) => void, options: TreeNode[], placeholder?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    const newSet = new Set(expandedKeys);
    if (newSet.has(val)) newSet.delete(val);
    else newSet.add(val);
    setExpandedKeys(newSet);
  };

  const findLabel = (nodes: TreeNode[], val: string): string | null => {
    for (const node of nodes) {
      if (node.value === val) return node.label;
      if (node.children) {
        const found = findLabel(node.children, val);
        if (found) return found;
      }
    }
    return null;
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.value);
    const isSelected = value === node.value;

    return (
      <div key={node.value}>
        <div
          className={`flex items-center py-1.5 px-2 hover:bg-slate-100 cursor-pointer text-sm ${isSelected ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            onChange(node.value);
            setIsOpen(false);
          }}
        >
          <div 
            className="w-4 h-4 mr-1 flex items-center justify-center" 
            onClick={(e) => hasChildren ? toggleExpand(e, node.value) : undefined}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown size={14} className="text-slate-400 hover:text-slate-600" /> : <ChevronRight size={14} className="text-slate-400 hover:text-slate-600" />
            ) : <div className="w-4 h-4" />}
          </div>
          <span className="flex-1 truncate select-none">{node.label}</span>
          {isSelected && <Check size={14} className="text-blue-600 ml-2 flex-shrink-0" />}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const displayLabel = findLabel(options, value) || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <span className="truncate mr-2">{displayLabel}</span>
        <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto py-1">
          {options.map(node => renderNode(node))}
        </div>
      )}
    </div>
  );
}
