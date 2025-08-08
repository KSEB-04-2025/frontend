import React from 'react';

export default function Placeholder({ text, height = 'h-24' }: { text: string; height?: string }) {
  return (
    <div className={`placeholder ${height} flex items-center justify-center text-gray-500`}>
      {text}
    </div>
  );
}
