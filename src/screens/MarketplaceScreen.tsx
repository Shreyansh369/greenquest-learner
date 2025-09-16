import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, BookOpen } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import { toast } from '@/hooks/use-toast';

const MarketplaceScreen = () => {
  const { courses, getCurrentUserProgress, currentUser, spendTokens } = useStore();
  const userProgress = getCurrentUserProgress();

  const handlePurchase = (courseId: string, cost: number) => {
    if (!currentUser) return;
    
    const success = spendTokens(currentUser.id, cost, courseId);
    if (success) {
      toast({
        title: "Course unlocked!",
        description: "You can now access this course content."
      });
    } else {
      toast({
        title: "Insufficient tokens",
        description: "Complete more quests to earn tokens.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Eco Marketplace</h1>
            <p className="text-muted-foreground">Redeem tokens for premium courses</p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-token-gold" />
            <span className="font-bold">{userProgress?.totalTokens || 0}</span>
          </div>
        </div>

        <div className="grid gap-4">
          {courses.map((course) => {
            const isUnlocked = userProgress?.unlockedCourses.includes(course.id);
            const isCompleted = userProgress?.completedCourses.includes(course.id);
            
            return (
              <Card key={course.id} className="nature-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                    {isCompleted ? (
                      <Badge className="badge-glow">Completed</Badge>
                    ) : isUnlocked ? (
                      <Badge variant="outline">Unlocked</Badge>
                    ) : (
                      <Badge className="token-display">{course.tokenCost} tokens</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}min
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.modules.length} modules
                    </div>
                  </div>
                  
                  {isUnlocked ? (
                    <Button className="w-full">
                      {isCompleted ? 'Review Course' : 'Continue Learning'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePurchase(course.id, course.tokenCost)}
                      disabled={(userProgress?.totalTokens || 0) < course.tokenCost}
                      className="w-full"
                    >
                      Purchase Course
                    </Button>
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

export default MarketplaceScreen;