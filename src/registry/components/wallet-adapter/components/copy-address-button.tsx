'use client';

import { useCallback } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner'; // swap for your toast lib if different
import { Button } from '@/components/ui/button';

export function CopyAddressButton({ address }: { address: string }) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied');
    } catch {
      toast.error('Failed to copy address');
    }
  }, [address]);

  return (
    <Button onClick={handleCopy} variant="ghost" size="icon" aria-label="Copy address">
      <Copy size={14} />
    </Button>
  );
}
