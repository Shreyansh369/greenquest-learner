import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Bell, Volume2, RefreshCw, LogOut } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import { useNavigate } from 'react-router-dom';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    settings, 
    updateSettings, 
    accounts,
    switchAccount,
    resetProgress 
  } = useStore();

  const handleAccountSwitch = (accountId: string) => {
    switchAccount(accountId);
    navigate('/home');
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Current Account */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Current Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{currentUser?.avatar}</div>
              <div>
                <div className="font-medium">{currentUser?.displayName}</div>
                <div className="text-sm text-muted-foreground">
                  {currentUser?.type === 'teacher' ? 'Teacher' : `Grade ${currentUser?.grade}`}
                </div>
              </div>
              {settings.teacherModeEnabled && (
                <Badge variant="secondary">Teacher Mode</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Switch Account */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Switch Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {accounts.filter(acc => acc.id !== currentUser?.id).map((account) => (
              <Button
                key={account.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAccountSwitch(account.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{account.avatar}</span>
                  <div className="text-left">
                    <div className="font-medium">{account.displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {account.type === 'teacher' ? 'Teacher' : `Grade ${account.grade}`}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span>Sound Effects</span>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Offline Mode</span>
              </div>
              <Switch
                checked={!settings.isOnline}
                onCheckedChange={(checked) => updateSettings({ isOnline: !checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleResetProgress}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                updateSettings({ currentUserId: null });
                navigate('/');
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
};

export default SettingsScreen;