import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, Globe, Smartphone, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';
import { useOrganization } from '../../hooks/useOrganization';

// Chart Components
import ClicksChart from '../../components/analytics/ClicksChart';
import DeviceChart from '../../components/analytics/DeviceChart';
import BrowserChart from '../../components/analytics/BrowserChart';
import GeographyChart from '../../components/analytics/GeographyChart';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import LoadingState from '../../components/common/LoadingState';

const AnalyticsPage = () => {
  const { activeOrg } = useOrganization();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time updates
  useRealTimeUpdates(
    ['analytics', activeOrg?.id, 'urls', activeOrg?.id],
    30000,
    autoRefresh
  );

  // Fetch analytics data (scoped to active organization)
  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['analytics', activeOrg?.id, selectedPeriod],
    queryFn: async () => {
      if (!activeOrg?.id) return null;
      
      // Aggregate from all URLs in active organization
      const response = await api.get('/urls/', {
        params: { organization: activeOrg.id }
      });
      const urls = response.data.results || response.data;

      // Calculate aggregate stats
      const totalClicks = urls.reduce((sum, url) => sum + (url.click_count || 0), 0);
      const totalUrls = urls.length;
      const activeUrls = urls.filter(url => !url.is_expired).length;

      // Mock analytics data structure
      return {
        total_clicks: totalClicks,
        total_urls: totalUrls,
        active_urls: activeUrls,
        unique_visitors: Math.floor(totalClicks * 0.7), // Estimate
        click_history: generateMockClickHistory(30),
        device_types: [
          { device_type: 'desktop', count: Math.floor(totalClicks * 0.5) },
          { device_type: 'mobile', count: Math.floor(totalClicks * 0.35) },
          { device_type: 'tablet', count: Math.floor(totalClicks * 0.15) },
        ],
        browser_stats: [
          { browser: 'Chrome', count: Math.floor(totalClicks * 0.6) },
          { browser: 'Safari', count: Math.floor(totalClicks * 0.2) },
          { browser: 'Firefox', count: Math.floor(totalClicks * 0.1) },
          { browser: 'Edge', count: Math.floor(totalClicks * 0.1) },
        ],
        top_countries: [
          { country: 'United States', count: Math.floor(totalClicks * 0.4) },
          { country: 'United Kingdom', count: Math.floor(totalClicks * 0.15) },
          { country: 'Canada', count: Math.floor(totalClicks * 0.1) },
          { country: 'Germany', count: Math.floor(totalClicks * 0.08) },
          { country: 'France', count: Math.floor(totalClicks * 0.07) },
        ],
      };
    },
    enabled: !!activeOrg?.id,
  });

  const stats = analyticsData || {};

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-600 mt-1">
            Track your link performance and audience insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* Auto-refresh Toggle */}
          <Button
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto
          </Button>

          {/* Manual Refresh */}
          <Button onClick={() => refetch()} variant="secondary" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Clicks"
          value={stats.total_clicks || 0}
          icon={BarChart3}
          trend="+12.5%"
          trendUp={true}
          color="yellow"
        />
        <StatsCard
          title="Unique Visitors"
          value={stats.unique_visitors || 0}
          icon={Users}
          trend="+8.3%"
          trendUp={true}
          color="blue"
        />
        <StatsCard
          title="Active URLs"
          value={stats.active_urls || 0}
          icon={TrendingUp}
          trend={`${stats.total_urls || 0} total`}
          color="green"
        />
        <StatsCard
          title="Countries"
          value={stats.top_countries?.length || 0}
          icon={Globe}
          trend="Global reach"
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Trends */}
        <div className="lg:col-span-2">
          <ClicksChart
            data={stats.click_history || []}
            title="Click Trends"
            showArea={true}
          />
        </div>

        {/* Device Breakdown */}
        <DeviceChart
          data={stats.device_types || []}
          title="Device Breakdown"
        />

        {/* Browser Distribution */}
        <BrowserChart
          data={stats.browser_stats || []}
          title="Browser Distribution"
        />

        {/* Geographic Distribution */}
        <div className="lg:col-span-2">
          <GeographyChart
            data={stats.top_countries || []}
            title="Geographic Distribution"
          />
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock click history
function generateMockClickHistory(days) {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString(),
      clicks: Math.floor(Math.random() * 100) + 20,
      unique_clicks: Math.floor(Math.random() * 70) + 10,
    });
  }
  
  return data;
}

export default AnalyticsPage;

