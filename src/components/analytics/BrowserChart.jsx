import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Chrome, Firefox, Safari } from 'lucide-react';

const BROWSER_COLORS = {
  chrome: '#FFC107',
  firefox: '#FF7043',
  safari: '#3B82F6',
  edge: '#00A4EF',
  opera: '#FF1B2D',
  other: '#6B7280'
};

const BrowserChart = ({ data = [], title = "Browser Distribution" }) => {
  // Transform and sort data
  const chartData = data
    .map(item => ({
      name: item.browser || item.name || 'Other',
      value: item.count || item.value || 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 browsers

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900 capitalize">{payload[0].payload.name}</p>
          <p className="text-sm text-neutral-600 mt-1">
            <span className="font-semibold">{payload[0].value}</span> users ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0 || total === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
        <div className="text-center py-12 text-neutral-500">
          No browser data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-600">
          Total Users: <span className="font-medium text-neutral-900">{total}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            tick={({ x, y, payload }) => (
              <text x={x} y={y + 10} textAnchor="middle" fill="#737373" fontSize={12} className="capitalize">
                {payload.value}
              </text>
            )}
          />
          <YAxis
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BROWSER_COLORS[entry.name.toLowerCase()] || BROWSER_COLORS.other}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Browser Stats List */}
      <div className="mt-6 space-y-2">
        {chartData.map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          const color = BROWSER_COLORS[item.name.toLowerCase()] || BROWSER_COLORS.other;
          
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-900 capitalize">{item.name}</span>
                  <span className="text-sm text-neutral-600">{item.value} ({percentage}%)</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrowserChart;

