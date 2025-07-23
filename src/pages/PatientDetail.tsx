import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomBar } from "@/components/layout/BottomBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StageChip } from "@/components/patient/StageChip";
import { Timeline } from "@/components/patient/Timeline";
import { QrCode, Copy, Phone, Mail, Calendar, MapPin } from "lucide-react";
import { PatientMeta, TimelineEntry } from "@/types/models";

// Mock data - replace with real API calls
const mockPatients: PatientMeta[] = [
  {
    id: '27e8d1ad',
    name: 'Jane Doe',
    qrCode: 'https://qrc.c/27e8d1ad',
    pathway: 'surgical',
    currentState: 'post-op',
    diagnosis: 'Cholecystitis',
    comorbidities: ['HTN', 'DM'],
    updateCounter: 5,
    lastUpdated: '2025-07-19T14:30:09Z'
  },
  {
    id: '3b9f2c1e',
    name: 'John Smith',
    qrCode: 'https://qrc.c/3b9f2c1e',
    pathway: 'emergency',
    currentState: 'ICU',
    diagnosis: 'Acute MI',
    comorbidities: ['CAD', 'HTN'],
    updateCounter: 12,
    lastUpdated: '2025-07-19T16:45:22Z'
  },
  {
    id: '8c4d5e2f',
    name: 'Maria Garcia',
    qrCode: 'https://qrc.c/8c4d5e2f',
    pathway: 'consultation',
    currentState: 'stable',
    diagnosis: 'Osteoarthritis',
    comorbidities: ['Obesity'],
    updateCounter: 2,
    lastUpdated: '2025-07-19T11:20:15Z'
  },
  {
    id: '9d6e7f3g',
    name: 'Robert Wilson',
    qrCode: 'https://qrc.c/9d6e7f3g',
    pathway: 'surgical',
    currentState: 'pre-op',
    diagnosis: 'Appendicitis',
    comorbidities: [],
    updateCounter: 8,
    lastUpdated: '2025-07-19T13:15:30Z'
  },
  {
    id: '1a2b3c4d',
    name: 'Sarah Johnson',
    qrCode: 'https://qrc.c/1a2b3c4d',
    pathway: 'emergency',
    currentState: 'recovery',
    diagnosis: 'Pneumonia',
    comorbidities: ['COPD', 'HTN'],
    updateCounter: 3,
    lastUpdated: '2025-07-19T09:45:18Z'
  }
];

const mockTimelines: TimelineEntry[] = [
  // Jane Doe
  {
    patientId: '27e8d1ad',
    state: 'Admission',
    dateIn: '2025-07-18T08:00:00Z',
    dateOut: '2025-07-18T10:00:00Z',
    checklistIn: ['vitals-recorded', 'allergies-checked'],
    checklistOut: ['pre-op-clearance']
  },
  {
    patientId: '27e8d1ad',
    state: 'Pre-Op',
    dateIn: '2025-07-18T10:00:00Z',
    dateOut: '2025-07-18T14:00:00Z',
    checklistIn: ['consent-signed', 'fasting-confirmed'],
    checklistOut: ['anesthesia-cleared']
  },
  {
    patientId: '27e8d1ad',
    state: 'Surgery',
    dateIn: '2025-07-18T14:00:00Z',
    dateOut: '2025-07-18T16:30:00Z',
    checklistIn: ['timeout-completed', 'antibiotics-given'],
    checklistOut: ['procedure-completed', 'counts-correct']
  },
  {
    patientId: '27e8d1ad',
    state: 'Post-Op',
    dateIn: '2025-07-18T16:30:00Z',
    checklistIn: ['recovery-stable', 'pain-managed'],
    checklistOut: []
  },
  // John Smith
  {
    patientId: '3b9f2c1e',
    state: 'Admission',
    dateIn: '2025-07-19T10:00:00Z',
    dateOut: '2025-07-19T12:00:00Z',
    checklistIn: ['vitals-recorded'],
    checklistOut: ['ICU-transfer']
  },
  {
    patientId: '3b9f2c1e',
    state: 'ICU',
    dateIn: '2025-07-19T12:00:00Z',
    checklistIn: ['monitoring', 'medication-started'],
    checklistOut: []
  },
  // Robert Wilson
  {
    patientId: '9d6e7f3g',
    state: 'Admission',
    dateIn: '2025-07-18T09:00:00Z',
    dateOut: '2025-07-18T11:00:00Z',
    checklistIn: ['vitals-recorded'],
    checklistOut: ['pre-op-clearance']
  },
  {
    patientId: '9d6e7f3g',
    state: 'Pre-Op',
    dateIn: '2025-07-18T11:00:00Z',
    checklistIn: ['consent-signed'],
    checklistOut: []
  },
  // Sarah Johnson
  {
    patientId: '1a2b3c4d',
    state: 'Admission',
    dateIn: '2025-07-17T08:00:00Z',
    dateOut: '2025-07-17T10:00:00Z',
    checklistIn: ['vitals-recorded'],
    checklistOut: ['recovery-transfer']
  },
  {
    patientId: '1a2b3c4d',
    state: 'recovery',
    dateIn: '2025-07-17T10:00:00Z',
    checklistIn: ['oxygen-started'],
    checklistOut: []
  }
  // Maria Garcia (consultation) has no timeline
];

export { mockPatients };
export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = mockPatients.find((p) => p.id === id);
  const timeline = mockTimelines.filter((t) => t.patientId === id);

  // Mock patient demographics (could be extended per patient)
  const demographics = {
    mrn: 'MRN123456',
    dob: '1975-03-15',
    age: 49,
    gender: 'Female',
    room: 'Room 204B',
    admissionDate: '2025-07-18',
    allergies: ['Penicillin', 'Latex'],
    emergencyContact: {
      name: 'John Doe (Spouse)',
      phone: '+1-555-0123'
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header title="Patient Details" showBack onBack={() => navigate('/patients')} />
        <div className="text-2xl font-bold mt-8">Patient not found</div>
        <Button className="mt-4" onClick={() => navigate('/patients')}>Back to Patients</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Patient Details" 
        showBack
        onBack={() => navigate('/patients')}
        notificationCount={2}
      />
      <div className="p-4 space-y-6">
        {/* Patient Hero */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">{patient.name}</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">MRN:</span>
                    <span className="font-medium">{demographics.mrn}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{demographics.age} years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{demographics.room}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Pathway:</div>
                  <Badge variant="outline" className="capitalize">
                    {patient.pathway}
                  </Badge>
                  <div className="text-muted-foreground">Current Stage:</div>
                  <StageChip stage={patient.currentState} variant="caution" />
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
          </div>

          {/* Diagnosis and Comorbidities */}
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Primary Diagnosis:</span>
              <div className="font-medium">{patient.diagnosis}</div>
            </div>
            {patient.comorbidities.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Comorbidities:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {patient.comorbidities.map((comorbidity) => (
                    <Badge key={comorbidity} variant="secondary">
                      {comorbidity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {demographics.allergies.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Allergies:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {demographics.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Emergency Contact */}
          <div className="mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Emergency Contact:</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-medium">{demographics.emergencyContact.name}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </Card>
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="meds">Meds</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {timeline.length > 0 ? (
              <Timeline entries={timeline} currentState={patient.currentState} />
            ) : (
              <Card className="p-4 text-center text-muted-foreground">No timeline available for this patient.</Card>
            )}
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Length of Stay</h3>
                <p className="text-2xl font-bold text-medical">3 days</p>
                <p className="text-sm text-muted-foreground">Since admission</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Next Milestone</h3>
                <p className="text-lg font-medium">Discharge Planning</p>
                <p className="text-sm text-muted-foreground">Expected tomorrow</p>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="notes">
            <Card className="p-4">
              <p className="text-muted-foreground text-center py-8">
                Notes component will be implemented here
              </p>
            </Card>
          </TabsContent>
          <TabsContent value="labs">
            <Card className="p-4">
              <p className="text-muted-foreground text-center py-8">
                Lab results component will be implemented here
              </p>
            </Card>
          </TabsContent>
          <TabsContent value="meds">
            <Card className="p-4">
              <p className="text-muted-foreground text-center py-8">
                Medications component will be implemented here
              </p>
            </Card>
          </TabsContent>
          <TabsContent value="tasks">
            <Card className="p-4">
              <p className="text-muted-foreground text-center py-8">
                Tasks component will be implemented here
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <BottomBar />
    </div>
  );
}