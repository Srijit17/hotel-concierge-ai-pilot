
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Code, TestTube, Rocket, BarChart } from 'lucide-react';

const DevelopmentRoadmap = () => {
  const phases = [
    {
      phase: "Planning & Requirements",
      duration: "1 week",
      progress: 100,
      status: "completed",
      icon: Calendar,
      tasks: [
        "Define conversation intents and entities (30+ intents)",
        "Create user personas and journey maps",
        "Design conversation flows and fallback strategies",
        "Set up development environment and tools"
      ],
      deliverables: ["Intent catalog", "Flow diagrams", "Technical specifications"],
      resources: ["Product Manager", "UX Designer", "Technical Lead"]
    },
    {
      phase: "NLU Development",
      duration: "2 weeks",
      progress: 75,
      status: "in-progress",
      icon: Code,
      tasks: [
        "Collect and prepare training data (50-100 examples per intent)",
        "Train and optimize Rasa NLU models",
        "Implement entity extraction and slot filling",
        "Create intent classification benchmarks"
      ],
      deliverables: ["Trained NLU model", "Entity extractors", "Classification metrics"],
      resources: ["ML Engineer", "Data Scientist", "Linguist"]
    },
    {
      phase: "Backend Integration",
      duration: "1.5 weeks",
      progress: 60,
      status: "in-progress",
      icon: Users,
      tasks: [
        "Set up Supabase project and database schema",
        "Develop Edge Functions for core APIs",
        "Implement authentication and session management",
        "Create mock integrations for PMS and payment systems"
      ],
      deliverables: ["API endpoints", "Database schema", "Authentication system"],
      resources: ["Backend Developer", "DevOps Engineer"]
    },
    {
      phase: "Frontend Implementation",
      duration: "1.5 weeks",
      progress: 90,
      status: "near-completion",
      icon: TestTube,
      tasks: [
        "Build responsive chat widget with React",
        "Implement real-time messaging with WebSockets",
        "Create rich message components (cards, buttons, forms)",
        "Add accessibility features and mobile optimization"
      ],
      deliverables: ["Chat widget", "UI components", "Mobile app"],
      resources: ["Frontend Developer", "UI/UX Designer"]
    },
    {
      phase: "Analytics & Monitoring",
      duration: "1 week",
      progress: 40,
      status: "planned",
      icon: BarChart,
      tasks: [
        "Set up conversation logging and metrics collection",
        "Build analytics dashboard with key KPIs",
        "Implement A/B testing framework",
        "Configure alerting and monitoring systems"
      ],
      deliverables: ["Analytics dashboard", "Monitoring setup", "KPI reports"],
      resources: ["Data Analyst", "DevOps Engineer"]
    },
    {
      phase: "Testing & Deployment",
      duration: "1 week",
      progress: 10,
      status: "planned",
      icon: Rocket,
      tasks: [
        "Conduct end-to-end conversation testing",
        "Perform load testing and performance optimization",
        "User acceptance testing with hotel staff",
        "Production deployment and go-live"
      ],
      deliverables: ["Test reports", "Performance benchmarks", "Live system"],
      resources: ["QA Engineer", "DevOps Engineer", "Product Manager"]
    }
  ];

  const milestones = [
    { week: 1, milestone: "Project Kickoff & Requirements Complete", status: "completed" },
    { week: 2, milestone: "NLU Model v1.0 Ready", status: "completed" },
    { week: 3, milestone: "Backend APIs Functional", status: "in-progress" },
    { week: 4, milestone: "Frontend MVP Complete", status: "in-progress" },
    { week: 5, milestone: "End-to-End Integration", status: "planned" },
    { week: 6, milestone: "Production Launch", status: "planned" }
  ];

  const riskMitigation = [
    {
      risk: "Low NLU accuracy for domain-specific requests",
      mitigation: "Continuous training data collection and model retraining",
      severity: "High"
    },
    {
      risk: "Integration complexity with existing hotel systems",
      mitigation: "Mock APIs first, gradual integration with fallback options",
      severity: "Medium"
    },
    {
      risk: "Performance issues under high chat volume",
      mitigation: "Load testing, auto-scaling, CDN implementation",
      severity: "Medium"
    },
    {
      risk: "User adoption and staff training challenges",
      mitigation: "Phased rollout, comprehensive training program",
      severity: "Low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'near-completion': return 'bg-yellow-500'
      case 'planned': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in-progress': return 'secondary'
      case 'near-completion': return 'outline'
      case 'planned': return 'outline'
      default: return 'outline'
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>6-Week Development Timeline</CardTitle>
          <p className="text-gray-600">Comprehensive roadmap from concept to production deployment</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase, index) => {
              const IconComponent = phase.icon;
              return (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(phase.status)} text-white`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{phase.phase}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{phase.duration}</Badge>
                          <Badge variant={getStatusBadge(phase.status)}>
                            {phase.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{phase.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>
                  
                  <Progress value={phase.progress} className="mb-4" />
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Tasks</h4>
                      <ul className="text-sm space-y-1">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start">
                            <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Deliverables</h4>
                      <div className="flex flex-wrap gap-1">
                        {phase.deliverables.map((deliverable, delIndex) => (
                          <Badge key={delIndex} variant="secondary" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Team Resources</h4>
                      <div className="flex flex-wrap gap-1">
                        {phase.resources.map((resource, resIndex) => (
                          <Badge key={resIndex} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getStatusColor(milestone.status)}`}>
                    {milestone.week}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{milestone.milestone}</p>
                    <Badge variant={getStatusBadge(milestone.status)} className="mt-1">
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Mitigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskMitigation.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{item.risk}</h4>
                    <Badge variant={
                      item.severity === 'High' ? 'destructive' : 
                      item.severity === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{item.mitigation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Success Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-gray-600">Intent Recognition Accuracy</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">&lt;2s</div>
              <div className="text-sm text-gray-600">Average Response Time</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-gray-600">Conversation Completion Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.5+</div>
              <div className="text-sm text-gray-600">User Satisfaction Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentRoadmap;
