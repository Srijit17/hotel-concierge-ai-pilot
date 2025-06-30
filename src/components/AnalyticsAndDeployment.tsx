
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, TrendingUp, Users, MessageSquare, Clock, CheckCircle, Github, Globe, Smartphone } from 'lucide-react';

const AnalyticsAndDeployment = () => {
  const analyticsMetrics = [
    {
      category: "Conversation Analytics",
      icon: MessageSquare,
      metrics: [
        { name: "Total Conversations", value: "2,847", change: "+23%", period: "this month" },
        { name: "Average Session Length", value: "4.2 min", change: "+15%", period: "vs last month" },
        { name: "Messages per Conversation", value: "8.7", change: "+12%", period: "avg" },
        { name: "Conversation Completion Rate", value: "89%", change: "+5%", period: "this week" }
      ]
    },
    {
      category: "Intent Recognition",
      icon: TrendingUp,
      metrics: [
        { name: "Overall Intent Accuracy", value: "94.2%", change: "+2.1%", period: "improved" },
        { name: "Top Intent", value: "CheckRoomAvailability", change: "34%", period: "of requests" },
        { name: "Fallback Rate", value: "5.8%", change: "-1.2%", period: "reduced" },
        { name: "Escalation to Human", value: "3.1%", change: "-0.8%", period: "decreased" }
      ]
    },
    {
      category: "Business Impact",
      icon: Users,
      metrics: [
        { name: "Booking Conversion", value: "23.5%", change: "+4.2%", period: "from chat" },
        { name: "Revenue from Bot", value: "$47,230", change: "+18%", period: "this month" },
        { name: "Cost per Conversation", value: "$0.12", change: "-8%", period: "efficiency" },
        { name: "Customer Satisfaction", value: "4.6/5", change: "+0.3", period: "rating" }
      ]
    },
    {
      category: "Performance Metrics",
      icon: Clock,
      metrics: [
        { name: "Average Response Time", value: "1.2s", change: "-0.3s", period: "improved" },
        { name: "System Uptime", value: "99.97%", change: "0%", period: "stable" },
        { name: "Peak Concurrent Users", value: "156", change: "+23", period: "handled" },
        { name: "API Response Success", value: "99.8%", change: "+0.1%", period: "reliability" }
      ]
    }
  ];

  const topIntents = [
    { intent: "CheckRoomAvailability", percentage: 34, count: 1247, trend: "up" },
    { intent: "BookRoom", percentage: 18, count: 658, trend: "up" },
    { intent: "RoomServiceOrder", percentage: 15, count: 548, trend: "stable" },
    { intent: "AskAboutAmenities", percentage: 12, count: 439, trend: "up" },
    { intent: "RequestLateCheckout", percentage: 8, count: 293, trend: "down" },
    { intent: "SubmitComplaint", percentage: 5, count: 183, trend: "down" },
    { intent: "SpeakToHuman", percentage: 4, count: 146, trend: "down" },
    { intent: "Other", percentage: 4, count: 146, trend: "stable" }
  ];

  const deploymentChecklist = [
    {
      category: "Core System",
      items: [
        { task: "NLU Model Training Complete", status: "completed", priority: "high" },
        { task: "Intent Recognition Testing", status: "completed", priority: "high" },
        { task: "Conversation Flow Validation", status: "completed", priority: "high" },
        { task: "Fallback Handling Implementation", status: "completed", priority: "medium" },
        { task: "Multi-language Support", status: "in-progress", priority: "medium" }
      ]
    },
    {
      category: "Integration",
      items: [
        { task: "Supabase Database Setup", status: "completed", priority: "high" },
        { task: "Authentication System", status: "completed", priority: "high" },
        { task: "Payment Gateway Integration", status: "in-progress", priority: "high" },
        { task: "PMS System Mock Integration", status: "completed", priority: "medium" },
        { task: "Email Notification System", status: "completed", priority: "medium" }
      ]
    },
    {
      category: "Frontend",
      items: [
        { task: "Chat Widget Development", status: "completed", priority: "high" },
        { task: "Mobile Responsiveness", status: "completed", priority: "high" },
        { task: "Accessibility (WCAG 2.1)", status: "completed", priority: "high" },
        { task: "PWA Implementation", status: "in-progress", priority: "medium" },
        { task: "Offline Mode Support", status: "planned", priority: "low" }
      ]
    },
    {
      category: "Testing & QA",
      items: [
        { task: "Unit Testing Coverage", status: "completed", priority: "high" },
        { task: "Integration Testing", status: "completed", priority: "high" },
        { task: "Load Testing (1000+ concurrent)", status: "completed", priority: "high" },
        { task: "Security Penetration Testing", status: "in-progress", priority: "high" },
        { task: "User Acceptance Testing", status: "completed", priority: "medium" }
      ]
    },
    {
      category: "Production",
      items: [
        { task: "CDN Configuration", status: "completed", priority: "medium" },
        { task: "SSL Certificate Setup", status: "completed", priority: "high" },
        { task: "Monitoring & Alerting", status: "completed", priority: "high" },
        { task: "Backup & Recovery Plan", status: "completed", priority: "high" },
        { task: "Documentation Complete", status: "in-progress", priority: "medium" }
      ]
    }
  ];

  const deploymentOptions = [
    {
      platform: "Lovable Hosting",
      description: "Native Lovable platform with auto-scaling",
      features: [
        "Instant deployment from editor",
        "Auto-scaling based on traffic",
        "Built-in CDN and SSL",
        "Real-time preview updates",
        "Integrated analytics dashboard"
      ],
      status: "Ready",
      icon: Globe
    },
    {
      platform: "GitHub Pages + Vercel",
      description: "GitHub integration with Vercel deployment",
      features: [
        "GitHub Actions CI/CD pipeline",
        "Branch-based deployments",
        "Custom domain support",
        "Edge function capabilities",
        "Performance analytics"
      ],
      status: "Configured",
      icon: Github
    },
    {
      platform: "WhatsApp Business API",
      description: "Mobile messaging platform integration",
      features: [
        "Direct WhatsApp chat integration",
        "Rich media message support",
        "Business verification",
        "Template message approval",
        "Mobile-first experience"
      ],
      status: "In Progress",
      icon: Smartphone
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'planned': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'planned': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="w-6 h-6 text-blue-600" />
            <span>Analytics Dashboard</span>
          </CardTitle>
          <p className="text-gray-600">Real-time performance metrics and business insights</p>
        </CardHeader>
        <CardContent>
          {analyticsMetrics.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <div key={categoryIndex} className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">{category.category}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                      <div className="text-sm font-medium text-gray-800">{metric.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className={metric.change.startsWith('+') || metric.change.startsWith('-') ? 
                          metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600' : 'text-gray-600'}>
                          {metric.change}
                        </span> {metric.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intent Usage Analytics</CardTitle>
          <p className="text-gray-600">Most frequently detected intents and conversation patterns</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topIntents.map((intent, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{intent.intent}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{intent.count} requests</span>
                      <Badge variant={intent.trend === 'up' ? 'default' : intent.trend === 'down' ? 'secondary' : 'outline'}>
                        {intent.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={intent.percentage} className="flex-1" />
                    <span className="text-sm font-medium">{intent.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Readiness Checklist</CardTitle>
          <p className="text-gray-600">Production deployment status across all system components</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {deploymentChecklist.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <span className="font-medium">{item.task}</span>
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'outline'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Multi-Platform Deployment</CardTitle>
          <p className="text-gray-600">Available deployment options for different use cases</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {deploymentOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{option.platform}</h4>
                      <Badge variant={option.status === 'Ready' ? 'default' : option.status === 'Configured' ? 'secondary' : 'outline'}>
                        {option.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <ul className="space-y-1">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm flex items-start">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success Metrics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-green-700">Intent Accuracy</div>
              <div className="text-xs text-green-600 mt-1">Target: >90%</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-blue-700">Response Time</div>
              <div className="text-xs text-blue-600 mt-1">Target: <2s</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-purple-700">Completion Rate</div>
              <div className="text-xs text-purple-600 mt-1">Target: >85%</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">4.6/5</div>
              <div className="text-sm text-orange-700">Satisfaction</div>
              <div className="text-xs text-orange-600 mt-1">Target: >4.0</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsAndDeployment;
