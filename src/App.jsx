import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { OrgProvider } from './contexts/OrgContext'
import AppRouter from './routes/AppRouter'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/common/ErrorBoundary'

// Create a client with optimistic updates and performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Performance optimization: only notify on specific props
      notifyOnChangeProps: ['data', 'error', 'isLoading'],
    },
    mutations: {
      retry: false,
    },
  },
})

function App() {
  // Performance monitoring in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Dynamically import performance utilities to avoid production bundle
      import('./utils/performance').then(({ measureWebVitals, reportMetrics }) => {
        measureWebVitals(reportMetrics);
        
        // Log performance metrics after page load
        setTimeout(() => {
          console.log('📊 Performance Metrics:');
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          console.table({
            'DOM Content Loaded': `${(navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart).toFixed(2)}ms`,
            'Load Complete': `${(navigation?.loadEventEnd - navigation?.loadEventStart).toFixed(2)}ms`,
            'First Paint': `${paint.find(p => p.name === 'first-paint')?.startTime.toFixed(2)}ms`,
            'First Contentful Paint': `${paint.find(p => p.name === 'first-contentful-paint')?.startTime.toFixed(2)}ms`,
            'Resources Loaded': performance.getEntriesByType('resource').length,
          });
        }, 3000);
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <OrgProvider>
              <div className="min-h-screen bg-neutral-50">
                <AppRouter />
                <Toaster
                  position="top-right"
                  gutter={8}
                  containerStyle={{
                    top: 20,
                    right: 20,
                  }}
                  toastOptions={{
                    duration: 4000,
                    className: 'page-transition',
                    style: {
                      background: '#fff',
                      color: '#171717',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      border: '1px solid #E5E5E5',
                      fontSize: '14px',
                      fontWeight: '500',
                    },
                    success: {
                      duration: 3000,
                      style: {
                        border: '1px solid #10B981',
                        backgroundColor: '#D1FAE5',
                        color: '#065F46',
                      },
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      style: {
                        border: '1px solid #EF4444',
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                      },
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                      },
                    },
                    loading: {
                      style: {
                        border: '1px solid #3B82F6',
                        backgroundColor: '#DBEAFE',
                        color: '#1E40AF',
                      },
                      iconTheme: {
                        primary: '#3B82F6',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </OrgProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
