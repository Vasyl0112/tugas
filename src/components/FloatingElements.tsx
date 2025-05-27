import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, ShoppingBag, Coffee, Sandwich } from 'lucide-react';

export const FloatingElements: React.FC = () => {
  const elements = [
    { Icon: BarChart2, color: "text-chart-gradient-1", size: 32, delay: 0 },
    { Icon: PieChart, color: "text-chart-gradient-2", size: 28, delay: 1.5 },
    { Icon: ShoppingBag, color: "text-snack-red", size: 24, delay: 2.5 },
    { Icon: Coffee, color: "text-snack-teal", size: 26, delay: 3.5 },
    { Icon: Sandwich, color: "text-snack-yellow", size: 30, delay: 4.5 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((Element, index) => (
        <motion.div
          key={index}
          className={`absolute ${Element.color} opacity-20`}
          style={{
            left: `${(index * 20) + 10}%`,
            top: `${(index * 15) + 5}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: (index % 2 === 0) ? [0, 20, 0] : [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            delay: Element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Element.Icon size={Element.size} />
        </motion.div>
      ))}
    </div>
  );
};