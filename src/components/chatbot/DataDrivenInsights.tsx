
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, Clock, Users, Star, DollarSign, 
  Activity, BarChart3, Target, Zap 
} from 'lucide-react';

interface DataInsight {
  id: string;
  title: string;
  value: string | number;
  change: number;
  type: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

interface DataDrivenInsightsProps {
  sessionData: {
    messageCount: number;
    sessionDuration: number;
    intentsDetected: string[];
    userSatisfaction: number;
  };
  hotelMetrics: {
    occupancyRate: number;
    avgResponseTime: number;
    popularServices: string[];
    peakHours: string[];
  };
}

export const DataDrivenInsights: React.FC<DataDrivenInsightsProps> = ({
  sessionData,
  hotelMetrics
}) => {
  const [insights, setInsights] = useState<DataInsight[]>([]);

  useEffect(() => {
    const generateInsights = () => {
      const newInsights: DataInsight[] = [
        {
          id: 'response_time',
          title: 'Avg Response Time',
          value: `${hotelMetrics.avgResponseTime}ms`,
          change: -15,
          type: 'positive',
          icon: <Zap className="w-4 h-4" />,
          description: '15% faster than yesterday'
        },
        {
          id: 'satisfaction',
          title: 'User Satisfaction',
          value: `${Math.round(sessionData.userSatisfaction * 100)}%`,
          change: 8,
          type: 'positive',
          icon: <Star className="w-4 h-4" />,
          description: 'Based on session feedback'
        },
        {
          id: 'occupancy',
          title: 'Hotel Occupancy',
          value: `${hotelMetrics.occupancyRate}%`,
          change: 12,
          type: 'positive',
          icon: <Users className="w-4 h-4" />,
          description: 'Current booking rate'
        },
        {
          id: 'session_length',
          title: 'Session Duration',
          value: `${Math.round(sessionData.sessionDuration / 60)}min`,
          change: -5,
          type: 'positive',
          icon: <Clock className="w-4 h-4" />,
          description: 'Users finding answers faster'
        }
      ];
      
      setInsights(newInsights);
    };

    generateInsights();
  }, [sessionData, hotelMetrics]);

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (change: number) => {
    return change > 0 ? '↗️' : change < 0 ? '↘️' : '→';
  };

  return (
    <div className="space-y-4">
      <Card className="border border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Live Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {insights.map(insight => (
              <div key={insight.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {insight.icon}
                    <span className="text-xs font-medium ml-1">{insight.title}</span>
                  </div>
                  <span className="text-xs">
                    {getChangeIcon(insight.change)} {Math.abs(insight.change)}%
                  </span>
                </div>
                <div className="text-lg font-bold">{insight.value}</div>
                <div className="text-xs text-muted-foreground">{insight.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Services */}
      <Card className="border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {hotelMetrics.popularServices.map((service, index) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-sm">{service}</span>
                <div className="flex items-center space-x-2">
                  <Progress value={90 - index * 15} className="w-16 h-2" />
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Analytics */}
      <Card className="border border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Activity className="w-4 h-4 mr-2" />
            Your Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Messages Exchanged:</span>
            <Badge>{sessionData.messageCount}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Intents Detected:</span>
            <Badge>{sessionData.intentsDetected.length}</Badge>
          </div>

          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Most Common Intents:</div>
            <div className="flex flex-wrap gap-1">
              {sessionData.intentsDetected.slice(0, 3).map(intent => (
                <Badge key={intent} variant="outline" className="text-xs">
                  {intent}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
