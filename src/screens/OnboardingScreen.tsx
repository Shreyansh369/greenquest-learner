import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Leaf, TreePine, Droplets, Zap } from 'lucide-react';

const OnboardingScreen = () => {
  const { accounts, switchAccount, enableTeacherMode } = useStore();
  const [teacherPin, setTeacherPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handleAccountSelect = (accountId: string) => {
    switchAccount(accountId);
  };

  const handleTeacherLogin = () => {
    const success = enableTeacherMode(teacherPin);
    if (!success) {
      alert('Invalid teacher PIN. Try 1234 for demo.');
    }
    setTeacherPin('');
    setShowPinInput(false);
  };

  const studentAccounts = accounts.filter(acc => acc.type === 'student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to GreenQuest</h1>
          <p className="text-muted-foreground">
            Start your eco-learning adventure! Complete quests, earn tokens, and become an environmental champion.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="nature-card p-4 text-center">
            <TreePine className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-sm font-medium">Learn Sustainably</p>
          </div>
          <div className="nature-card p-4 text-center">
            <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Complete Quests</p>
          </div>
        </div>

        {/* Account Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Account</CardTitle>
            <CardDescription>
              Select a demo account to start exploring GreenQuest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentAccounts.map((account) => (
              <Button
                key={account.id}
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-accent/50"
                onClick={() => handleAccountSelect(account.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    {account.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{account.displayName}</div>
                    <div className="text-sm text-muted-foreground">Grade {account.grade}</div>
                  </div>
                </div>
              </Button>
            ))}
            
            <Separator className="my-4" />
            
            {/* Teacher Login */}
            {!showPinInput ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowPinInput(true)}
              >
                Teacher Login
              </Button>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="teacher-pin">Teacher PIN</Label>
                  <Input
                    id="teacher-pin"
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={teacherPin}
                    onChange={(e) => setTeacherPin(e.target.value)}
                    maxLength={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Demo PIN: 1234
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPinInput(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleTeacherLogin}
                    className="flex-1"
                    disabled={teacherPin.length !== 4}
                  >
                    Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Demo Features</h3>
              <Badge variant="secondary" className="text-xs">
                Offline Ready
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                4 Skill Lanes
              </div>
              <div className="flex items-center gap-1">
                <TreePine className="w-3 h-3" />
                12 Lessons
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                Quest System
              </div>
              <div className="flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                Token Economy
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingScreen;