import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Callout({
  title,
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode;
}) {
  return (
    <Alert
      className={cn(
        'not-prose bg-surface text-surface-foreground inset-ring-border/64 rounded-xl border-none inset-ring-1',
        className
      )}
      {...props}
    >
      {icon}
      {title && <AlertTitle className="[&_a]:link-underline">{title}</AlertTitle>}
      <AlertDescription className="text-surface-foreground/80 [&_a]:link-underline">
        {children}
      </AlertDescription>
    </Alert>
  );
}
