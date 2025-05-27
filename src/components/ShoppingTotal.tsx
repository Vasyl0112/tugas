import React from 'react';

interface ShoppingTotalProps {
  total: number;
}

export const ShoppingTotal: React.FC<ShoppingTotalProps> = ({ total }) => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Total</h2>
      <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse-slow shadow-glow">
        Rp {total.toLocaleString('id-ID')}
      </div>
    </div>
  );
};