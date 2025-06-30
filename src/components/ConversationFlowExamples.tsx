import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Bot, ChevronDown, ChevronRight, MessageCircle, Clock } from 'lucide-react';

interface DialogueTurn {
  speaker: 'user' | 'bot';
  message: string;
  intent?: string;
  confidence?: number;
  slots?: Record<string, any>;
  context?: Record<string, any>;
  outcome?: string;
}

interface ConversationFlow {
  id: string;
  title: string;
  description: string;
  scenario: string;
  turns: DialogueTurn[];
  outcome: string;
  category: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
}

const ConversationFlowExamples = () => {
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  const conversationFlows: ConversationFlow[] = [
    {
      id: "booking_flow",
      title: "Complete Room Booking Journey",
      description: "Guest discovers availability, compares options, and completes booking",
      scenario: "First-time guest looking for weekend accommodation",
      complexity: "Complex",
      category: "Booking",
      outcome: "Successful reservation with confirmation email sent",
      turns: [
        {
          speaker: "user",
          message: "Hi, do you have any rooms available this weekend?",
          intent: "CheckRoomAvailability"
        },
        {
          speaker: "bot",
          message: "Hello! I'd be delighted to help you find the perfect room for this weekend. Let me check our availability... \n\nWonderful news! We have several beautiful options available for this Saturday and Sunday:\n\n🌊 **Sea View Deluxe** - $349/night\n• King bed, ocean balcony, complimentary champagne\n\n🏙️ **City View Premium** - $299/night\n• Queen bed, city skyline views, work desk\n\n🌿 **Garden Suite** - $449/night\n• Separate living area, private terrace, butler service\n\nAll rates include breakfast, WiFi, and gym access. How many guests will be staying?",
          context: { available_rooms: 3, dates: "this weekend" }
        },
        {
          speaker: "user",
          message: "Just 2 guests. The sea view room sounds perfect! What's included?"
        },
        {
          speaker: "bot",
          message: "Excellent choice! The Sea View Deluxe is absolutely stunning. Here's what's included with your stay:\n\n✨ **Room Features:**\n• Spacious king bed with premium linens\n• Private balcony overlooking the ocean\n• Marble bathroom with rainfall shower\n• Mini-bar with complimentary champagne\n• 55\" smart TV and high-speed WiFi\n\n🍳 **Included Services:**\n• Gourmet breakfast buffet (6-11 AM)\n• 24/7 room service\n• Concierge services\n• Fitness center and pool access\n• Valet parking\n\nThe total for both nights would be $698 plus taxes. Shall I reserve this beautiful room for you?",
          slots: { room_type: "Sea View Deluxe", guests: 2, total_cost: "$698" }
        },
        {
          speaker: "user",
          message: "Yes, let's book it! My name is Sarah Johnson."
        },
        {
          speaker: "bot",
          message: "Wonderful, Sarah! I'm so excited to welcome you to our hotel. To complete your reservation, I'll need just a few more details:\n\n📧 **Email address** (for confirmation)\n📱 **Phone number** \n💳 **Credit card** (to secure the booking)\n\nAny special requests for your stay? Perhaps celebrating something special? I'd love to make it memorable!",
          intent: "BookRoom",
          slots: { guest_name: "Sarah Johnson" }
        },
        {
          speaker: "user",
          message: "Email is sarah.j@email.com and phone is 555-0123. It's actually our anniversary!"
        },
        {
          speaker: "bot",
          message: "How absolutely wonderful - congratulations on your anniversary, Sarah! 🎉 This makes your stay even more special.\n\nI've noted your details and I'm arranging some lovely anniversary touches:\n• Rose petals and champagne in your room upon arrival\n• Priority dinner reservation at our rooftop restaurant\n• Late checkout until 2 PM (complimentary)\n\nI just need your credit card information to secure the booking, and then you'll receive a confirmation email with all the details. You can provide the card details securely when you arrive, or I can transfer you to our secure booking system now. Which would you prefer?",
          context: { special_occasion: "anniversary", upgrades_added: true }
        },
        {
          speaker: "user",
          message: "I'll provide it when I arrive, that's perfect."
        },
        {
          speaker: "bot",
          message: "Perfect, Sarah! Your Sea View Deluxe room is reserved for this weekend. Here's your booking summary:\n\n📋 **Reservation Confirmed**\n• Guest: Sarah Johnson\n• Room: Sea View Deluxe with ocean balcony\n• Dates: This Saturday & Sunday\n• Rate: $349/night ($698 total + taxes)\n• Special: Anniversary package included ❤️\n\n📧 You'll receive a detailed confirmation email at sarah.j@email.com within the next few minutes.\n\n🏨 **Check-in:** Saturday 3:00 PM\n🔑 **Your confirmation number:** #LUX2024-SJ789\n\nI can't wait to welcome you both for your special celebration! Is there anything else I can help you prepare for your anniversary weekend?",
          outcome: "Booking completed successfully"
        }
      ]
    },
    {
      id: "room_service_flow",
      title: "Room Service Order with Dietary Preferences",
      description: "Guest orders breakfast with special dietary requirements",
      scenario: "Hotel guest ordering breakfast with allergies",
      complexity: "Medium",
      category: "Service",
      outcome: "Order placed successfully with special dietary accommodations",
      turns: [
        {
          speaker: "user",
          message: "I'd like to order breakfast to my room please"
        },
        {
          speaker: "bot",
          message: "Good morning! I'd be absolutely delighted to arrange breakfast for you. Our culinary team creates exceptional morning dishes. \n\n🍳 **Signature Breakfast Menu:**\n\n**Continental Delight** - $32\n• Fresh croissants, seasonal fruits, Greek yogurt\n• Artisan coffee or premium tea selection\n\n**Royal English Breakfast** - $38\n• Farm-fresh eggs (any style), premium bacon\n• Grilled tomatoes, sautéed mushrooms, hash browns\n• Choice of toast with preserves\n\n**Healthy Paradise Bowl** - $28\n• Quinoa, fresh berries, almond butter\n• Coconut yogurt, chia seeds, local honey\n\nWhat sounds delicious to you? Also, may I have your room number?",
          intent: "RoomServiceOrder"
        },
        {
          speaker: "user",
          message: "Room 412. The English breakfast sounds great, but I'm allergic to mushrooms"
        },
        {
          speaker: "bot",
          message: "Absolutely, I've noted you're in room 412 and that you have a mushroom allergy - our chef will ensure no mushrooms are included or have any cross-contamination in your meal preparation.\n\nFor your Royal English Breakfast, I'll have them substitute the sautéed mushrooms with:\n• Extra grilled tomatoes\n• Perfectly seasoned roasted potatoes\n• Or fresh avocado slices\n\nWhich substitution sounds best to you? And how would you like your eggs prepared - scrambled, fried, poached, or over easy?",
          slots: { room_number: "412", dietary_restriction: "mushroom allergy" }
        },
        {
          speaker: "user",
          message: "Roasted potatoes and scrambled eggs please. And coffee."
        },
        {
          speaker: "bot",
          message: "Perfect choice! Here's your customized breakfast order:\n\n🍳 **Royal English Breakfast** - $38\n• Fluffy scrambled eggs\n• Premium bacon, grilled tomatoes\n• Seasoned roasted potatoes (no mushrooms)\n• Choice of toast with preserves\n• Freshly brewed coffee\n\n📍 **Delivery to:** Room 412\n⏰ **Estimated delivery:** 25-30 minutes\n🚫 **Allergy note:** No mushrooms (kitchen notified)\n\nI'll also include our selection of artisan jams and fresh butter. Your total is $38 plus service charge. \n\nShall I place this order for you? The kitchen will prepare everything fresh and our server will bring it up with a smile!",
          context: { order_total: "$38", delivery_time: "25-30 minutes" }
        },
        {
          speaker: "user",
          message: "Yes please, that sounds perfect!"
        },
        {
          speaker: "bot",
          message: "Wonderful! Your breakfast order is confirmed and heading to our kitchen now. 🍳\n\n📋 **Order Summary:**\n• Room 412 - Royal English Breakfast (no mushrooms)\n• Scrambled eggs, bacon, tomatoes, roasted potatoes\n• Fresh coffee and toast selection\n• Order #RS-412-0892\n\n⏰ **Delivery:** 25-30 minutes\n💰 **Total:** $38 + service charge (charged to room)\n\nOur chef is personally ensuring your meal is prepared safely with no mushroom contact. You'll receive a call from room service when we're on our way up.\n\nIs there anything else I can arrange for you this morning? Perhaps fresh orange juice or today's newspaper?",
          outcome: "Order placed successfully with dietary accommodations"
        }
      ]
    },
    {
      id: "complaint_resolution",
      title: "Complaint Handling with Escalation",
      description: "Guest reports room issue, receives empathetic response and immediate resolution",
      scenario: "Guest experiencing room maintenance issue",
      complexity: "Medium",
      category: "Support",
      outcome: "Issue resolved with compensation and guest satisfaction restored",
      turns: [
        {
          speaker: "user",
          message: "Hi, I'm having an issue with my room. The air conditioning isn't working and it's really hot."
        },
        {
          speaker: "bot",
          message: "Oh my goodness, I am so sorry to hear about this issue with your air conditioning! That's absolutely not the comfortable experience we want you to have, especially during your stay with us. \n\nI completely understand how uncomfortable and frustrating this must be for you. Let me take immediate action to fix this:\n\n🔧 **Immediate Steps:**\n• I'm alerting our maintenance team right now - they'll be up within 10 minutes\n• I'm also notifying our Guest Relations manager\n\nMay I have your room number so I can prioritize this emergency repair? \n\nWhile we get this resolved quickly, would you like me to arrange a temporary room change, or send up a portable fan and some complimentary refreshments to make you more comfortable?",
          intent: "SubmitComplaint",
          slots: { issue_type: "air conditioning", urgency: "high" }
        },
        {
          speaker: "user",
          message: "Room 318. A fan would be great while they fix it."
        },
        {
          speaker: "bot",
          message: "Thank you, I have you in room 318. I've immediately dispatched:\n\n⚡ **Emergency Response:**\n• Senior maintenance technician en route (ETA: 8 minutes)\n• Portable fan being brought up now (ETA: 5 minutes)\n• Complimentary ice-cold beverages and fresh towels\n\n🎁 **Apology Gesture:**\nAs a sincere apology for this inconvenience, I'd like to offer:\n• Complimentary room service dinner tonight (up to $75)\n• Late checkout tomorrow at no charge\n• Spa credit for our wellness center\n\nI'm also having our Guest Relations manager, Maria, personally follow up with you within the hour to ensure everything is resolved to your complete satisfaction.\n\nIs there anything else I can do to make you more comfortable right now?",
          context: { maintenance_dispatched: true, compensation_offered: true }
        },
        {
          speaker: "user",
          message: "That's very generous, thank you. I appreciate the quick response."
        },
        {
          speaker: "bot",
          message: "You're so very welcome! Your comfort and satisfaction are our absolute priority, and I'm grateful for your patience while we make this right.\n\n✅ **Status Update:**\n• Maintenance should be at your door any moment\n• Fan delivery in the next 2-3 minutes\n• I'll personally monitor this repair until completion\n\n📱 **Direct Contact:**\nI'm giving you my direct service line: Extension 2205\nCall me immediately if you need anything else or if the repair takes longer than expected.\n\n🌟 **Follow-up:**\nMaria from Guest Relations will check with you in 30 minutes to ensure everything is working perfectly.\n\nThank you for giving us the chance to make this right. We truly value you as our guest and want the rest of your stay to be absolutely wonderful!",
          outcome: "Issue escalated properly with immediate response and compensation"
        }
      ]
    },
    {
      id: "late_checkout_flow",
      title: "Late Checkout Request and Confirmation",
      description: "Guest requests extended checkout time with options and confirmation",
      scenario: "Business traveler needing flexibility",
      complexity: "Simple",
      category: "Service",
      outcome: "Late checkout confirmed with clear terms",
      turns: [
        {
          speaker: "user",
          message: "Can I get late checkout? My flight isn't until evening."
        },
        {
          speaker: "bot",
          message: "Of course! I'd be happy to arrange late checkout for you. Travel days can be so stressful, and we want to make yours as smooth as possible.\n\n⏰ **Late Checkout Options:**\n\n**Until 2:00 PM** - Complimentary\n• Perfect for afternoon departures\n• No additional charge\n\n**Until 4:00 PM** - $50\n• Extended comfort for evening flights\n• Includes room refresh service\n\n**Until 6:00 PM** - $75\n• Full day rate applies after 6 PM\n• Subject to availability\n\nSince you mentioned an evening flight, the 4 PM option might be perfect! What time works best for your schedule?",
          intent: "RequestLateCheckout"
        },
        {
          speaker: "user",
          message: "4 PM would be perfect, that gives me plenty of time."
        },
        {
          speaker: "bot",
          message: "Excellent choice! Late checkout until 4:00 PM is confirmed for you. \n\n✅ **Confirmation Details:**\n• **Extended checkout:** Until 4:00 PM today\n• **Fee:** $50 (charged to your room)\n• **Room refresh:** Included (fresh towels & tidy-up at 1 PM)\n• **Baggage storage:** Available after checkout if needed\n\n🎯 **Travel Day Perks:**\nI've also arranged:\n• Express checkout (no need to stop at front desk)\n• Complimentary airport shuttle reservation priority\n• Late morning coffee & pastry delivery if you'd like\n\nYour room key will remain active until 4 PM. If your travel plans change and you need to adjust, just let me know - we're here to help make your departure stress-free!\n\nWould you like me to arrange anything else for your travel day?",
          slots: { checkout_time: "4:00 PM", fee: "$50" },
          outcome: "Late checkout confirmed with additional services offered"
        }
      ]
    },
    {
      id: "amenities_upsell",
      title: "Amenities Inquiry with Service Upsell",
      description: "Guest asks about facilities and receives detailed info with upgrade opportunities",
      scenario: "Leisure guest exploring hotel amenities",
      complexity: "Simple",
      category: "Information",
      outcome: "Guest informed about amenities with successful spa booking upsell",
      turns: [
        {
          speaker: "user",
          message: "What amenities do you have? I'm interested in relaxation options."
        },
        {
          speaker: "bot",
          message: "Perfect timing for relaxation! Our hotel is designed to be your personal wellness retreat. Here are our premium amenities:\n\n🧘‍♀️ **Serenity Spa & Wellness Center** (2nd Floor)\n• Full-service spa with massage therapy\n• Aromatherapy treatments, hot stone massages\n• Couples massage suites available\n• Hours: 6 AM - 10 PM\n\n🏊‍♀️ **Infinity Rooftop Pool** (25th Floor)\n• Heated saltwater pool with city views\n• Poolside bar service until 9 PM\n• Private cabanas available for booking\n• Hours: 6 AM - 11 PM\n\n🏋️‍♂️ **Platinum Fitness Center** (Ground Floor)\n• State-of-the-art equipment, personal trainers\n• Yoga studio with daily classes\n• Meditation room for quiet reflection\n• Open 24/7\n\nSince you're focused on relaxation, would you like me to check spa availability? We have a special \"Sunset Serenity\" package that's absolutely divine!",
          intent: "AskAboutAmenities"
        },
        {
          speaker: "user",
          message: "The spa sounds amazing! What's the Sunset Serenity package?"
        },
        {
          speaker: "bot",
          message: "Oh, you're going to love this! The Sunset Serenity package is our most popular relaxation experience:\n\n🌅 **Sunset Serenity Package** - $195 (Save $45!)\n\n**Includes:**\n• 60-minute Swedish or deep tissue massage\n• 30-minute aromatherapy facial\n• Access to our private relaxation lounge\n• Champagne and chocolate-covered strawberries\n• Complimentary use of sauna and steam room\n\n⏰ **Perfect Timing:**\n• 3-hour experience starting at 4 PM or 6 PM\n• Ends perfectly for dinner at our rooftop restaurant\n• Available today with one spot left at 6 PM!\n\n🎁 **Bonus:** Since you're a hotel guest, I can include a 20% discount on any additional spa services.\n\nThis package usually books days in advance, but I can secure that 6 PM slot for you right now. Would you like me to reserve it?",
          context: { upsell_opportunity: "spa_package", discount_available: true }
        },
        {
          speaker: "user",
          message: "That sounds perfect! Yes, please book the 6 PM slot."
        },
        {
          speaker: "bot",
          message: "Wonderful choice! You're going to have the most relaxing evening. ✨\n\n📋 **Spa Reservation Confirmed:**\n• **Package:** Sunset Serenity at 6:00 PM today\n• **Duration:** 3 hours of pure bliss\n• **Price:** $195 (includes 20% guest discount)\n• **Confirmation:** SPA-SS-6024\n\n📍 **What to Know:**\n• Arrive 15 minutes early for check-in\n• Spa is located on the 2nd floor (elevator or stairs from lobby)\n• Robes, slippers, and all amenities provided\n• Lockers available for your belongings\n\n🍽️ **Perfect Evening Plan:**\nAfter your spa experience (ending around 9 PM), our rooftop restaurant will still be serving. Would you like me to make a dinner reservation for around 9:15 PM? The sunset views are spectacular!\n\nYou're all set for the ultimate relaxation experience!",
          outcome: "Successful spa package booking with additional dining upsell opportunity"
        }
      ]
    }
  ];

  const toggleFlow = (flowId: string) => {
    setExpandedFlow(expandedFlow === flowId ? null : flowId);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <span>Multi-Turn Conversation Flows</span>
          </CardTitle>
          <p className="text-gray-600">
            Realistic dialogue examples showing natural, contextual conversations
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversationFlows.map((flow) => (
              <div key={flow.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleFlow(flow.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{flow.title}</h3>
                      <Badge className={getComplexityColor(flow.complexity)}>
                        {flow.complexity}
                      </Badge>
                      <Badge variant="outline">{flow.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{flow.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {flow.turns.length} turns
                      </span>
                      <span>Scenario: {flow.scenario}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedFlow === flow.id ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
                
                {expandedFlow === flow.id && (
                  <div className="p-4 border-t">
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-1">Expected Outcome</h4>
                      <p className="text-sm text-blue-700">{flow.outcome}</p>
                    </div>
                    
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      {flow.turns.map((turn, index) => (
                        <div
                          key={index}
                          className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[85%] ${
                            turn.speaker === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              turn.speaker === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                            }`}>
                              {turn.speaker === 'user' ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Bot className="w-4 h-4" />
                              )}
                            </div>
                            <div className={`p-3 rounded-2xl ${
                              turn.speaker === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white border border-gray-200 rounded-bl-sm shadow-sm'
                            }`}>
                              <div className="whitespace-pre-line text-sm">
                                {turn.message}
                              </div>
                              
                              {turn.speaker === 'bot' && (turn.intent || turn.slots || turn.context || turn.outcome) && (
                                <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                                  {turn.intent && (
                                    <Badge variant="outline" className="text-xs mr-1">
                                      Intent: {turn.intent}
                                    </Badge>
                                  )}
                                  {turn.confidence && (
                                    <Badge variant="secondary" className="text-xs mr-1">
                                      {(turn.confidence * 100).toFixed(0)}%
                                    </Badge>
                                  )}
                                  {(turn.slots || turn.context) && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {turn.slots && (
                                        <div>Slots: {JSON.stringify(turn.slots, null, 2)}</div>
                                      )}
                                      {turn.context && (
                                        <div>Context: {JSON.stringify(turn.context, null, 2)}</div>
                                      )}
                                    </div>
                                  )}
                                  {turn.outcome && (
                                    <div className="text-xs text-green-700 font-semibold mt-1">
                                      Outcome: {turn.outcome}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationFlowExamples;
