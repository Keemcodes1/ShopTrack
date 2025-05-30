
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/lib/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTickets = [
  { id: 'TKT-001', subject: 'Login Issue', client: 'Alice Wonderland', status: 'Open', priority: 'High', lastUpdate: '2024-05-30 10:00' },
  { id: 'TKT-002', subject: 'Payment Gateway Error', client: 'Bob The Builder', status: 'In Progress', priority: 'Medium', lastUpdate: '2024-05-29 14:30' },
  { id: 'TKT-003', subject: 'Feature Request: Dark Mode', client: 'Charlie Brown', status: 'Closed', priority: 'Low', lastUpdate: '2024-05-28 09:15' },
  { id: 'TKT-004', subject: 'Unable to generate report', client: 'Diana Prince', status: 'Open', priority: 'High', lastUpdate: '2024-05-30 11:20' },
];

const TicketItem = ({ ticket }) => {
  const getStatusColor = (status) => {
    if (status === 'Open') return 'text-red-500 border-red-500';
    if (status === 'In Progress') return 'text-yellow-500 border-yellow-500';
    if (status === 'Closed') return 'text-green-500 border-green-500';
    return 'text-gray-500 border-gray-500';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-100 text-red-700';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-700';
    if (priority === 'Low') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{ticket.subject}</h3>
            <p className="text-sm text-muted-foreground">Client: {ticket.client} (ID: {ticket.id})</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
            Priority: {ticket.priority}
          </span>
          <p className="text-xs text-muted-foreground">Last Update: {ticket.lastUpdate}</p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm">View Details</Button>
          <Button size="sm">Respond</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SupportTicketsPage = () => {
  const [tickets, setTickets] = React.useState(mockTickets);
  const [searchTerm, setSearchTerm] = React.useState('');

  const openTickets = tickets.filter(t => t.status === 'Open' && (t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.client.toLowerCase().includes(searchTerm.toLowerCase())));
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress' && (t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.client.toLowerCase().includes(searchTerm.toLowerCase())));
  const closedTickets = tickets.filter(t => t.status === 'Closed' && (t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.client.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and respond to client support requests.</p>
        </div>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> Create New Ticket
        </Button>
      </div>

      <Input
        type="search"
        placeholder="Search tickets by subject or client..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-full md:max-w-md"
      />

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress ({inProgressTickets.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedTickets.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-4">
          {openTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {openTickets.map(ticket => <TicketItem key={ticket.id} ticket={ticket} />)}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No open tickets found.</p>}
        </TabsContent>
        <TabsContent value="inProgress" className="mt-4">
          {inProgressTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgressTickets.map(ticket => <TicketItem key={ticket.id} ticket={ticket} />)}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No tickets in progress.</p>}
        </TabsContent>
        <TabsContent value="closed" className="mt-4">
          {closedTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {closedTickets.map(ticket => <TicketItem key={ticket.id} ticket={ticket} />)}
            </div>
          ) : <p className="text-muted-foreground text-center py-8">No closed tickets found.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportTicketsPage;
