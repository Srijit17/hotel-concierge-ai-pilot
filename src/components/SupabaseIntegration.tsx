
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SupabaseIntegration = () => {
  const databaseSchema = `-- Profiles table for guest information
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  guest_name text,
  email text unique,
  phone text,
  loyalty_tier text check (loyalty_tier in ('bronze', 'silver', 'gold', 'platinum')),
  preferences jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sessions table for chat conversations
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  started_at timestamptz default now(),
  ended_at timestamptz,
  channel text default 'web_widget',
  status text default 'active'
);

-- Messages table for conversation history
create table messages (
  id serial primary key,
  session_id uuid references sessions(id),
  sender text check (sender in ('user', 'bot')),
  content text not null,
  intent text,
  confidence float,
  entities jsonb default '{}',
  timestamp timestamptz default now()
);

-- Bookings table for reservation management
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  session_id uuid references sessions(id),
  room_type text not null,
  check_in date not null,
  check_out date not null,
  guests integer default 1,
  status text default 'inquiry',
  total_amount decimal(10,2),
  created_at timestamptz default now()
);

-- Room service orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  session_id uuid references sessions(id),
  room_number text,
  items jsonb not null,
  total_amount decimal(10,2),
  status text default 'pending',
  delivery_time timestamptz,
  created_at timestamptz default now()
);`;

  const edgeFunctions = [
    {
      name: "chat-handler",
      description: "Process incoming messages and route to appropriate handlers",
      endpoint: "/functions/v1/chat-handler",
      methods: ["POST"]
    },
    {
      name: "room-availability",
      description: "Check room availability and pricing",
      endpoint: "/functions/v1/room-availability",
      methods: ["GET", "POST"]
    },
    {
      name: "booking-create",
      description: "Create new room reservations",
      endpoint: "/functions/v1/booking-create",
      methods: ["POST"]
    },
    {
      name: "order-food",
      description: "Process room service orders",
      endpoint: "/functions/v1/order-food",
      methods: ["POST"]
    },
    {
      name: "analytics-log",
      description: "Log conversation events for analytics",
      endpoint: "/functions/v1/analytics-log",
      methods: ["POST"]
    }
  ];

  const realtimeFeatures = [
    {
      feature: "Live Chat Status",
      description: "Real-time typing indicators and message delivery status"
    },
    {
      feature: "Agent Handoff",
      description: "Seamless transition from bot to human agent"
    },
    {
      feature: "Booking Updates",
      description: "Live reservation status changes and confirmations"
    },
    {
      feature: "Order Tracking",
      description: "Real-time room service order status updates"
    }
  ];

  const sampleEdgeFunction = `// Supabase Edge Function: chat-handler
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { message, sessionId, profileId } = await req.json()

    // Log incoming message
    await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        sender: 'user',
        content: message,
        timestamp: new Date().toISOString()
      })

    // Process with NLU (simplified)
    const intent = await processNLU(message)
    let response = ''

    switch (intent.name) {
      case 'book_room':
        response = await handleBookingInquiry(intent, supabase)
        break
      case 'room_service':
        response = await handleRoomService(intent, supabase)
        break
      case 'amenities_info':
        response = await handleAmenitiesInfo(intent, supabase)
        break
      default:
        response = "I'm here to help! You can ask about room bookings, room service, or hotel amenities."
    }

    // Log bot response
    await supabase
      .from('messages')
      .insert({
        session_id: sessionId,
        sender: 'bot',
        content: response,
        intent: intent.name,
        confidence: intent.confidence,
        timestamp: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ response, intent: intent.name }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Backend Integration</CardTitle>
          <p className="text-gray-600">Complete backend infrastructure with authentication, database, and real-time features</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🗄️</span>
              </div>
              <h4 className="font-semibold">PostgreSQL Database</h4>
              <p className="text-sm text-gray-600">Structured data with ACID compliance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold">Edge Functions</h4>
              <p className="text-sm text-gray-600">Serverless API endpoints</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-semibold">Real-time</h4>
              <p className="text-sm text-gray-600">Live updates and notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>{databaseSchema}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edge Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {edgeFunctions.map((func, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-blue-600">{func.name}</h4>
                  <div className="flex space-x-1">
                    {func.methods.map((method, methodIndex) => (
                      <Badge key={methodIndex} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{func.description}</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{func.endpoint}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Edge Function</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>{sampleEdgeFunction}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Real-time Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {realtimeFeatures.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-600 mb-2">{feature.feature}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseIntegration;
