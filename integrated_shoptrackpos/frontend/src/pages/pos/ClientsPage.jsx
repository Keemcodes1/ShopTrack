
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icons } from '@/lib/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const mockClients = [
  { id: 'C001', name: 'Alice Wonderland', email: 'alice@example.com', phone: '555-0101', company: 'Wonderland Inc.', joined: '2023-01-15' },
  { id: 'C002', name: 'Bob The Builder', email: 'bob@example.com', phone: '555-0102', company: 'BuildIt LLC', joined: '2023-02-20' },
  { id: 'C003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-0103', company: 'Peanuts Corp', joined: '2023-03-10' },
  { id: 'C004', name: 'Diana Prince', email: 'diana@example.com', phone: '555-0104', company: 'Themyscira Exports', joined: '2023-04-05' },
];

const ClientsPage = () => {
  const [clients, setClients] = React.useState(mockClients);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [currentClient, setCurrentClient] = React.useState(null);
  const { toast } = useToast();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClientData = Object.fromEntries(formData.entries());
    
    if (currentClient) { // Editing
      setClients(clients.map(c => c.id === currentClient.id ? { ...c, ...newClientData } : c));
      toast({ title: "Client Updated", description: `${newClientData.name} has been updated.` });
    } else { // Adding
      const newId = `C${String(clients.length + 1).padStart(3, '0')}`;
      setClients([...clients, { ...newClientData, id: newId, joined: new Date().toISOString().split('T')[0] }]);
      toast({ title: "Client Added", description: `${newClientData.name} has been added.` });
    }
    setIsFormOpen(false);
    setCurrentClient(null);
    e.target.reset();
  };

  const handleEdit = (client) => {
    setCurrentClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = (clientId) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast({ title: "Client Deleted", description: `Client ID ${clientId} has been removed.`, variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
          <p className="text-muted-foreground">View, add, edit, or remove clients.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setCurrentClient(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setCurrentClient(null); setIsFormOpen(true); }}>
              <Icons.add className="mr-2 h-4 w-4" /> Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass-card">
            <DialogHeader>
              <DialogTitle>{currentClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
              <DialogDescription>
                {currentClient ? 'Update the details for this client.' : 'Fill in the details for the new client.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={currentClient?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={currentClient?.email} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={currentClient?.phone} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Company</Label>
                <Input id="company" name="company" defaultValue={currentClient?.company} className="col-span-3" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsFormOpen(false); setCurrentClient(null); }}>Cancel</Button>
                <Button type="submit">{currentClient ? 'Save Changes' : 'Add Client'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>A total of {filteredClients.length} clients found.</CardDescription>
          <Input
            type="search"
            placeholder="Search clients by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm mt-2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>{client.joined}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)} className="text-destructive hover:text-destructive">
                      <Icons.delete className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredClients.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No clients found matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsPage;
