import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, MapPin } from 'lucide-react';

const GeographyChart = ({ data = [], title = "Geographic Distribution" }) => {
  // Transform and sort data - take top 10 countries
  const chartData = data
    .map(item => ({
      name: item.country || item.name || 'Unknown',
      value: item.count || item.value || 0,
    }))
    .filter(item => item.name && item.name !== 'Unknown')
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900">{payload[0].payload.name}</p>
          <p className="text-sm text-neutral-600 mt-1">
            <span className="font-semibold">{payload[0].value}</span> visits ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {title}
        </h3>
        <div className="text-center py-12 text-neutral-500">
          No geographic data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {title}
        </h3>
        <p className="text-sm text-neutral-600">
          Total: <span className="font-medium text-neutral-900">{total} visits</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
          <XAxis type="number" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 193, 7, 0.1)' }} />
          <Bar dataKey="value" fill="#FFC107" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Top Countries List */}
      <div className="mt-6 space-y-3">
        {chartData.slice(0, 5).map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-[#FFC107] bg-opacity-10 rounded-full">
                  <MapPin className="w-4 h-4 text-[#FFC107]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                  <p className="text-xs text-neutral-600">{percentage}% of total</p>
                </div>
              </div>
              <span className="text-lg font-bold text-neutral-900">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeographyChart;

