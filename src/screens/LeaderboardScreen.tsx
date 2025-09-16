import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';

const LeaderboardScreen = () => {
  const { getLeaderboard, currentUser } = useStore();
  const leaderboard = getLeaderboard('class');

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankStyle = (position: number, userId: string) => {
    const isCurrentUser = userId === currentUser?.id;
    let baseStyle = "flex items-center justify-between p-4 rounded-lg ";
    
    if (isCurrentUser) {
      baseStyle += "bg-primary/10 border-2 border-primary/20 ";
    } else {
      baseStyle += "bg-muted/50 ";
    }
    
    if (position <= 3) {
      baseStyle += "shadow-md ";
    }
    
    return baseStyle;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Class Leaderboard</h1>
        
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <Card key={entry.userId} className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
              <CardContent className="p-4">
                <div className="mb-2">
                  {getRankIcon(entry.position)}
                </div>
                <div className="text-sm font-medium truncate">{entry.displayName}</div>
                <div className="text-lg font-bold text-primary">{entry.totalXP}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div key={entry.userId} className={getRankStyle(entry.position, entry.userId)}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-12">
                      {getRankIcon(entry.position)}
                      <span className="font-bold">#{entry.position}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.displayName}</div>
                      {entry.userId === currentUser?.id && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{entry.totalXP}</div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                </div>
              ))}
            </div>
            
            {leaderboard.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No rankings available</p>
                <p className="text-sm text-muted-foreground">Complete lessons to appear on the leaderboard!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <NavigationBar />
    </div>
  );
};

export default LeaderboardScreen;