import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  Settings,
  ArrowLeft
} from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import { useNavigate } from 'react-router-dom';

const TeacherScreen = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    getPendingSubmissions, 
    approveSubmission, 
    rejectSubmission,
    questSubmissions 
  } = useStore();

  // Redirect if not a teacher
  if (currentUser?.type !== 'teacher') {
    navigate('/home');
    return null;
  }

  const pendingSubmissions = getPendingSubmissions();
  const totalSubmissions = questSubmissions.length;
  const approvedSubmissions = questSubmissions.filter(s => s.status === 'approved').length;
  const rejectedSubmissions = questSubmissions.filter(s => s.status === 'rejected').length;

  const handleApprove = (submissionId: string) => {
    const qualityScore = 1.0; // Could be made dynamic with a slider
    approveSubmission(submissionId, qualityScore, 'Well done!');
  };

  const handleReject = (submissionId: string) => {
    const comments = 'Please review the requirements and try again.'; // Could be made dynamic
    rejectSubmission(submissionId, comments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Validate student quest submissions</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">{approvedSubmissions}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold">{rejectedSubmissions}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Pending Submissions</h2>
          
          {pendingSubmissions.length > 0 ? (
            pendingSubmissions.map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Quest Submission</CardTitle>
                    <Badge variant="secondary">
                      {new Date(submission.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Student ID</h4>
                      <p className="text-sm text-muted-foreground">{submission.studentId}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Quest ID</h4>
                      <p className="text-sm text-muted-foreground">{submission.questId}</p>
                    </div>
                  </div>
                  
                  {submission.reportText && (
                    <div>
                      <h4 className="font-medium mb-2">Report</h4>
                      <p className="text-sm bg-muted p-3 rounded">{submission.reportText}</p>
                    </div>
                  )}
                  
                  {submission.geoLocation && (
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <p className="text-sm text-muted-foreground">
                        {submission.geoLocation.address || `${submission.geoLocation.lat}, ${submission.geoLocation.lng}`}
                      </p>
                    </div>
                  )}
                  
                  {submission.teamMembers && submission.teamMembers.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Team Members</h4>
                      <div className="flex flex-wrap gap-1">
                        {submission.teamMembers.map((member, index) => (
                          <Badge key={index} variant="outline">{member}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => handleApprove(submission.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleReject(submission.id)}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Pending Submissions</h3>
                <p className="text-muted-foreground">All quest submissions have been reviewed.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        {questSubmissions.filter(s => s.status !== 'pending').length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <div className="space-y-2">
              {questSubmissions
                .filter(s => s.status !== 'pending')
                .slice(0, 5)
                .map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 rounded bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(submission.status)}`} />
                      <div>
                        <div className="font-medium text-sm">Quest {submission.questId}</div>
                        <div className="text-xs text-muted-foreground">
                          Student: {submission.studentId}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={submission.status === 'approved' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {submission.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default TeacherScreen;