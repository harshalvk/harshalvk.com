import React from 'react';

const DocLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 lg:px-0">
      {children}
    </section>
  );
};

export default DocLayout;
