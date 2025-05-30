import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Icons } from '../../lib/icons';
import { BarChart, LineChart, PieChart, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Create Select if it doesn't exist
const SelectComponent = React.forwardRef(({ children, ...props }, ref) => (
  <SelectPrimitive.Root {...props}>
    {children}
  </SelectPrimitive.Root>
));
SelectComponent.displayName = "Select";

const SelectTriggerComponent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={React.useMemo(() => `flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`, [className])}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icons.chevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTriggerComponent.displayName = SelectPrimitive.Trigger.displayName;

const SelectValueComponent = SelectPrimitive.Value;

const SelectContentComponent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={React.useMemo(() => `relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"} ${className || ''}`, [className, position])}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={React.useMemo(() => `p-1 ${position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"}`, [position])}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContentComponent.displayName = SelectPrimitive.Content.displayName;

const SelectItemComponent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={React.useMemo(() => `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ''}`, [className])}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Icons.check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    {children}
  </SelectPrimitive.Item>
));
SelectItemComponent.displayName = SelectPrimitive.Item.displayName;

// Mock SelectPrimitive for standalone usage
const SelectPrimitive = {
  Root: ({ children }) => <div>{children}</div>,
  Trigger: React.forwardRef(({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>),
  Value: ({ children }) => <span>{children || "Select..."}</span>,
  Icon: ({ children }) => <span>{children}</span>,
  Portal: ({ children }) => <div>{children}</div>,
  Content: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  Viewport: ({ children }) => <div>{children}</div>,
  Item: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  ItemIndicator: ({ children }) => <span>{children}</span>,
};


const ChartCard = ({ title, description, icon: Icon, chartType }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glass-card">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="h-[250px] flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Icon className="mx-auto h-16 w-16 opacity-20" />
        <p className="mt-2">{chartType} visualization placeholder.</p>
        <p className="text-xs">Data will be displayed here.</p>
      </div>
    </CardContent>
  </Card>
);

const ReportsAnalyticsPage = () => {
  const [reportType, setReportType] = React.useState('sales_overview');
  const [dateRange, setDateRange] = React.useState('last_30_days');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Gain insights into your business performance.</p>
        </div>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> Generate Custom Report
        </Button>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select criteria to generate specific reports.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-muted-foreground mb-1">Report Type</label>
            <SelectComponent value={reportType} onValueChange={setReportType}>
              <SelectTriggerComponent id="reportType">
                <SelectValueComponent placeholder="Select report type" />
              </SelectTriggerComponent>
              <SelectContentComponent>
                <SelectItemComponent value="sales_overview">Sales Overview</SelectItemComponent>
                <SelectItemComponent value="client_activity">Client Activity</SelectItemComponent>
                <SelectItemComponent value="product_performance">Product Performance</SelectItemComponent>
                <SelectItemComponent value="transaction_summary">Transaction Summary</SelectItemComponent>
              </SelectContentComponent>
            </SelectComponent>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-muted-foreground mb-1">Date Range</label>
            <SelectComponent value={dateRange} onValueChange={setDateRange}>
              <SelectTriggerComponent id="dateRange">
                <SelectValueComponent placeholder="Select date range" />
              </SelectTriggerComponent>
              <SelectContentComponent>
                <SelectItemComponent value="last_7_days">Last 7 Days</SelectItemComponent>
                <SelectItemComponent value="last_30_days">Last 30 Days</SelectItemComponent>
                <SelectItemComponent value="last_90_days">Last 90 Days</SelectItemComponent>
                <SelectItemComponent value="custom">Custom Range (Not Implemented)</SelectItemComponent>
              </SelectContentComponent>
            </SelectComponent>
          </div>
          <div className="md:col-span-2 lg:col-span-1 flex items-end">
            <Button className="w-full lg:w-auto">
              <Icons.reports className="mr-2 h-4 w-4" /> View Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Total Sales Trend" description="Monthly sales performance over the selected period." icon={LineChart} chartType="Line Chart" />
        <ChartCard title="Revenue by Source" description="Breakdown of revenue from different client segments or products." icon={BarChart} chartType="Bar Chart" />
        <ChartCard title="Client Acquisition Rate" description="New clients acquired over time." icon={PieChart} chartType="Pie Chart" />
        <ChartCard title="Top Performing Products" description="Products generating the most revenue." icon={BarChart} chartType="Bar Chart" />
      </div>
    </div>
  );
};

export default ReportsAnalyticsPage;
