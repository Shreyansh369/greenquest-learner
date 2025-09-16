import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Award, Flame } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';

const ProfileScreen = () => {
  const { currentUser, getCurrentUserProgress, badges } = useStore();
  const userProgress = getCurrentUserProgress();

  const userBadges = badges.filter(badge => userProgress?.badges.includes(badge.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-4">
              {currentUser?.avatar}
            </div>
            <h1 className="text-2xl font-bold mb-1">{currentUser?.displayName}</h1>
            <p className="text-muted-foreground mb-4">Grade {currentUser?.grade} • {currentUser?.type}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-primary">{userProgress?.totalTokens || 0}</div>
                <div className="text-xs text-muted-foreground">Eco-Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-xp-bar">
                  {Object.values(userProgress?.skillLanes || {}).reduce((sum, lane) => sum + lane.totalXP, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{userProgress?.currentStreak || 0}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badges ({userBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {userBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{badge.title}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No badges earned yet</p>
                <p className="text-sm text-muted-foreground">Complete quests to earn your first badge!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span>{new Date(currentUser?.joinedDate || '').toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Courses completed</span>
              <Badge variant="outline">{userProgress?.completedCourses.length || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Courses unlocked</span>
              <Badge variant="outline">{userProgress?.unlockedCourses.length || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last active</span>
              <span>{new Date(userProgress?.lastActiveDate || '').toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
};

export default ProfileScreen;