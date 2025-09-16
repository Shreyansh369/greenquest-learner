import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Clock, Play } from 'lucide-react';

const LessonScreen = () => {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const { skillLanes, completeLesson } = useStore();

  // Find the lesson node
  const node = skillLanes
    .flatMap(lane => lane.nodes)
    .find(n => n.id === nodeId);

  if (!node) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lesson not found</p>
      </div>
    );
  }

  const handleCompleteLesson = () => {
    completeLesson(nodeId!);
    // Navigate to quiz
    navigate(`/quiz/${nodeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{node.lesson.title}</h1>
            <p className="text-sm text-muted-foreground">{node.title}</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Lesson Progress</span>
                  <span>Step 1 of 3</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {node.lesson.duration}min
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {node.lesson.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line leading-relaxed">
                {node.lesson.content}
              </div>
            </div>
            
            {node.lesson.imageUrl && (
              <div className="mt-6">
                <img
                  src={node.lesson.imageUrl}
                  alt="Lesson illustration"
                  className="rounded-lg w-full max-w-md mx-auto"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/home')}
          >
            Skip for Now
          </Button>
          
          <Button
            onClick={handleCompleteLesson}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Take Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonScreen;