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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Hospitality AI Chatbot - Enhanced POC
          </h1>
          <p className="text-lg text-slate-600">
            Complete Proof of Concept with Advanced Intent Detection & Debugging
          </p>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-6">
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="intents">Intent System</TabsTrigger>
            <TabsTrigger value="flows">Conversation Flows</TabsTrigger>
            <TabsTrigger value="fixes">Flow Improvements</TabsTrigger>
            <TabsTrigger value="debug">Debug Dashboard</TabsTrigger>
            <TabsTrigger value="ui">UI Design</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
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
          
          <TabsContent value="intents">
            <IntentManager />
          </TabsContent>
          
          <TabsContent value="flows">
            <ConversationFlows />
          </TabsContent>
          
          <TabsContent value="fixes">
            <ConversationFixes />
          </TabsContent>
          
          <TabsContent value="debug">
            <DebugDashboard />
          </TabsContent>
          
          <TabsContent value="ui">
            <UIMockups />
          </TabsContent>
          
          <TabsContent value="backend">
            <SupabaseIntegration />
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
