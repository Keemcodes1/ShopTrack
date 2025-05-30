
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/lib/icons';
import { BarChart, LineChart, PieChart } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, description, color = "text-primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && <p className={`text-xs ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>}
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const ChartPlaceholder = ({ title, icon: Icon, type }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="col-span-1 md:col-span-2"
  >
    <Card className="h-full shadow-lg glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>Placeholder for {type} data visualization.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[200px] md:h-[300px]">
        <div className="text-center text-muted-foreground">
          <Icon className="mx-auto h-16 w-16 opacity-30" />
          <p className="mt-2">Chart Data Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with ShopTrackPOS.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Icons.reports className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button>
            <Icons.add className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$45,231.89" icon={Icons.transactions} trend="+20.1% from last month" description="Current fiscal period" color="text-green-500" />
        <StatCard title="New Clients" value="+2,350" icon={Icons.clients} trend="+180.1% from last month" description="Joined this month" color="text-blue-500" />
        <StatCard title="Active Businesses" value="573" icon={Icons.businesses} trend="+19% from last month" description="Currently using POS" color="text-purple-500" />
        <StatCard title="Open Tickets" value="12" icon={Icons.supportTickets} trend="-2 since yesterday" description="Awaiting response" color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ChartPlaceholder title="Sales Trends" icon={LineChart} type="line chart" />
        <ChartPlaceholder title="Revenue by Category" icon={BarChart} type="bar chart" />
        <ChartPlaceholder title="Client Acquisition" icon={PieChart} type="pie chart" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-lg glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A quick look at the latest actions in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { user: "Alice", action: "processed a new transaction", time: "2m ago", icon: Icons.transactions },
                { user: "Bob", action: "onboarded a new client: 'Tech Solutions Inc.'", time: "15m ago", icon: Icons.onboarding },
                { user: "Carol", action: "resolved a support ticket #12345", time: "1h ago", icon: Icons.supportTickets },
                { user: "David", action: "updated business profile for 'Coffee Corner'", time: "3h ago", icon: Icons.businesses },
              ].map((activity, index) => (
                <li key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-primary/5 transition-colors">
                  <activity.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.user} <span className="text-muted-foreground">{activity.action}</span></p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
