import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

// Mock responses for the sloth chatbot
const slothResponses = {
  greetings: [
    "Hello... I'm... Sammy... the... Sloth... Welcome... to... Sloth... Park...",
    "Hi... there... I'm... here... to... help... you... learn... about... Sloth... Park...",
    "Welcome... friend... to... the... slowest... place... on... Earth..."
  ],
  about: [
    "Sloth... Park... is... a... sanctuary... for... sloths... from... around... the... world... We... have... over... 25... different... sloths... here...",
    "Our... park... was... founded... in... 2015... to... protect... and... preserve... sloth... habitats... and... educate... visitors..."
  ],
  tours: [
    "We... offer... three... tours... The... Canopy... Crawl... The... Slow... Safari... and... The... Night... Watcher... All... tours... include... a... sloth... encounter...",
    "Our... most... popular... tour... is... The... Canopy... Crawl... where... you... can... see... sloths... in... their... natural... habitat... high... in... the... trees..."
  ],
  hours: [
    "We're... open... daily... from... 9am... to... 5pm... Last... tour... starts... at... 3:30pm...",
    "The... Night... Watcher... tour... runs... on... Fridays... and... Saturdays... from... 7pm... to... 9pm..."
  ],
  tickets: [
    "Tickets... are... $25... for... adults... $15... for... children... under... 12... and... free... for... children... under... 3...",
    "You... can... book... tickets... online... or... at... the... entrance... We... recommend... booking... in... advance... especially... for... weekend... visits..."
  ],
  facts: [
    "Did... you... know... sloths... sleep... for... 15... to... 20... hours... every... day?",
    "Sloths... are... excellent... swimmers... and... can... hold... their... breath... underwater... for... up... to... 40... minutes...",
    "Sloths... move... so... slowly... that... algae... grows... on... their... fur... giving... them... a... greenish... appearance...",
    "A... sloth... can... turn... its... head... almost... 180... degrees...",
    "Sloths... only... come... down... from... trees... once... a... week... to... use... the... bathroom..."
  ],
  default: [
    "I'm... thinking... very... slowly... about... that... Can... you... ask... about... our... tours... or... sloth... facts?",
    "Hmm... that's... an... interesting... question... I... know... most... about... Sloth... Park... tours... and... sloth... facts...",
    "I'm... not... sure... about... that... Would... you... like... to... know... about... our... visiting... hours... or... ticket... prices?"
  ]
};

// Function to get a response based on the user's message
const getSlothResponse = (message: string) => {
  const lowerMessage = message.toLowerCase();
  
  // Simulate slow typing by adding delays
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return getRandomResponse(slothResponses.greetings);
  } else if (lowerMessage.includes('about') || lowerMessage.includes('what is') || lowerMessage.includes('tell me about')) {
    return getRandomResponse(slothResponses.about);
  } else if (lowerMessage.includes('tour') || lowerMessage.includes('visit')) {
    return getRandomResponse(slothResponses.tours);
  } else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
    return getRandomResponse(slothResponses.hours);
  } else if (lowerMessage.includes('ticket') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return getRandomResponse(slothResponses.tickets);
  } else if (lowerMessage.includes('fact') || lowerMessage.includes('know') || lowerMessage.includes('tell me')) {
    return getRandomResponse(slothResponses.facts);
  } else {
    return getRandomResponse(slothResponses.default);
  }
};

// Get a random response from an array
const getRandomResponse = (responses: string[]) => {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// Message type for chat
interface Message {
  text: string;
  sender: 'user' | 'sloth';
  isTyping?: boolean;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with a greeting when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      const initialMessage = getRandomResponse(slothResponses.greetings);
      
      // Simulate slow typing
      let displayedText = '';
      let charIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (charIndex < initialMessage.length) {
          displayedText += initialMessage[charIndex];
          setMessages([{ text: displayedText, sender: 'sloth', isTyping: true }]);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setMessages([{ text: initialMessage, sender: 'sloth' }]);
          setIsTyping(false);
        }
      }, 100);
      
      return () => clearInterval(typingInterval);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (input.trim() === '' || isTyping) return;
    
    // Add user message
    const userMessage = { text: input, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Get sloth response
    const slothResponse = getSlothResponse(input);
    setIsTyping(true);
    
    // Simulate slow typing for sloth
    let displayedText = '';
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < slothResponse.length) {
        displayedText += slothResponse[charIndex];
        setMessages(prev => [...prev.slice(0, -1), userMessage, { text: displayedText, sender: 'sloth', isTyping: true }]);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setMessages(prev => [...prev.slice(0, -1), userMessage, { text: slothResponse, sender: 'sloth' }]);
        setIsTyping(false);
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1580458148391-8c4951dc1465?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-green-800 bg-opacity-80 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="https://i.imgur.com/Ql4iOgH.png" 
                alt="Arenal Jungle Tours Logo" 
                className="h-12 mr-3"
              />
              <h1 className="text-3xl font-bold flex items-center">
                <span className="mr-2">🦥</span> Sloth Park
              </h1>
            </div>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center transition-all duration-300"
            >
              <MessageSquare className="mr-2" size={18} />
              Chat with Sammy the Sloth
            </button>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="container mx-auto flex-grow p-6">
          <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-green-800">Welcome to Sloth Park</h2>
              <img 
                src="https://i.imgur.com/Ql4iOgH.png" 
                alt="Arenal Jungle Tours Logo" 
                className="h-16"
              />
            </div>
            <p className="text-lg mb-6">
              Experience the magical world of sloths in their natural habitat. Our sanctuary is home to over 25 sloths from around the world, providing a safe environment for these amazing creatures.
            </p>
            
            <h3 className="text-2xl font-bold text-green-700 mb-4">Our Tours</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-100 p-4 rounded-lg shadow">
                <h4 className="text-xl font-bold text-green-800 mb-2">The Canopy Crawl</h4>
                <p>Observe sloths in their natural habitat high in the trees. Our elevated walkways give you a sloth's-eye view of the forest.</p>
                <p className="mt-2 font-semibold">Duration: 2 hours</p>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg shadow">
                <h4 className="text-xl font-bold text-green-800 mb-2">The Slow Safari</h4>
                <p>A guided ground tour through our sanctuary with multiple sloth viewing stations and educational presentations.</p>
                <p className="mt-2 font-semibold">Duration: 1.5 hours</p>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg shadow">
                <h4 className="text-xl font-bold text-green-800 mb-2">The Night Watcher</h4>
                <p>Experience the nocturnal activities of sloths with our special evening tour. Limited availability.</p>
                <p className="mt-2 font-semibold">Duration: 2 hours</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-green-700 mb-4">Visitor Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <h4 className="text-xl font-bold text-green-800 mb-2">Hours</h4>
                <p>Open daily: 9am - 5pm</p>
                <p>Last tour starts: 3:30pm</p>
                <p>Night tours: Fridays & Saturdays, 7pm - 9pm</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <h4 className="text-xl font-bold text-green-800 mb-2">Admission</h4>
                <p>Adults: $25</p>
                <p>Children (4-12): $15</p>
                <p>Children under 3: Free</p>
                <p className="mt-2 italic">All proceeds go toward sloth conservation efforts.</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <img 
                  src="https://i.imgur.com/Ql4iOgH.png" 
                  alt="Arenal Jungle Tours Logo" 
                  className="h-10 mr-3"
                />
                <h3 className="text-xl font-bold text-green-800">Proudly operated by Arenal Jungle Tours</h3>
              </div>
              <p>
                Sloth Park is a proud member of the Arenal Jungle Tours family. With over 15 years of experience in eco-tourism, 
                we're committed to providing unforgettable wildlife experiences while supporting conservation efforts throughout Costa Rica.
              </p>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-green-900 text-white p-4 mt-auto">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src="https://i.imgur.com/Ql4iOgH.png" 
                  alt="Arenal Jungle Tours Logo" 
                  className="h-10 mr-3 bg-white p-1 rounded"
                />
                <div>
                  <p className="font-bold">© 2025 Sloth Park - An Arenal Jungle Tours Experience</p>
                  <p className="text-sm">123 Rainforest Way, Slothville, Costa Rica</p>
                </div>
              </div>
              <div className="text-right">
                <p>Contact: info@slothpark.com</p>
                <p>Phone: +506 2479-1234</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Sloth Chat Widget */}
      {isOpen && (
        <div className="fixed top-20 right-4 w-80 md:w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[80vh]">
          <div className="bg-green-700 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🦥</span>
              <span className="font-bold">Sammy the Sloth</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-green-200">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 max-h-[50vh]">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                  {message.isTyping && <span className="animate-pulse">...</span>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Sloth Park..."
                className="flex-grow border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || input.trim() === ''}
                className={`bg-green-600 text-white px-4 py-2 rounded-r-lg ${
                  isTyping || input.trim() === '' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-green-700'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            {isTyping && (
              <p className="text-xs text-gray-500 mt-1">Sammy is typing slowly...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;