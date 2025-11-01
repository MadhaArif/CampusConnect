import React, { useState, useEffect, useContext, useRef } from 'react';
import { Send, User, Briefcase } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

// Mock data for demonstration
const mockChats = [
  {
    id: 'chat1',
    with: 'Prof. Johnson',
    role: 'finder',
    lastMessage: 'Are you still interested in the UI/UX position?',
    unread: 2,
    messages: [
      { id: 1, sender: 'finder', text: 'Hello! I saw your application for the UI/UX Designer position.', timestamp: '2023-05-10T10:30:00' },
      { id: 2, sender: 'seeker', text: 'Yes, I am very interested in this opportunity!', timestamp: '2023-05-10T10:35:00' },
      { id: 3, sender: 'finder', text: 'Great! Do you have experience with Figma?', timestamp: '2023-05-10T10:40:00' },
      { id: 4, sender: 'seeker', text: 'Yes, I have been using Figma for 2 years now.', timestamp: '2023-05-10T10:45:00' },
      { id: 5, sender: 'finder', text: 'Perfect! When can you start?', timestamp: '2023-05-10T10:50:00' },
      { id: 6, sender: 'finder', text: 'Are you still interested in the UI/UX position?', timestamp: '2023-05-10T14:20:00' },
    ]
  },
  {
    id: 'chat2',
    with: 'Tech Club',
    role: 'finder',
    lastMessage: 'Your application has been shortlisted!',
    unread: 0,
    messages: [
      { id: 1, sender: 'finder', text: 'Hi there! Thanks for applying to our hackathon team.', timestamp: '2023-05-08T09:30:00' },
      { id: 2, sender: 'seeker', text: 'Thank you for considering my application!', timestamp: '2023-05-08T09:35:00' },
      { id: 3, sender: 'finder', text: 'Your application has been shortlisted!', timestamp: '2023-05-09T11:20:00' },
    ]
  },
  {
    id: 'chat3',
    with: 'EcoTech Startup',
    role: 'finder',
    lastMessage: 'Can you share some of your previous work?',
    unread: 1,
    messages: [
      { id: 1, sender: 'finder', text: 'Hello! We are interested in your profile for our marketing position.', timestamp: '2023-05-07T15:30:00' },
      { id: 2, sender: 'seeker', text: 'That sounds great! I would love to know more about the role.', timestamp: '2023-05-07T15:40:00' },
      { id: 3, sender: 'finder', text: 'Can you share some of your previous work?', timestamp: '2023-05-07T16:00:00' },
    ]
  }
];

const ChatSystem = () => {
  const { userRole, userProfile } = useContext(AppContext);
  const [chats, setChats] = useState(mockChats);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
      // Mark messages as read when chat is selected
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat.id ? { ...chat, unread: 0 } : chat
        )
      );
    }
  }, [selectedChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: userRole,
      text: message,
      timestamp: new Date().toISOString()
    };

    // Update the selected chat with the new message
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setMessage('');
    
    // In a real app, you would send this message to a backend service
    toast.success('Message sent!');
    
    // Simulate receiving a response after a delay (for demo purposes)
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        sender: selectedChat.role,
        text: `Thanks for your message! This is an automated reply for demo purposes.`,
        timestamp: new Date().toISOString()
      };
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat.id 
            ? { 
                ...chat, 
                messages: [...chat.messages, autoReply],
                lastMessage: autoReply.text,
                unread: userRole === 'seeker' ? chat.unread + 1 : chat.unread
              } 
            : chat
        )
      );
    }, 1000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Chat list sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <p className="text-sm text-gray-500">Connect with opportunities</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {chats.map(chat => (
            <div 
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    {chat.role === 'finder' ? <Briefcase size={18} /> : <User size={18} />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{chat.with}</h3>
                    <p className="text-sm text-gray-500 truncate w-40">{chat.lastMessage}</p>
                  </div>
                </div>
                {chat.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="hidden md:flex flex-col flex-1 bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                {selectedChat.role === 'finder' ? <Briefcase size={18} /> : <User size={18} />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedChat.with}</h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.role === 'finder' ? 'Talent Finder' : 'Talent Seeker'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedChat.messages.map((msg, index) => {
                // Show date if first message or different day from previous message
                const showDate = index === 0 || 
                  formatDate(msg.timestamp) !== formatDate(selectedChat.messages[index-1].timestamp);
                
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={`flex mb-4 ${msg.sender === userRole ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.sender === userRole 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === userRole ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <Send size={48} className="mb-4" />
            <p className="text-xl font-medium">Select a conversation</p>
            <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;