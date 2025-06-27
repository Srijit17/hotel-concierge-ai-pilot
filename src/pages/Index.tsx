
import React from 'react';
import HotelChatbot from '@/components/HotelChatbot';
import ArchitectureDashboard from '@/components/ArchitectureDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Hospitality AI Chatbot
          </h1>
          <p className="text-lg text-slate-600">
            Proof of Concept - Modern Hotel Guest Experience
          </p>
        </div>
        
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="architecture">Architecture & Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo">
            <div className="flex justify-center">
              <HotelChatbot />
            </div>
          </TabsContent>
          
          <TabsContent value="architecture">
            <ArchitectureDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
