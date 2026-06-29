'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// ─── Control schema ──────────────────────────────────────────────────────────

interface BaseControl {
  /** Overrides the auto-generated label (defaults to the prop key). */
  label?: string;
}

export type PropControl =
  | (BaseControl & { type: 'boolean'; defaultValue: boolean })
  | (BaseControl & { type: 'string'; defaultValue: string; placeholder?: string })
  | (BaseControl & {
      type: 'number';
      defaultValue: number;
      min?: number;
      max?: number;
      step?: number;
    })
  | (BaseControl & { type: 'select'; defaultValue: string; options: string[] })
  | (BaseControl & { type: 'color'; defaultValue: string });

type ControlValues = Record<string, boolean | string | number>;

export interface ComponentPlaygroundProps {
  /** The component being demoed. */
  component: React.ComponentType<any>;
  /**
   * Display name used when generating the JSX snippet. Required rather
   * than read off `component.displayName` — minification and HOC
   * wrapping make that unreliable in a built registry bundle.
   */
  componentName: string;
  /** Editable props, in the order their controls should render. */
  controls: Record<string, PropControl>;
  /** Props always passed to the component, but not exposed to editing. */
  staticProps?: Record<string, unknown>;
  /** Applied to the preview surface — use to constrain/center the demo. */
  previewClassName?: string;
  className?: string;
}

function getDefaults(controls: Record<string, PropControl>): ControlValues {
  return Object.fromEntries(Object.entries(controls).map(([key, c]) => [key, c.defaultValue]));
}

// ─── Code generation ─────────────────────────────────────────────────────────

function formatPropValue(type: PropControl['type'], value: boolean | string | number): string {
  switch (type) {
    case 'boolean':
      return ''; // handled as shorthand by the caller
    case 'number':
      return `{${value}}`;
    case 'string':
    case 'select':
    case 'color':
      return `"${value}"`;
  }
}

function generateCode(
  componentName: string,
  controls: Record<string, PropControl>,
  values: ControlValues
): string {
  const propStrings = Object.entries(controls).map(([key, control]) => {
    const value = values[key];
    if (control.type === 'boolean') {
      // Shorthand for true, explicit ={false} for false — matches how
      // people actually write JSX by hand.
      return value ? key : `${key}={false}`;
    }
    return `${key}=${formatPropValue(control.type, value)}`;
  });

  if (propStrings.length === 0) return `<${componentName} />`;

  // One prop per line once it gets long enough that a single line would
  // be hard to scan — matches typical Prettier output, which is what
  // anyone copying this snippet expects to see.
  const oneLine = `<${componentName} ${propStrings.join(' ')} />`;
  if (oneLine.length <= 60) return oneLine;

  const multiLine = propStrings.map((p) => `  ${p}`).join('\n');
  return `<${componentName}\n${multiLine}\n/>`;
}

// ─── Individual control renderers ───────────────────────────────────────────

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <label className="text-muted-foreground text-sm">{label}</label>
      <div className="flex max-w-[60%] items-center justify-end gap-2">{children}</div>
    </div>
  );
}

function BooleanControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <ControlRow label={label}>
      <Switch checked={value} onCheckedChange={onChange} />
    </ControlRow>
  );
}

function StringControl({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <ControlRow label={label}>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-40"
      />
    </ControlRow>
  );
}

function NumberControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  // A slider only makes sense with a bounded range — fall back to a
  // plain number input when min/max weren't provided.
  if (min != null && max != null) {
    return (
      <ControlRow label={label}>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step ?? 1}
          onValueChange={([v]) => onChange(v)}
          className="w-32"
        />
        <span className="text-muted-foreground w-8 text-right text-xs">{value}</span>
      </ControlRow>
    );
  }

  return (
    <ControlRow label={label}>
      <Input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-24"
      />
    </ControlRow>
  );
}

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <ControlRow label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ControlRow>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ControlRow label={label}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border bg-transparent p-0"
        aria-label={`${label} color`}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-24 font-mono text-xs"
      />
    </ControlRow>
  );
}

// ─── Copy button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail in insecure contexts / older browsers —
      // fail silently rather than throwing in a docs page.
    }
  };

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={handleCopy}
      aria-label="Copy code"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="size-3.5" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            <Copy className="size-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * Renders a component next to live-editable controls for its props —
 * a Storybook-style "controls panel," but a plain React component you
 * can drop straight into an MDX doc.
 *
 * Each prop's editor is driven by a small schema (`controls`), and the
 * generated JSX snippet underneath always reflects the current values,
 * so readers can copy exactly what they're looking at.
 */
export function ComponentPlayground({
  component: Component,
  componentName,
  controls,
  staticProps,
  previewClassName,
  className,
}: ComponentPlaygroundProps) {
  const defaults = React.useMemo(() => getDefaults(controls), [controls]);
  const [values, setValues] = React.useState<ControlValues>(defaults);

  // If the controls schema itself changes (e.g. switching demo variants
  // in the same MDX page), reset to that schema's defaults rather than
  // carrying over stale values that may not even apply to it.
  React.useEffect(() => {
    setValues(defaults);
  }, [defaults]);

  const setValue = (key: string, value: boolean | string | number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const code = React.useMemo(
    () => generateCode(componentName, controls, values),
    [componentName, controls, values]
  );

  const isDirty = Object.entries(values).some(([key, value]) => value !== defaults[key]);

  return (
    <div className={cn('overflow-hidden rounded-xl border', className)}>
      <div className="grid md:grid-cols-[1fr_240px]">
        <div
          className={cn(
            'flex min-h-48 items-center justify-center bg-[image:repeating-linear-gradient(45deg,var(--muted)_0,var(--muted)_1px,transparent_0,transparent_50%)] bg-[size:16px_16px] p-8',
            previewClassName
          )}
        >
          <Component {...staticProps} {...values} />
        </div>

        <div className="bg-muted/30 border-t p-4 md:border-t-0 md:border-l">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Props</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={!isDirty}
              onClick={() => setValues(defaults)}
              aria-label="Reset to defaults"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
          <div className="divide-y">
            {Object.entries(controls).map(([key, control]) => {
              const label = control.label ?? key;
              const value = values[key];

              switch (control.type) {
                case 'boolean':
                  return (
                    <BooleanControl
                      key={key}
                      label={label}
                      value={value as boolean}
                      onChange={(v) => setValue(key, v)}
                    />
                  );
                case 'string':
                  return (
                    <StringControl
                      key={key}
                      label={label}
                      value={value as string}
                      placeholder={control.placeholder}
                      onChange={(v) => setValue(key, v)}
                    />
                  );
                case 'number':
                  return (
                    <NumberControl
                      key={key}
                      label={label}
                      value={value as number}
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      onChange={(v) => setValue(key, v)}
                    />
                  );
                case 'select':
                  return (
                    <SelectControl
                      key={key}
                      label={label}
                      value={value as string}
                      options={control.options}
                      onChange={(v) => setValue(key, v)}
                    />
                  );
                case 'color':
                  return (
                    <ColorControl
                      key={key}
                      label={label}
                      value={value as string}
                      onChange={(v) => setValue(key, v)}
                    />
                  );
              }
            })}
          </div>
        </div>
      </div>

      <div className="bg-muted/50 flex items-center justify-between border-t px-4 py-2">
        <code className="text-muted-foreground overflow-x-auto font-mono text-xs whitespace-pre">
          {code}
        </code>
        <CopyButton text={code} />
      </div>
    </div>
  );
}
