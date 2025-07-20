import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomBar } from "@/components/layout/BottomBar";
import { PatientCard } from "@/components/patient/PatientCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientMeta } from "@/types/models";
import { useNavigate } from "react-router-dom";
import { Filter, SortAsc } from "lucide-react";

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

const pathwayFilters = ['all', 'surgical', 'emergency', 'consultation'];
const stageFilters = ['all', 'pre-op', 'surgery', 'post-op', 'ICU', 'recovery', 'stable', 'discharge'];

export default function PatientsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPathway = selectedPathway === 'all' || patient.pathway === selectedPathway;
    const matchesStage = selectedStage === 'all' || patient.currentState === selectedStage;
    const matchesUrgent = !showUrgentOnly || patient.updateCounter > 5;
    
    return matchesSearch && matchesPathway && matchesStage && matchesUrgent;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="Patients" 
        showSearch
        showAdd
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={() => navigate('/patients/new')}
        notificationCount={3}
      />
      
      <div className="p-4 space-y-4">
        {/* Filter Bar */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {pathwayFilters.map((pathway) => (
              <Button
                key={pathway}
                variant={selectedPathway === pathway ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPathway(pathway)}
                className="whitespace-nowrap"
              >
                {pathway === 'all' ? 'All Pathways' : pathway.charAt(0).toUpperCase() + pathway.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <SortAsc className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {stageFilters.map((stage) => (
              <Button
                key={stage}
                variant={selectedStage === stage ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStage(stage)}
                className="whitespace-nowrap"
              >
                {stage === 'all' ? 'All Stages' : stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showUrgentOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowUrgentOnly(!showUrgentOnly)}
            >
              Urgent Only
            </Button>
            <Badge variant="secondary" className="ml-auto">
              {filteredPatients.length} patients
            </Badge>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid gap-3">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => navigate(`/patients/${patient.id}`)}
            />
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients found matching your criteria</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedPathway('all');
                setSelectedStage('all');
                setShowUrgentOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <BottomBar />
    </div>
  );
}