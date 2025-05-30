
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/lib/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const onboardingSteps = [
  { id: 'step1', label: 'Business Profile Setup', completed: true },
  { id: 'step2', label: 'Bank Account Verification', completed: true },
  { id: 'step3', label: 'POS Device Configuration', completed: false },
  { id: 'step4', label: 'Staff Training Scheduled', completed: false },
  { id: 'step5', label: 'First Transaction Test', completed: false },
];

const OnboardingPage = () => {
  const [steps, setSteps] = React.useState(onboardingSteps);

  const toggleStep = (id) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const completedCount = steps.filter(step => step.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Onboarding</h1>
          <p className="text-muted-foreground">Manage the onboarding process for new clients.</p>
        </div>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" /> Start New Onboarding
        </Button>
      </div>

      <Card className="shadow-lg glass-card">
        <CardHeader>
          <CardTitle>Onboarding Checklist for "New Client Inc."</CardTitle>
          <CardDescription>Track progress for client onboarding.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-primary">Progress</span>
              <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-primary to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <ul className="space-y-3">
            {steps.map(step => (
              <li key={step.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={step.id}
                  checked={step.completed}
                  onCheckedChange={() => toggleStep(step.id)}
                />
                <Label htmlFor={step.id} className={`flex-1 text-sm ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {step.label}
                </Label>
                {step.completed ? (
                  <span className="text-xs text-green-500 font-semibold">Completed</span>
                ) : (
                  <span className="text-xs text-orange-500 font-semibold">Pending</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="mr-2">Save Progress</Button>
            <Button>Mark as Complete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
