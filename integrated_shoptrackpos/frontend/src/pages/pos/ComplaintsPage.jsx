
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/lib/icons';

const ComplaintsPage = () => {
  // Placeholder data
  const complaints = [
    { id: 'CMP001', client: 'Alice Wonderland', subject: 'Faulty Product', status: 'Open', date: '2024-05-20' },
    { id: 'CMP002', client: 'Bob The Builder', subject: 'Late Delivery', status: 'Resolved', date: '2024-05-15' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
          <p className="text-muted-foreground">Track and resolve client complaints.</p>
        </div>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> Log New Complaint
        </Button>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Complaints Log</CardTitle>
          <CardDescription>Current and past client complaints.</CardDescription>
          <Input
            type="search"
            placeholder="Search complaints..."
            className="max-w-sm mt-2"
          />
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {complaints.map(complaint => (
              <li key={complaint.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{complaint.subject} <span className={`text-xs px-2 py-0.5 rounded-full ${complaint.status === 'Open' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{complaint.status}</span></h3>
                    <p className="text-sm text-muted-foreground">Client: {complaint.client} | Submitted: {complaint.date}</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintsPage;
