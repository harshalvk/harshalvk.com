'use client';

import { useState, useEffect } from 'react';
import { KeyScreen } from '../components/key-screen';

const KeyDisplayDemo = () => {
  const [hasPressed, setHasPressed] = useState(false);

  useEffect(() => {
    const handler = () => setHasPressed(true);
    window.addEventListener('keydown', handler, { once: true });
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-muted-foreground font-mono text-sm tracking-widest capitalize">
        {hasPressed ? 'keep going' : 'press any key'}
      </p>
      <KeyScreen historySize={2} />
    </div>
  );
};

export default KeyDisplayDemo;
