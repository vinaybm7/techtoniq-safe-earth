import React from 'react';
import { motion } from 'framer-motion';

export default function TrustMetrics() {
  const metrics = [
    { value: '85%', label: 'Prediction Accuracy' },
    { value: '15+', label: 'Countries Covered' },
    { value: '24/7', label: 'Real-time Monitoring' },
  ];

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div 
            key={metric.label}
            className="p-3 text-center"
            whileHover={{ 
              scale: 1.05,
              color: '#1e40af'
            }}
          >
            <motion.div 
              className="text-2xl font-bold text-techtoniq-blue"
              whileHover={{ scale: 1.1 }}
            >
              {metric.value}
            </motion.div>
            <div className="text-sm text-gray-600">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
