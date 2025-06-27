
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ArchitectureDashboard = () => {
  // Sample analytics data
  const chatMetrics = [
    { name: 'Mon', chats: 45, resolved: 42 },
    { name: 'Tue', chats: 52, resolved: 48 },
    { name: 'Wed', chats: 38, resolved: 35 },
    { name: 'Thu', chats: 61, resolved: 58 },
    { name: 'Fri', chats: 73, resolved: 70 },
    { name: 'Sat', chats: 89, resolved: 85 },
    { name: 'Sun', chats: 67, resolved: 64 }
  ];

  const intentData = [
    { name: 'Room Booking', value: 35, color: '#3B82F6' },
    { name: 'Room Service', value: 28, color: '#10B981' },
    { name: 'Amenities', value: 20, color: '#F59E0B' },
    { name: 'Concierge', value: 12, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' }
  ];

  const responseTimeData = [
    { hour: '00:00', avgTime: 1.2 },
    { hour: '06:00', avgTime: 0.8 },
    { hour: '12:00', avgTime: 2.1 },
    { hour: '18:00', avgTime: 1.9 },
    { hour: '23:00', avgTime: 1.1 }
  ];

  const techStack = [
    { component: 'Frontend', tech: 'React.js + TypeScript', status: 'Production Ready' },
    { component: 'Chat Widget', tech: 'Custom React Components', status: 'Production Ready' },
    { component: 'NLU Engine', tech: 'Rasa Open Source', status: 'Development' },
    { component: 'Dialogue Manager', tech: 'Rasa Core', status: 'Development' },
    { component: 'Backend API', tech: 'Node.js + Express', status: 'Mock Ready' },
    { component: 'Database', tech: 'MongoDB', status: 'Development' },
    { component: 'Analytics', tech: 'Chart.js + React', status: 'Production Ready' },
    { component: 'Deployment', tech: 'Docker + Kubernetes', status: 'Planning' }
  ];

  const developmentRoadmap = [
    { phase: 'Planning & Design', duration: '1 week', progress: 100, tasks: ['Define intents & entities', 'Design conversation flows', 'Create UI mockups'] },
    { phase: 'NLU Development', duration: '2 weeks', progress: 75, tasks: ['Train Rasa model', 'Intent classification', 'Entity extraction'] },
    { phase: 'Backend Integration', duration: '1 week', progress: 60, tasks: ['API endpoints', 'Database schemas', 'Authentication'] },
    { phase: 'UI Implementation', duration: '1 week', progress: 90, tasks: ['Chat interface', 'Responsive design', 'Accessibility'] },
    { phase: 'Analytics Setup', duration: '1 week', progress: 85, tasks: ['Logging system', 'Dashboard creation', 'Metrics collection'] },
    { phase: 'Testing & Demo', duration: '1 week', progress: 40, tasks: ['End-to-end testing', 'Performance optimization', 'Demo preparation'] }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-6 rounded-lg">
                <pre className="text-sm text-slate-700 font-mono whitespace-pre-wrap">
{`┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Chat Widget   │────│   Bot Engine     │────│   Backend APIs  │
│                 │    │                  │    │                 │
│ • React UI      │    │ • NLU (Rasa)     │    │ • Reservations  │
│ • WebSocket     │    │ • Intent Match   │    │ • Guest Profile │
│ • Responsive    │    │ • Context Mgmt   │    │ • Room Service  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Session  │    │   Analytics      │    │   Integrations  │
│                 │    │                  │    │                 │
│ • Guest Context │    │ • Conversation   │    │ • PMS System    │
│ • Preferences   │    │ • Metrics        │    │ • Payment Gateway │
│ • History       │    │ • Dashboards     │    │ • Email/SMS     │
└─────────────────┘    └──────────────────┘    └─────────────────┘`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {techStack.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.component}</p>
                        <p className="text-sm text-gray-600">{item.tech}</p>
                      </div>
                      <Badge variant={item.status === 'Production Ready' ? 'default' : 
                        item.status === 'Development' ? 'secondary' : 'outline'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversation Flows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Room Booking Flow</h4>
                    <p className="text-sm text-gray-600">Check availability → Select dates → Choose room → Confirm booking</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Room Service Flow</h4>
                    <p className="text-sm text-gray-600">Browse menu → Select items → Confirm order → Track delivery</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium">Amenities Info Flow</h4>
                    <p className="text-sm text-gray-600">Query amenity → Show details → Provide directions → Book if needed</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium">Fallback & Escalation</h4>
                    <p className="text-sm text-gray-600">Low confidence → Clarify intent → Suggest alternatives → Human handoff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">1,247</div>
                <p className="text-sm text-gray-600">+12% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">94.2%</div>
                <p className="text-sm text-gray-600">+2.1% improvement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">1.4s</div>
                <p className="text-sm text-gray-600">-0.3s faster</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Chat Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chatMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="chats" fill="#3B82F6" />
                    <Bar dataKey="resolved" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intent Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={intentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {intentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Roadmap (6-Week Timeline)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {developmentRoadmap.map((phase, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{phase.phase}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    <Progress value={phase.progress} className="mb-3" />
                    <p className="text-sm text-gray-600 mb-2">{phase.progress}% Complete</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex}>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sample Rasa Training Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`# nlu.yml
version: "3.1"
nlu:
- intent: greet
  examples: |
    - hello
    - hi there
    - good morning
    - hey
    
- intent: book_room
  examples: |
    - I want to book a room
    - check room availability
    - do you have rooms for [tonight](date)
    - I need a [deluxe](room_type) room
    
- intent: room_service
  examples: |
    - I'd like to order food
    - room service menu
    - can I get [breakfast](meal_type)
    - order [coffee](item) to my room
    
- intent: amenities_info
  examples: |
    - what amenities do you have
    - gym hours
    - is there a [pool](amenity)
    - spa services`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backend API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`// Express.js API Routes
app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  
  // Process with Rasa
  const rasaResponse = await fetch('http://rasa:5005/webhooks/rest/webhook', {
    method: 'POST',
    body: JSON.stringify({ message, sender: sessionId })
  });
  
  const botResponse = await rasaResponse.json();
  
  // Log conversation
  await logConversation(sessionId, message, botResponse);
  
  res.json(botResponse);
});

app.get('/api/rooms/availability', async (req, res) => {
  const { checkIn, checkOut, roomType } = req.query;
  
  // Mock room availability
  const rooms = await checkRoomAvailability(checkIn, checkOut, roomType);
  res.json(rooms);
});

app.post('/api/room-service/order', async (req, res) => {
  const { guestId, items, roomNumber } = req.body;
  
  const order = await createRoomServiceOrder({
    guestId, 
    items, 
    roomNumber,
    timestamp: new Date()
  });
  
  res.json(order);
});`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
      
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/hotel-chatbot
      - RASA_URL=http://rasa:5005
    depends_on:
      - mongo
      - rasa
      
  rasa:
    image: rasa/rasa:3.6.0
    ports:
      - "5005:5005"
    volumes:
      - ./rasa-model:/app
    command: run --enable-api --cors "*"
    
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
      
volumes:
  mongo-data:`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArchitectureDashboard;
