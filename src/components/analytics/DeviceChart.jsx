import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const COLORS = {
  desktop: '#FFC107',
  mobile: '#3B82F6',
  tablet: '#10B981',
  other: '#6B7280'
};

const ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const DeviceChart = ({ data = [], title = "Device Breakdown" }) => {
  // Transform data for chart
  const chartData = data.map(item => ({
    name: item.device_type || item.name || 'Unknown',
    value: item.count || item.value || 0,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900 capitalize">{payload[0].name}</p>
          <p className="text-sm text-neutral-600 mt-1">
            <span className="font-semibold">{payload[0].value}</span> clicks ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry, index) => {
          const Icon = ICONS[entry.value.toLowerCase()] || Monitor;
          const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
          
          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: entry.color }} />
              <span className="text-sm text-neutral-600 capitalize">
                {entry.value}: <span className="font-medium text-neutral-900">{percentage}%</span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (!chartData || chartData.length === 0 || total === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
        <div className="text-center py-12 text-neutral-500">
          No device data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">{title}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name.toLowerCase()] || COLORS.other}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item, index) => {
          const Icon = ICONS[item.name.toLowerCase()] || Monitor;
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          
          return (
            <div key={index} className="text-center p-3 bg-neutral-50 rounded-lg">
              <Icon 
                className="w-6 h-6 mx-auto mb-2" 
                style={{ color: COLORS[item.name.toLowerCase()] || COLORS.other }}
              />
              <p className="text-2xl font-bold text-neutral-900">{item.value}</p>
              <p className="text-xs text-neutral-600 capitalize mt-1">{item.name}</p>
              <p className="text-xs text-[#FFC107] font-medium">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceChart;

