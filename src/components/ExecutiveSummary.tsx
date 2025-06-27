
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, DollarSign, BarChart3 } from 'lucide-react';

const ExecutiveSummary = () => {
  const businessGoals = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Instant guest service at any hour without staffing costs"
    },
    {
      icon: TrendingUp,
      title: "Personalized Service",
      description: "AI-driven recommendations based on guest preferences"
    },
    {
      icon: DollarSign,
      title: "Cost Savings",
      description: "Reduce front desk workload by 40-60% for routine inquiries"
    },
    {
      icon: BarChart3,
      title: "Data Insights",
      description: "Real-time analytics on guest needs and satisfaction"
    }
  ];

  const expectedImpacts = [
    { metric: "Guest Satisfaction", improvement: "+25%", color: "bg-green-500" },
    { metric: "Direct Bookings", improvement: "+18%", color: "bg-blue-500" },
    { metric: "Loyalty Program Signups", improvement: "+35%", color: "bg-purple-500" },
    { metric: "Operational Costs", improvement: "-30%", color: "bg-red-500" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Executive Summary</CardTitle>
          <p className="text-center text-gray-600">
            AI-Powered Hospitality Chatbot - Transforming Guest Experience Through Intelligent Automation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Goals</h3>
              <div className="space-y-4">
                {businessGoals.map((goal, index) => {
                  const IconComponent = goal.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Expected Impact</h3>
              <div className="space-y-4">
                {expectedImpacts.map((impact, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm">
                    <span className="font-medium">{impact.metric}</span>
                    <Badge className={`${impact.color} text-white`}>
                      {impact.improvement}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-2">Strategic Value Proposition</h4>
            <p className="text-blue-800 text-sm">
              By implementing an AI chatbot, hotels can deliver consistent, personalized service while 
              reducing operational costs and gaining valuable insights into guest behavior patterns. 
              This technology investment positions the hotel as an industry leader in digital hospitality.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
