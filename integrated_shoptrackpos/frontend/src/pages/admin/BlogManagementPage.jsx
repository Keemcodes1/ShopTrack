
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';

const mockPosts = [
  { id: 'P001', title: '5 Tips for Choosing the Right POS System', date: '2024-05-15', status: 'Published', author: 'Jane Doe' },
  { id: 'P002', title: 'Understanding PCI Compliance for Small Businesses', date: '2024-05-01', status: 'Published', author: 'John Smith' },
  { id: 'P003', title: 'The Future of Contactless Payments (Draft)', date: '2024-06-01', status: 'Draft', author: 'Admin User' },
];

const BlogManagementPage = () => {
  const [posts, setPosts] = React.useState(mockPosts);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast({ title: "Post Deleted", description: `Blog post ID ${postId} has been removed.`, variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage blog posts.</p>
        </div>
        <Button onClick={() => toast({ title: "New Post", description: "Functionality to create new post coming soon!" })}>
          <Icons.add className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>A total of {filteredPosts.length} posts found.</CardDescription>
          <Input
            type="search"
            placeholder="Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm mt-2"
          />
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {filteredPosts.map((post) => (
              <li key={post.id} className="p-4 border rounded-md flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-muted/50 transition-colors">
                <div className="mb-2 md:mb-0">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Author: {post.author} | Date: {post.date} | 
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status}
                    </span>
                  </p>
                </div>
                <div className="space-x-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Edit Post", description: `Editing post "${post.title}" - coming soon!` })}>
                    <Icons.edit className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                    <Icons.delete className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {filteredPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No posts found matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagementPage;
