import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Camera, 
  FileText, 
  Users,
  Star,
  MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import NavigationBar from '@/components/NavigationBar';

const TeacherScreen = () => {
  const { 
    questSubmissions, 
    accounts, 
    approveSubmission, 
    rejectSubmission,
    disableTeacherMode,
    skillLanes
  } = useStore();
  
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [validatorComments, setValidatorComments] = useState('');
  const [qualityScore, setQualityScore] = useState(1.0);

  const pendingSubmissions = questSubmissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = questSubmissions.filter(s => s.status !== 'pending');

  const getStudentName = (studentId: string) => {
    const student = accounts.find(acc => acc.id === studentId);
    return student ? student.displayName : 'Unknown Student';
  };

  const getQuestDetails = (questId: string) => {
    const quest = skillLanes
      .flatMap(lane => lane.nodes)
      .find(node => node.quest.id === questId)?.quest;
    return quest;
  };

  const handleApprove = (submissionId: string) => {
    approveSubmission(submissionId, qualityScore, validatorComments);
    toast({
      title: "Submission approved!",
      description: "Student has been awarded tokens for their quest."
    });
    setSelectedSubmission(null);
    setValidatorComments('');
    setQualityScore(1.0);
  };

  const handleReject = (submissionId: string) => {
    if (!validatorComments.trim()) {
      toast({
        title: "Comments required",
        description: "Please provide feedback when rejecting a submission.",
        variant: "destructive"
      });
      return;
    }
    
    rejectSubmission(submissionId, validatorComments);
    toast({
      title: "Submission rejected",
      description: "Feedback has been sent to the student."
    });
    setSelectedSubmission(null);
    setValidatorComments('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'geotag': return MapPin;
      case 'qr': return FileText;
      case 'report': return FileText;
      case 'team': return Users;
      default: return FileText;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const SubmissionCard = ({ submission }: { submission: any }) => {
    const quest = getQuestDetails(submission.questId);
    const studentName = getStudentName(submission.studentId);
    const TypeIcon = getTypeIcon(quest?.type || 'photo');
    
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedSubmission(submission.id)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{quest?.title || 'Unknown Quest'}</CardTitle>
              <p className="text-sm text-muted-foreground">By {studentName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={submission.status === 'approved' ? 'default' : 
                            submission.status === 'rejected' ? 'destructive' : 'secondary'}>
                {submission.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <TypeIcon className="w-4 h-4" />
              {quest?.type}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTimestamp(submission.timestamp)}
            </div>
            {quest && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {quest.basePoints} pts
              </div>
            )}
          </div>
          
          {submission.photoUrls && submission.photoUrls.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground mb-1">Photos: {submission.photoUrls.length}</p>
            </div>
          )}
          
          {submission.geoLocation && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground">
                📍 Location: {submission.geoLocation.lat.toFixed(4)}, {submission.geoLocation.lng.toFixed(4)}
              </p>
            </div>
          )}
          
          {submission.reportText && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground">
                📄 Report: {submission.reportText.substring(0, 100)}...
              </p>
            </div>
          )}
          
          {submission.status !== 'pending' && submission.tokensAwarded && (
            <Badge variant="outline" className="text-xs">
              +{submission.tokensAwarded} tokens awarded
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  const ReviewModal = () => {
    const submission = questSubmissions.find(s => s.id === selectedSubmission);
    if (!submission) return null;
    
    const quest = getQuestDetails(submission.questId);
    const studentName = getStudentName(submission.studentId);
    
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{quest?.title}</CardTitle>
                <p className="text-muted-foreground">Submitted by {studentName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Photo Evidence */}
            {submission.photoUrls && submission.photoUrls.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Photo Evidence</h4>
                <div className="grid grid-cols-2 gap-3">
                  {submission.photoUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Location */}
            {submission.geoLocation && (
              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    📍 Lat: {submission.geoLocation.lat.toFixed(6)}, 
                    Lng: {submission.geoLocation.lng.toFixed(6)}
                  </p>
                  {submission.geoLocation.address && (
                    <p className="text-sm text-muted-foreground">{submission.geoLocation.address}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Report Text */}
            {submission.reportText && (
              <div>
                <h4 className="font-medium mb-2">Student Report</h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-line">{submission.reportText}</p>
                </div>
              </div>
            )}
            
            {/* QR Data */}
            {submission.qrCodeData && (
              <div>
                <h4 className="font-medium mb-2">QR Code Data</h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-mono">{submission.qrCodeData}</p>
                </div>
              </div>
            )}
            
            {/* Team Members */}
            {submission.teamMembers && submission.teamMembers.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Team Members</h4>
                <div className="flex flex-wrap gap-2">
                  {submission.teamMembers.map((member, index) => (
                    <Badge key={index} variant="outline">{member}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {submission.status === 'pending' && (
              <>
                {/* Quality Score */}
                <div>
                  <h4 className="font-medium mb-2">Quality Score (0.5 - 1.5)</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={qualityScore}
                      onChange={(e) => setQualityScore(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{qualityScore.toFixed(1)}</span>
                  </div>
                </div>
                
                {/* Comments */}
                <div>
                  <h4 className="font-medium mb-2">Teacher Comments</h4>
                  <Textarea
                    placeholder="Provide feedback to the student..."
                    value={validatorComments}
                    onChange={(e) => setValidatorComments(e.target.value)}
                    rows={3}
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => handleApprove(submission.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(submission.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </>
            )}
            
            {submission.status !== 'pending' && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {submission.status === 'approved' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="font-medium capitalize">{submission.status}</span>
                </div>
                {submission.validatorComments && (
                  <p className="text-sm">{submission.validatorComments}</p>
                )}
                {submission.tokensAwarded && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Tokens awarded: {submission.tokensAwarded}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Review and validate student quest submissions</p>
          </div>
          <Button variant="outline" size="sm" onClick={disableTeacherMode}>
            Exit Teacher Mode
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
              <div className="text-xs text-muted-foreground">Pending Review</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {reviewedSubmissions.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {reviewedSubmissions.filter(s => s.status === 'rejected').length}
              </div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed ({reviewedSubmissions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending submissions</h3>
                  <p className="text-muted-foreground">
                    All quest submissions have been reviewed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="reviewed" className="space-y-4">
            {reviewedSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviewed submissions</h3>
                  <p className="text-muted-foreground">
                    Quest reviews will appear here after validation.
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviewedSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedSubmission && <ReviewModal />}
      <NavigationBar />
    </div>
  );
};

export default TeacherScreen;