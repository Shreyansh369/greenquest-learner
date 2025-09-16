import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Gift, Calendar } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';

const WalletScreen = () => {
  const { getCurrentUserProgress, questSubmissions, currentUser } = useStore();
  const userProgress = getCurrentUserProgress();
  
  const userSubmissions = questSubmissions.filter(s => s.studentId === currentUser?.id && s.status === 'approved');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Eco Wallet</h1>
        
        <Card className="mb-6 token-display">
          <CardContent className="p-6 text-center">
            <Coins className="w-16 h-16 mx-auto mb-4 text-white" />
            <div className="text-4xl font-bold text-white mb-2">
              {userProgress?.totalTokens || 0}
            </div>
            <div className="text-white/80">Eco-Tokens Available</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-xl font-bold">{userSubmissions.length}</div>
              <div className="text-xs text-muted-foreground">Quests Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold">{userProgress?.unlockedCourses.length || 0}</div>
              <div className="text-xs text-muted-foreground">Courses Unlocked</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            {userSubmissions.length > 0 ? (
              <div className="space-y-3">
                {userSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Quest Completed</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="token-display">
                      +{submission.tokensAwarded || 0}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No earnings yet</p>
                <p className="text-sm text-muted-foreground">Complete quests to start earning tokens!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
};

export default WalletScreen;