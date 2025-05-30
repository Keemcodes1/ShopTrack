
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider'; // Assuming Slider component exists

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState({
    notificationsEmail: true,
    notificationsPush: false,
    darkMode: false,
    dataRetentionDays: 90,
    apiToken: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxx', // Example, should be masked or handled securely
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSliderChange = (value) => {
    setSettings(prev => ({ ...prev, dataRetentionDays: value[0] }));
  };

  const handleSave = (section) => {
    console.log(`Saving ${section} settings:`, settings);
    toast({ title: `${section} Settings Saved`, description: `Your ${section.toLowerCase()} preferences have been updated.` });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure various aspects of the ShopTrackPOS system.</p>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive system notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="notificationsEmail" name="notificationsEmail" checked={settings.notificationsEmail} onCheckedChange={(checked) => setSettings(p => ({...p, notificationsEmail: checked}))} />
            <Label htmlFor="notificationsEmail">Receive email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="notificationsPush" name="notificationsPush" checked={settings.notificationsPush} onCheckedChange={(checked) => setSettings(p => ({...p, notificationsPush: checked}))} />
            <Label htmlFor="notificationsPush">Enable push notifications (if app available)</Label>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => handleSave('Notification')}>Save Notification Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="darkMode" name="darkMode" checked={settings.darkMode} onCheckedChange={(checked) => {
              setSettings(p => ({...p, darkMode: checked}));
              // Basic dark mode toggle - in a real app, this would update a theme context/class on body
              document.documentElement.classList.toggle('dark', checked);
            }} />
            <Label htmlFor="darkMode">Enable Dark Mode</Label>
          </div>
           <div className="flex justify-end">
            <Button onClick={() => handleSave('Appearance')}>Save Appearance Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage data retention and API access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="dataRetentionDays">Data Retention Period (Days): {settings.dataRetentionDays}</Label>
            <Slider
              id="dataRetentionDays"
              name="dataRetentionDays"
              defaultValue={[settings.dataRetentionDays]}
              max={365}
              step={10}
              onValueChange={handleSliderChange}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="apiToken">API Token</Label>
            <div className="flex items-center space-x-2">
              <Input id="apiToken" name="apiToken" type="password" value={settings.apiToken} readOnly className="flex-1" />
              <Button variant="outline" onClick={() => toast({ title: "API Token", description: "Functionality to regenerate token coming soon."})}>Regenerate</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Use this token for API integrations. Keep it secure.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => handleSave('Data & Privacy')}>Save Data Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
