import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Target } from 'lucide-react';

const QuizScreen = () => {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const { skillLanes, submitQuizScore } = useStore();
  
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Find the lesson node
  const node = skillLanes
    .flatMap(lane => lane.nodes)
    .find(n => n.id === nodeId);

  if (!node) {
    return <div className="min-h-screen flex items-center justify-center">Quiz not found</div>;
  }

  const currentQuiz = node.quizzes[currentQuizIndex];
  const totalQuizzes = node.quizzes.length;
  const progress = ((currentQuizIndex + (showResults ? 1 : 0)) / totalQuizzes) * 100;

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmitAnswer = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentQuizIndex < totalQuizzes - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setShowResults(false);
    } else {
      // Calculate final score
      const totalScore = node.quizzes.reduce((sum, quiz, index) => {
        const isCorrect = selectedAnswers[index] === quiz.correctAnswer;
        return sum + (isCorrect ? quiz.points : 0);
      }, 0);
      
      const maxScore = node.quizzes.reduce((sum, quiz) => sum + quiz.points, 0);
      
      // Submit quiz score
      submitQuizScore(nodeId!, totalScore, maxScore);
      
      setQuizCompleted(true);
    }
  };

  const handleFinish = () => {
    const masteryAchieved = (getTotalScore() / getMaxScore()) * 100 >= node.requiredScore;
    
    if (masteryAchieved) {
      navigate(`/quest/${node.quest.id}`);
    } else {
      navigate('/home');
    }
  };

  const getTotalScore = () => {
    return node.quizzes.reduce((sum, quiz, index) => {
      const isCorrect = selectedAnswers[index] === quiz.correctAnswer;
      return sum + (isCorrect ? quiz.points : 0);
    }, 0);
  };

  const getMaxScore = () => {
    return node.quizzes.reduce((sum, quiz) => sum + quiz.points, 0);
  };

  const isAnswerCorrect = (index: number) => {
    return selectedAnswers[currentQuizIndex] === currentQuiz.correctAnswer;
  };

  if (quizCompleted) {
    const finalScore = getTotalScore();
    const maxScore = getMaxScore();
    const percentage = (finalScore / maxScore) * 100;
    const masteryAchieved = percentage >= node.requiredScore;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              {masteryAchieved ? (
                <CheckCircle className="w-16 h-16 text-success" />
              ) : (
                <Target className="w-16 h-16 text-orange-500" />
              )}
            </div>
            <CardTitle>
              {masteryAchieved ? 'Mastery Achieved!' : 'Good Effort!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <div className="text-3xl font-bold text-primary">
                {Math.round(percentage)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {finalScore} out of {maxScore} points
              </div>
            </div>
            
            <Progress value={percentage} className="h-3" />
            
            <div className="text-sm text-muted-foreground">
              {masteryAchieved 
                ? `Great job! You've unlocked the quest: "${node.quest.title}"`
                : `You need ${node.requiredScore}% to master this topic. Keep practicing!`
              }
            </div>
            
            <div className="space-y-2">
              {masteryAchieved ? (
                <Button onClick={handleFinish} className="w-full">
                  Start Quest
                </Button>
              ) : (
                <Button variant="outline" onClick={() => navigate('/home')} className="w-full">
                  Continue Learning
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-2xl">
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
            <h1 className="text-xl font-bold">{node.title} - Quiz</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuizIndex + 1} of {totalQuizzes}
            </p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Progress value={progress} className="h-2" />
              </div>
              <Badge variant="outline">
                {Math.round(progress)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuiz.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {!showResults ? (
              <RadioGroup
                value={selectedAnswers[currentQuizIndex]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQuizIndex, parseInt(value))}
              >
                {currentQuiz.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 ${
                      index === currentQuiz.correctAnswer
                        ? 'border-success bg-success/10'
                        : selectedAnswers[currentQuizIndex] === index && index !== currentQuiz.correctAnswer
                        ? 'border-destructive bg-destructive/10'
                        : 'border-border'
                    }`}
                  >
                    {index === currentQuiz.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : selectedAnswers[currentQuizIndex] === index ? (
                      <XCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                    <span className="flex-1">{option}</span>
                  </div>
                ))}
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Explanation:</p>
                  <p className="text-sm">{currentQuiz.explanation}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/home')}
          >
            Exit Quiz
          </Button>
          
          {!showResults ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswers[currentQuizIndex] === undefined}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuizIndex < totalQuizzes - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;