
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/lib/icons';

const BusinessesPage = () => {
  // Placeholder data and functions
  const businesses = [
    { id: 'B001', name: 'Tech Solutions Inc.', industry: 'Technology', status: 'Active' },
    { id: 'B002', name: 'Coffee Corner', industry: 'Food & Beverage', status: 'Active' },
    { id: 'B003', name: 'Green Gardens Co.', industry: 'Agriculture', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
          <p className="text-muted-foreground">Manage registered businesses.</p>
        </div>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> Add New Business
        </Button>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Business List</CardTitle>
          <CardDescription>Overview of all businesses.</CardDescription>
          <Input
            type="search"
            placeholder="Search businesses..."
            className="max-w-sm mt-2"
          />
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {businesses.map(business => (
              <li key={business.id} className="p-4 border rounded-md flex justify-between items-center hover:bg-muted/50 transition-colors">
                <div>
                  <h3 className="font-semibold">{business.name} <span className={`text-xs px-2 py-0.5 rounded-full ${business.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{business.status}</span></h3>
                  <p className="text-sm text-muted-foreground">{business.industry}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm"><Icons.edit className="mr-1 h-3 w-3" /> Edit</Button>
                  <Button variant="destructive" size="sm"><Icons.delete className="mr-1 h-3 w-3" /> Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessesPage;
