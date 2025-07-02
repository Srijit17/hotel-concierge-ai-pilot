
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Brain, BarChart3 } from 'lucide-react';

interface ChatHeaderProps {
  showInsights: boolean;
  onToggleInsights: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  showInsights,
  onToggleInsights
}) => {
  return (
    <CardHeader className="border-b">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-primary" />
          <span>Sofia - Enhanced AI Concierge</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Ultra Fast
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Smart AI
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleInsights}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Insights
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
