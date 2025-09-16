import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  Coins, 
  Trophy, 
  Flame, 
  Users, 
  Settings, 
  Play,
  Lock,
  CheckCircle,
  Star
} from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    skillLanes, 
    getCurrentUserProgress,
    settings,
    getLeaderboard
  } = useStore();

  const userProgress = getCurrentUserProgress();
  const leaderboard = getLeaderboard('class');
  const userRank = leaderboard.find(entry => entry.userId === currentUser?.id)?.position || 0;

  if (!currentUser || !userProgress) {
    return <div>Loading...</div>;
  }

  const totalXP = Object.values(userProgress.skillLanes)
    .reduce((sum, lane) => sum + lane.totalXP, 0);

  const totalBadges = userProgress.badges.length;
  const completedNodes = Object.values(userProgress.skillLanes)
    .reduce((sum, lane) => sum + lane.nodesCompleted.length, 0);

  const handleNodeClick = (node: any) => {
    if (node.isLocked) return;
    
    if (!node.isCompleted) {
      navigate(`/lesson/${node.id}`);
    } else {
      // Option to replay or go to quest
      navigate(`/quest/${node.quest.id}`);
    }
  };

  const getNodeIcon = (node: any) => {
    if (node.isLocked) return <Lock className="w-6 h-6 text-muted-foreground" />;
    if (node.isCompleted) return <CheckCircle className="w-6 h-6 text-success" />;
    return <Play className="w-6 h-6 text-primary" />;
  };

  const getNodeStyle = (node: any) => {
    if (node.isLocked) return 'skill-node-locked';
    if (node.isCompleted) return 'skill-node-completed';
    return 'skill-node-available';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hello, {currentUser.displayName}! 👋</h1>
            <p className="text-muted-foreground">Ready for today's eco-adventure?</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 text-token-gold mx-auto mb-2" />
              <div className="text-2xl font-bold">{userProgress.totalTokens}</div>
              <div className="text-xs text-muted-foreground">Eco-Tokens</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-xp-bar mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalXP}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userProgress.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-badge-gold mx-auto mb-2" />
              <div className="text-2xl font-bold">#{userRank || '--'}</div>
              <div className="text-xs text-muted-foreground">Class Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate('/marketplace')}
            className="flex-1"
          >
            <Coins className="w-4 h-4 mr-2" />
            Marketplace
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/leaderboard')}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Nodes Completed</span>
                  <span>{completedNodes}/12</span>
                </div>
                <Progress value={(completedNodes / 12) * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-lg font-bold">{totalBadges}</div>
                  <div className="text-xs text-muted-foreground">Badges Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{userProgress.completedCourses.length}</div>
                  <div className="text-xs text-muted-foreground">Courses Done</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Lanes */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Skill Lanes</h2>
          
          {skillLanes.map((lane) => {
            const laneProgress = userProgress.skillLanes[lane.id];
            const completedInLane = laneProgress?.nodesCompleted.length || 0;
            const totalInLane = lane.nodes.length;
            const progressPercentage = (completedInLane / totalInLane) * 100;

            return (
              <Card key={lane.id} className="nature-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{lane.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{lane.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{lane.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {completedInLane}/{totalInLane}
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mt-2" />
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {lane.nodes.map((node) => (
                      <Button
                        key={node.id}
                        variant="outline"
                        className={`h-20 flex flex-col items-center justify-center p-2 ${getNodeStyle(node)}`}
                        onClick={() => handleNodeClick(node)}
                        disabled={node.isLocked}
                      >
                        {getNodeIcon(node)}
                        <span className="text-xs text-center mt-1 leading-tight">
                          {node.title}
                        </span>
                        {node.masteryScore > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {Math.round(node.masteryScore)}%
                          </div>
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  {laneProgress && (
                    <div className="mt-4 text-center">
                      <Badge variant="secondary" className="text-xs">
                        {laneProgress.totalXP} XP earned
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default HomeScreen;