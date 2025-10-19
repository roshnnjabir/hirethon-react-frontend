import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const ClicksChart = ({ data = [], title = "Click Trends", showArea = false }) => {
  // Format data for the chart
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    clicks: item.clicks || 0,
    unique: item.unique_clicks || 0,
  }));

  // Calculate trend
  const totalClicks = chartData.reduce((sum, item) => sum + item.clicks, 0);
  const avgClicks = chartData.length > 0 ? Math.round(totalClicks / chartData.length) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900 mb-1">{payload[0].payload.date}</p>
          <p className="text-sm text-[#FFC107]">
            Total Clicks: <span className="font-semibold">{payload[0].value}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-blue-600">
              Unique Visitors: <span className="font-semibold">{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
        <div className="text-center py-12 text-neutral-500">
          No data available for the selected period
        </div>
      </div>
    );
  }

  const Chart = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Average: <span className="font-medium text-[#FFC107]">{avgClicks} clicks/day</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">Trending</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <Chart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="date"
            stroke="#737373"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {showArea ? (
            <>
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#FFC107"
                strokeWidth={2}
                fill="url(#colorClicks)"
                name="Total Clicks"
              />
              <Area
                type="monotone"
                dataKey="unique"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorUnique)"
                name="Unique Visitors"
              />
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#FFC107"
                strokeWidth={3}
                dot={{ fill: '#FFC107', r: 4 }}
                activeDot={{ r: 6 }}
                name="Total Clicks"
              />
              <Line
                type="monotone"
                dataKey="unique"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Unique Visitors"
              />
            </>
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClicksChart;

