
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icons } from '@/lib/icons';

const mockTransactions = [
  { id: 'T001', date: '2024-05-28', client: 'Alice Wonderland', amount: '$150.00', status: 'Completed', business: 'Wonderland Inc.' },
  { id: 'T002', date: '2024-05-27', client: 'Bob The Builder', amount: '$75.50', status: 'Pending', business: 'BuildIt LLC' },
  { id: 'T003', date: '2024-05-26', client: 'Charlie Brown', amount: '$25.00', status: 'Failed', business: 'Peanuts Corp' },
  { id: 'T004', date: '2024-05-25', client: 'Diana Prince', amount: '$500.00', status: 'Completed', business: 'Themyscira Exports' },
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = React.useState(mockTransactions);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">View and manage all transactions.</p>
        </div>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A total of {filteredTransactions.length} transactions found.</CardDescription>
          <Input
            type="search"
            placeholder="Search by Client, Business, or ID..."
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
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.client}</TableCell>
                  <TableCell>{transaction.business}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Icons.chevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit Transaction">
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTransactions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No transactions found matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
