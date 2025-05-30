
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: 'Admin User',
    email: 'admin@shoppos.com',
    phone: '123-456-7890',
    company: 'ShopTrackPOS Inc.',
    role: 'Administrator',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Simulate API call
    console.log("Saving profile data:", profileData);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "default"}>
          {isEditing ? <><Icons.close className="mr-2 h-4 w-4" /> Cancel</> : <><Icons.edit className="mr-2 h-4 w-4" /> Edit Profile</>}
        </Button>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
              <AvatarFallback>{profileData.name.substring(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profileData.name}</CardTitle>
              <CardDescription>{profileData.role} at {profileData.company}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={profileData.email} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={profileData.phone} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" value={profileData.company} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="role">Role / Position</Label>
                <Input id="role" name="role" value={profileData.role} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} size="lg">
                <Icons.settings className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="••••••••" disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="••••••••" disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input id="confirmNewPassword" type="password" placeholder="••••••••" disabled={!isEditing} />
          </div>
          {isEditing && (
            <Button variant="outline" onClick={() => toast({ title: "Password Change", description: "Password change functionality not implemented yet."})}>
              Change Password
            </Button>
          )}
          {!isEditing && <p className="text-sm text-muted-foreground">Enable editing to change password.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
