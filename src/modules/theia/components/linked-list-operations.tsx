'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LinkedListOperations({
  onInsertHead,
  onInsertTail,
  onInsertAtIndex,
  onDeleteValue,
  onDeleteIndex,
  onSearch,
  disabled,
}: {
  onInsertHead: (value: number) => void;
  onInsertTail: (value: number) => void;
  onInsertAtIndex: (value: number, index: number) => void;
  onDeleteValue: (value: number) => void;
  onDeleteIndex: (index: number) => void;
  onSearch: (value: number) => void;
  disabled?: boolean;
}) {
  const [insertValue, setInsertValue] = useState('50');
  const [insertIndex, setInsertIndex] = useState('0');
  const [deleteValue, setDeleteValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('0');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="bg-surface inset-ring-border/64 rounded-xl p-4 inset-ring-1">
      <Tabs defaultValue="insert">
        <TabsList className="mb-3">
          <TabsTrigger value="insert">Insert</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="insert" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground text-xs">Value</Label>
              <Input
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                className="w-24 font-mono text-sm"
                inputMode="numeric"
              />
            </div>
            <Button size="sm" disabled={disabled} onClick={() => onInsertHead(Number(insertValue))}>
              Insert at Head
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={disabled}
              onClick={() => onInsertTail(Number(insertValue))}
            >
              Insert at Tail
            </Button>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground text-xs">Index</Label>
              <Input
                value={insertIndex}
                onChange={(e) => setInsertIndex(e.target.value)}
                className="w-20 font-mono text-sm"
                inputMode="numeric"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={disabled}
              onClick={() => onInsertAtIndex(Number(insertValue), Number(insertIndex))}
            >
              Insert at Index
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="delete" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground text-xs">Value</Label>
              <Input
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                placeholder="e.g. 25"
                className="w-24 font-mono text-sm"
                inputMode="numeric"
              />
            </div>
            <Button
              size="sm"
              variant="destructive"
              disabled={disabled || !deleteValue}
              onClick={() => onDeleteValue(Number(deleteValue))}
            >
              Delete by Value
            </Button>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground text-xs">Index</Label>
              <Input
                value={deleteIndex}
                onChange={(e) => setDeleteIndex(e.target.value)}
                className="w-20 font-mono text-sm"
                inputMode="numeric"
              />
            </div>
            <Button
              size="sm"
              variant="destructive"
              disabled={disabled}
              onClick={() => onDeleteIndex(Number(deleteIndex))}
            >
              Delete by Index
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="search" className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs">Value</Label>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="e.g. 25"
              className="w-24 font-mono text-sm"
              inputMode="numeric"
            />
          </div>
          <Button
            size="sm"
            disabled={disabled || !searchValue}
            onClick={() => onSearch(Number(searchValue))}
          >
            Search (Traverse)
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
