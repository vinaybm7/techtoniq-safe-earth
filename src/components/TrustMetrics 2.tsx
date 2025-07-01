import React from 'react';

const TrustMetrics = () => {
  // Get current time for next update (8 minutes from now)
  const nextUpdate = new Date();
  nextUpdate.setMinutes(nextUpdate.getMinutes() + 8);
  const nextUpdateTime = nextUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full bg-techtoniq-dark-blue/90 text-white border-t border-white/10">
      {/* Status Bar */}
      <div className="bg-techtoniq-dark-blue/80 py-2 text-center text-sm">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span>All Systems Operational</span>
          </span>
          <span className="hidden sm:inline-block">|</span>
          <span className="flex items-center">
            <span className="mr-1">📡</span>
            <span>247 Active Sensors</span>
          </span>
          <span className="hidden sm:inline-block">|</span>
          <span className="flex items-center">
            <span className="mr-1">⚡</span>
            <span>Next Update: {nextUpdateTime}</span>
          </span>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="metric">
            <span className="block text-3xl font-bold mb-1">85%</span>
            <span className="text-sm opacity-80">Prediction Accuracy</span>
          </div>
          <div className="metric border-l border-r border-white/10 px-8">
            <span className="block text-3xl font-bold mb-1">15+</span>
            <span className="text-sm opacity-80">Countries Covered</span>
          </div>
          <div className="metric">
            <span className="block text-3xl font-bold mb-1">24/7</span>
            <span className="text-sm opacity-80">Real-time Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustMetrics;
