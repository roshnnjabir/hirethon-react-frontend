import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOrganization } from '../../hooks/useOrganization';
import { 
  LayoutDashboard, 
  Building2, 
  FolderOpen, 
  Link as LinkIcon,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { activeOrg, checkPermission } = useOrganization();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
    },
    ...(activeOrg ? [
      {
        name: 'Organization',
        href: `/org/${activeOrg.id}`,
        icon: Building2,
        current: location.pathname.startsWith(`/org/${activeOrg.id}`) && !location.pathname.includes('/namespaces'),
      },
      {
        name: 'Namespaces',
        href: `/org/${activeOrg.id}/namespaces`,
        icon: FolderOpen,
        current: location.pathname.includes('/namespaces'),
        permission: 'view_namespaces',
      },
      {
        name: 'Members',
        href: `/org/${activeOrg.id}/members`,
        icon: Users,
        current: location.pathname.includes('/members'),
        permission: 'manage_members',
      },
      {
        name: 'Analytics',
        href: `/org/${activeOrg.id}/analytics`,
        icon: BarChart3,
        current: location.pathname.includes('/analytics'),
        permission: 'view_analytics',
      },
    ] : []),
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname.startsWith('/settings'),
    },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4 transition-colors duration-200`}
                >
                  <Icon
                    className={`${
                      item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
