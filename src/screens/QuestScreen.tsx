import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  QrCode, 
  FileText, 
  Users, 
  Upload,
  CheckCircle,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QuestScreen = () => {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { skillLanes, submitQuest } = useStore();
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{lat: number; lng: number; address?: string} | null>(null);
  const [reportText, setReportText] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the quest
  const quest = skillLanes
    .flatMap(lane => lane.nodes)
    .find(node => node.quest.id === questId)?.quest;

  if (!quest) {
    return <div className="min-h-screen flex items-center justify-center">Quest not found</div>;
  }

  const handlePhotoCapture = () => {
    // Simulate photo capture (in a real app, this would use camera API)
    const simulatedPhoto = `https://images.unsplash.com/400x300/?nature,environment&${Date.now()}`;
    setPhotos(prev => [...prev, simulatedPhoto]);
    toast({
      title: "Photo captured!",
      description: "Your environmental photo has been added to the submission."
    });
  };

  const handleLocationCapture = () => {
    // Simulate geolocation (in a real app, this would use navigator.geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          });
          toast({
            title: "Location captured!",
            description: "GPS coordinates have been recorded."
          });
        },
        () => {
          // Fallback to simulated location
          setLocation({
            lat: 37.7749 + (Math.random() - 0.5) * 0.1,
            lng: -122.4194 + (Math.random() - 0.5) * 0.1,
            address: 'Simulated Location'
          });
          toast({
            title: "Location set!",
            description: "Using simulated GPS coordinates for demo."
          });
        }
      );
    }
  };

  const handleQRScan = () => {
    // Simulate QR code scan
    const simulatedQRData = `ECO_EVENT_${Date.now()}`;
    setQrCodeData(simulatedQRData);
    toast({
      title: "QR Code scanned!",
      description: `Event code: ${simulatedQRData}`
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validate required fields based on quest type
    if (quest.type === 'photo' && photos.length === 0) {
      toast({
        title: "Photos required",
        description: "Please capture at least one photo for this quest.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (quest.type === 'geotag' && !location) {
      toast({
        title: "Location required",
        description: "Please capture your location for this quest.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (quest.type === 'report' && reportText.trim().length < 50) {
      toast({
        title: "Report too short",
        description: "Please write at least 50 characters for your report.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Submit the quest
    const submissionData = {
      photoUrls: photos,
      geoLocation: location,
      reportText: reportText.trim(),
      qrCodeData,
      teamMembers: teamMembers.length > 0 ? teamMembers : undefined
    };

    const submissionId = submitQuest(questId!, submissionData);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Quest submitted!",
        description: "Your submission is pending teacher review.",
      });
      navigate('/home');
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'quest-easy';
      case 'medium': return 'quest-medium';
      case 'hard': return 'quest-hard';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'geotag': return MapPin;
      case 'qr': return QrCode;
      case 'report': return FileText;
      case 'team': return Users;
      default: return FileText;
    }
  };

  const TypeIcon = getTypeIcon(quest.type);

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
            <h1 className="text-xl font-bold">{quest.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getDifficultyColor(quest.difficulty)}>
                {quest.difficulty}
              </Badge>
              <Badge variant="outline">
                <Star className="w-3 h-3 mr-1" />
                {quest.basePoints} points
              </Badge>
            </div>
          </div>
        </div>

        {/* Quest Details */}
        <Card className="mb-6 quest-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TypeIcon className="w-5 h-5" />
              Quest Objective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 mb-4">{quest.description}</p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white">Requirements:</h4>
              <ul className="space-y-1">
                {quest.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            
            {quest.timeLimit && (
              <div className="mt-4 text-sm text-white/80">
                ⏰ Time limit: {quest.timeLimit} hours
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Form */}
        <div className="space-y-6">
          {/* Photo Capture */}
          {(quest.type === 'photo' || quest.type === 'geotag') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photo Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handlePhotoCapture}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-1 right-1 text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Location Capture */}
          {quest.type === 'geotag' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleLocationCapture}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Capture Location
                </Button>
                
                {location && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Location captured:</p>
                    <p className="text-xs text-muted-foreground">
                      Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                    </p>
                    {location.address && (
                      <p className="text-xs text-muted-foreground">{location.address}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* QR Code Scan */}
          {quest.type === 'qr' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleQRScan}
                  className="w-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
                
                {qrCodeData && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Scanned data:</p>
                    <p className="text-xs font-mono bg-background p-2 rounded mt-1">
                      {qrCodeData}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Report Text */}
          {quest.type === 'report' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Write Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your findings, observations, or actions taken..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="min-h-32"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum 50 characters ({reportText.length}/50)
                </p>
              </CardContent>
            </Card>
          )}

          {/* Team Members */}
          {quest.type === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={member}
                        onChange={(e) => {
                          const updated = [...teamMembers];
                          updated[index] = e.target.value;
                          setTeamMembers(updated);
                        }}
                        placeholder={`Team member ${index + 1} name`}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTeamMembers(prev => [...prev, ''])}
                  >
                    Add Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-12"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Quest
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestScreen;