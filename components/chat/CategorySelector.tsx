/**
 * Category Selector Component
 */

'use client';

import { LegalCategory, LEGAL_CATEGORIES } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategorySelectorProps {
  value?: LegalCategory;
  onChange: (category: LegalCategory | undefined) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as LegalCategory)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {LEGAL_CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
