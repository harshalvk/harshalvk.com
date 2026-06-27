'use client';

import * as React from 'react';
import { DragToConfirm, type DragToConfirmRef } from '@/registry/components/drag-to-confirm';
import { toast } from 'sonner';

export function DragToConfirmDemo() {
  const [deleted, setDeleted] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);
  const paymentRef = React.useRef<DragToConfirmRef>(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        maxWidth: 420,
        margin: '0 auto',
        padding: 24,
      }}
    >
      {/* basic: fire-and-forget confirm */}
      <section>
        <h3>Delete account</h3>
        <DragToConfirm
          label="Drag to delete account"
          confirmedLabel="Account deleted"
          variant="danger"
          onConfirm={() => {
            toast.success('Account Deleted', { id: 'drag-to-confirm' });
          }}
        />
      </section>

      {/* async confirm with simulated failure */}
      <section>
        <h3>Send payment (async, can fail)</h3>
        <DragToConfirm
          label="Drag to send $420.00"
          confirmedLabel="Payment sent"
          variant="success"
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 1200));
            const ok = Math.random() > 0.5;
            if (!ok) toast.error('Payment failed, slider will reset', { id: 'drag-to-confirm' });
            return ok;
          }}
        />
      </section>

      {/* controlled by parent state */}
      <section>
        <h3>Controlled (parent owns confirmed state)</h3>
        <DragToConfirm
          label="Drag to confirm"
          confirmed={deleted}
          onConfirm={() => setDeleted(true)}
        />
        <button onClick={() => setDeleted(false)} className="mt-2">
          Reset from parent
        </button>
      </section>

      {/* resetKey pattern: bump a counter to force reset */}
      <section>
        <h3>resetKey pattern</h3>
        <DragToConfirm label="Drag to confirm" resetKey={resetKey} variant="neutral" />
        <button onClick={() => setResetKey((k) => k + 1)} style={{ marginTop: 8 }}>
          Force reset
        </button>
      </section>

      {/* imperative ref API */}
      <section>
        <h3>Imperative ref</h3>
        <DragToConfirm ref={paymentRef} label="Drag to confirm" />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => paymentRef.current?.confirm()}>Confirm programmatically</button>
          <button onClick={() => paymentRef.current?.reset()}>Reset programmatically</button>
        </div>
      </section>

      {/* RTL */}
      <section dir="rtl">
        <h3>RTL</h3>
        <DragToConfirm dir="rtl" label="גרור לאישור" confirmedLabel="אושר" />
      </section>

      {/* disabled */}
      <section>
        <h3>Disabled</h3>
        <DragToConfirm label="Drag to confirm" disabled />
      </section>

      {/* form participation */}
      <section>
        <h3>Inside a form</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            console.log('form submit:', Object.fromEntries(data));
          }}
        >
          <DragToConfirm
            name="confirm-delete"
            label="Drag to submit"
            variant="success"
            onConfirm={() => true}
          />
          <button type="submit" style={{ marginTop: 8 }}>
            Submit form
          </button>
        </form>
      </section>
    </div>
  );
}
