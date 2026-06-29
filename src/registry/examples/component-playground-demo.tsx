import { Button } from '@/components/ui/button';
import { ComponentPlayground } from '@/registry/components/component-playground';

const ComponentPlaygroundDemo = () => {
  return (
    <>
      <ComponentPlayground
        component={Button}
        componentName="Button"
        controls={{
          variant: {
            type: 'select',
            defaultValue: 'default',
            options: ['default', 'outline', 'ghost', 'destructive'],
          },
          size: {
            type: 'select',
            defaultValue: 'default',
            options: ['default', 'sm', 'lg', 'icon'],
          },
          disabled: { type: 'boolean', defaultValue: false },
        }}
        staticProps={{ children: 'Click me' }}
      />
    </>
  );
};

export default ComponentPlaygroundDemo;
