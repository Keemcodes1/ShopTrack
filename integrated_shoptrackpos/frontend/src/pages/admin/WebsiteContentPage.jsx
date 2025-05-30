
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component exists or will be created
import { Icons } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';

// Create Textarea if it doesn't exist
const TextareaComponent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={React.useMemo(() => `flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`, [className])}
      ref={ref}
      {...props}
    />
  );
});
TextareaComponent.displayName = 'Textarea';


const WebsiteContentPage = () => {
  const { toast } = useToast();
  const [content, setContent] = React.useState({
    homeTitle: 'Welcome to ShopTrackPOS',
    homeSubtitle: 'The ultimate solution for your point-of-sale needs.',
    aboutUs: 'ShopTrackPOS is dedicated to providing seamless and efficient POS systems for businesses of all sizes. Our mission is to empower your growth with cutting-edge technology and unparalleled support.',
    contactEmail: 'support@shoppos.com',
    footerText: `© ${new Date().getFullYear()} ShopTrackPOS. All Rights Reserved.`
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving website content:", content);
    toast({ title: "Content Saved", description: "Website content has been updated successfully." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Content Management</h1>
        <p className="text-muted-foreground">Update text and media for your public website.</p>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Homepage Content</CardTitle>
          <CardDescription>Manage the main content sections of your homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="homeTitle">Main Title</Label>
            <Input id="homeTitle" name="homeTitle" value={content.homeTitle} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="homeSubtitle">Subtitle</Label>
            <Input id="homeSubtitle" name="homeSubtitle" value={content.homeSubtitle} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>About Us Page</CardTitle>
          <CardDescription>Edit the content for your "About Us" page.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="aboutUs">About Us Text</Label>
            <TextareaComponent id="aboutUs" name="aboutUs" value={content.aboutUs} onChange={handleInputChange} rows={6} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Contact & Footer</CardTitle>
          <CardDescription>Manage contact information and footer text.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" value={content.contactEmail} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="footerText">Footer Text</Label>
            <Input id="footerText" name="footerText" value={content.footerText} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Icons.settings className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default WebsiteContentPage;
