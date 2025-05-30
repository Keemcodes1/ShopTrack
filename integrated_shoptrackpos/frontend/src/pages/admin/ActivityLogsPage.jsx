
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icons } from '@/lib/icons';

const mockLogs = [
  { id: 'L001', timestamp: '2024-05-30 10:15:23', user: 'admin@shoppos.com', action: 'Logged in', details: 'IP: 192.168.1.100' },
  { id: 'L002', timestamp: '2024-05-30 10:18:05', user: 'client_manager@example.com', action: 'Updated client C001', details: 'Changed phone number' },
  { id: 'L003', timestamp: '2024-05-30 10:22:40', user: 'system', action: 'Generated daily report', details: 'Report ID: RPT-20240530' },
  { id: 'L004', timestamp: '2024-05-30 10:30:11', user: 'support_agent@example.com', action: 'Closed ticket TKT-008', details: 'Issue resolved' },
];

const ActivityLogsPage = () => {
  const [logs, setLogs] = React.useState(mockLogs);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredLogs = logs.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconForAction = (action) => {
    if (action.toLowerCase().includes('login')) return <Icons.login className="h-4 w-4 text-blue-500" />;
    if (action.toLowerCase().includes('updated')) return <Icons.edit className="h-4 w-4 text-yellow-500" />;
    if (action.toLowerCase().includes('generated')) return <Icons.reports className="h-4 w-4 text-green-500" />;
    if (action.toLowerCase().includes('closed')) return <Icons.supportTickets className="h-4 w-4 text-purple-500" />;
    return <Icons.activity className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground">Monitor system and user activities.</p>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Detailed log of all actions performed within the system.</CardDescription>
          <Input
            type="search"
            placeholder="Search logs by user, action, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mt-2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="flex items-center">
                    {getIconForAction(log.action)}
                    <span className="ml-2">{log.action}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredLogs.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No logs found matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogsPage;
