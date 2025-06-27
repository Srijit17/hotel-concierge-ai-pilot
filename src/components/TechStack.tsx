
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TechStack = () => {
  const techLayers = [
    {
      layer: "Chat UI",
      technologies: ["React.js widget", "Styled Components", "WebSocket connection"],
      recommended: "React.js + Tailwind CSS",
      status: "Production Ready"
    },
    {
      layer: "NLU Engine",
      technologies: ["Rasa Open Source", "spaCy NLP", "Custom intent models"],
      recommended: "Rasa (50-100 training examples per intent)",
      status: "Development"
    },
    {
      layer: "Dialogue Manager",
      technologies: ["Rasa Core stories", "Botpress flows", "Custom state machine"],
      recommended: "Rasa Core with conversation patterns",
      status: "Development"
    },
    {
      layer: "Backend API",
      technologies: ["Node.js Express", "Python Flask", "Edge Functions"],
      recommended: "Node.js + Supabase Edge Functions",
      status: "Mock Ready"
    },
    {
      layer: "Database",
      technologies: ["Supabase (Postgres)", "MongoDB", "Redis cache"],
      recommended: "Supabase with Auth + Real-time",
      status: "Integration Ready"
    },
    {
      layer: "Analytics",
      technologies: ["Metabase", "Grafana", "Custom dashboard"],
      recommended: "Supabase + Chart.js dashboard",
      status: "Prototype Ready"
    }
  ];

  const integrationFlow = [
    "Frontend Widget → WebSocket → Bot Engine",
    "Bot Engine → NLU Processing → Intent Classification",
    "Dialogue Manager → Context Management → Response Generation",
    "Backend APIs → Database Queries → Real-time Updates",
    "Analytics Layer → Event Logging → Dashboard Visualization"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Layer</th>
                  <th className="text-left p-3 font-semibold">Technology Options</th>
                  <th className="text-left p-3 font-semibold">Recommended</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {techLayers.map((layer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{layer.layer}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {layer.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-blue-600 font-medium">{layer.recommended}</td>
                    <td className="p-3">
                      <Badge 
                        variant={layer.status === 'Production Ready' ? 'default' : 
                                layer.status === 'Development' ? 'secondary' : 'outline'}
                      >
                        {layer.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrationFlow.map((flow, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm">{flow}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechStack;
