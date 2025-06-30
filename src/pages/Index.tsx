import React from 'react';
import HotelChatbot from '@/components/HotelChatbot';
import ArchitectureDashboard from '@/components/ArchitectureDashboard';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import TechStack from '@/components/TechStack';
import ConversationFlows from '@/components/ConversationFlows';
import UIMockups from '@/components/UIMockups';
import SupabaseIntegration from '@/components/SupabaseIntegration';
import DevelopmentRoadmap from '@/components/DevelopmentRoadmap';
import IntentManager from '@/components/IntentManager';
import DebugDashboard from '@/components/DebugDashboard';
import ConversationFixes from '@/components/ConversationFixes';
import IntentTrainingData from '@/components/IntentTrainingData';
import ConversationFlowExamples from '@/components/ConversationFlowExamples';
import UIUXDesignGuide from '@/components/UIUXDesignGuide';
import AnalyticsAndDeployment from '@/components/AnalyticsAndDeployment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Professional Hospitality AI Chatbot - Complete System
          </h1>
          <p className="text-lg text-slate-600">
            Production-Ready Digital Concierge with Advanced NLU & Premium UX Design
          </p>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-14 mb-6 text-xs">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="intents">Intents</TabsTrigger>
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="fixes">Fixes</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="ui">UI</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="demo">Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <ExecutiveSummary />
          </TabsContent>
          
          <TabsContent value="architecture">
            <ArchitectureDashboard />
          </TabsContent>
          
          <TabsContent value="tech">
            <TechStack />
          </TabsContent>
          
          <TabsContent value="training">
            <IntentTrainingData />
          </TabsContent>
          
          <TabsContent value="intents">
            <IntentManager />
          </TabsContent>
          
          <TabsContent value="flows">
            <ConversationFlows />
          </TabsContent>
          
          <TabsContent value="examples">
            <ConversationFlowExamples />
          </TabsContent>
          
          <TabsContent value="fixes">
            <ConversationFixes />
          </TabsContent>
          
          <TabsContent value="debug">
            <DebugDashboard />
          </TabsContent>
          
          <TabsContent value="design">
            <UIUXDesignGuide />
          </TabsContent>
          
          <TabsContent value="ui">
            <UIMockups />
          </TabsContent>
          
          <TabsContent value="backend">
            <SupabaseIntegration />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsAndDeployment />
          </TabsContent>
          
          <TabsContent value="roadmap">
            <DevelopmentRoadmap />
          </TabsContent>
          
          <TabsContent value="demo">
            <div className="flex justify-center">
              <HotelChatbot />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
