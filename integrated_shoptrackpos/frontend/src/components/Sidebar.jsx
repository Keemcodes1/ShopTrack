import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../lib/icons';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Icons.dashboard },
  {
    label: 'POS Management',
    icon: Icons.transactions,
    subItems: [
      { to: '/clients', label: 'Clients', icon: Icons.clients },
      { to: '/businesses', label: 'Businesses', icon: Icons.businesses },
      { to: '/transactions', label: 'Transactions', icon: Icons.transactions },
      { to: '/complaints', label: 'Complaints', icon: Icons.complaints },
      { to: '/onboarding', label: 'Onboarding', icon: Icons.onboarding },
    ],
  },
  {
    label: 'Administration',
    icon: Icons.settings,
    subItems: [
      { to: '/activity-logs', label: 'Activity Logs', icon: Icons.activityLogs },
      { to: '/website-content', label: 'Website Content', icon: Icons.websiteContent },
      { to: '/blog', label: 'Blog Management', icon: Icons.blogManagement },
      { to: '/reports', label: 'Reports & Analytics', icon: Icons.reports },
    ],
  },
  { to: '/support-tickets', label: 'Support Tickets', icon: Icons.supportTickets },
];

const SidebarLink = ({ to, label, icon: Icon, exact = false, isSubItem = false, onClick }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive: navLinkIsActive }) =>
        cn(
          'flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-primary/10 hover:text-primary',
          isSubItem ? 'pl-8' : 'pl-3',
          (isActive || navLinkIsActive) ? 'bg-primary/10 text-primary font-semibold shadow-inner' : 'text-muted-foreground'
        )
      }
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', (isActive) ? 'text-primary' : '')} />
      <span>{label}</span>
    </NavLink>
  );
};

const CollapsibleNavItem = ({ label, icon: Icon, subItems, isOpen, onToggle }) => {
  const location = useLocation();
  const isActiveParent = subItems.some(subItem => location.pathname.startsWith(subItem.to));

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-primary/10 hover:text-primary',
          isActiveParent ? 'text-primary font-semibold' : 'text-muted-foreground'
        )}
      >
        <div className="flex items-center space-x-3">
          <Icon className={cn('h-5 w-5 flex-shrink-0', isActiveParent ? 'text-primary' : '')} />
          <span>{label}</span>
        </div>
        <Icons.chevronDown
          className={cn('h-4 w-4 transform transition-transform duration-200', isOpen ? 'rotate-180' : '')}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="mt-1 flex flex-col space-y-1 py-1">
          {subItems.map((item) => (
            <SidebarLink key={item.to} {...item} isSubItem onClick={onToggle} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openCollapsible, setOpenCollapsible] = React.useState({});

  const toggleCollapsible = (label) => {
    setOpenCollapsible(prev => ({ ...prev, [label]: !prev[label] }));
  };
  
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? '0%' : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-lg lg:relative lg:translate-x-0',
          'lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <NavLink to="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
            <Icons.logo className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">ShopTrackPOS</span>
          </NavLink>
          <button onClick={closeSidebar} className="text-muted-foreground hover:text-foreground lg:hidden">
            <Icons.close className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) =>
            item.subItems ? (
              <CollapsibleNavItem
                key={item.label}
                {...item}
                isOpen={!!openCollapsible[item.label]}
                onToggle={() => toggleCollapsible(item.label)}
              />
            ) : (
              <SidebarLink key={item.to} {...item} onClick={closeSidebar} />
            )
          )}
        </nav>
        <div className="border-t border-border p-4">
          <SidebarLink to="/profile" label="My Profile" icon={Icons.profile} onClick={closeSidebar} />
          <SidebarLink to="/settings" label="Settings" icon={Icons.settings} onClick={closeSidebar} />
          <button 
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.href = '/login';
              closeSidebar();
            }}
            className="mt-2 flex w-full items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Icons.logout className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
