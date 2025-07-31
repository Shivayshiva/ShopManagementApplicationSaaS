"use client";

import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MoreVertical, Phone, Video, Info } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Customer {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the quick response!",
    timestamp: "2 min ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you help me with my order?",
    timestamp: "15 min ago",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "3",
    name: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfect, that solved my issue",
    timestamp: "1 hour ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When will my refund be processed?",
    timestamp: "2 hours ago",
    unreadCount: 3,
    isOnline: false,
  },
  {
    id: "5",
    name: "Alex Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Great service, thank you!",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      senderName: "John Smith",
      content: "Hi, I have a question about my recent order",
      timestamp: "10:30 AM",
      isAdmin: false,
    },
    {
      id: "2",
      senderId: "admin",
      senderName: "Support Admin",
      content:
        "Hello John! I'd be happy to help you with your order. What specific question do you have?",
      timestamp: "10:32 AM",
      isAdmin: true,
    },
    {
      id: "3",
      senderId: "1",
      senderName: "John Smith",
      content: "I haven't received my tracking information yet",
      timestamp: "10:33 AM",
      isAdmin: false,
    },
    {
      id: "4",
      senderId: "admin",
      senderName: "Support Admin",
      content:
        "Let me check that for you right away. Your tracking number is TR123456789 and it should arrive by tomorrow.",
      timestamp: "10:35 AM",
      isAdmin: true,
    },
    {
      id: "5",
      senderId: "1",
      senderName: "John Smith",
      content: "Thanks for the quick response!",
      timestamp: "10:36 AM",
      isAdmin: false,
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "2",
      senderName: "Sarah Johnson",
      content: "Can you help me with my order?",
      timestamp: "9:45 AM",
      isAdmin: false,
    },
  ],
};

export default function ChatPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    mockCustomers[0]
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCustomer) {
      // In a real app, you would send this to your backend
      console.log(
        "Sending message:",
        newMessage,
        "to customer:",
        selectedCustomer.id
      );
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Customer List Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-2 border-b border-gray-200">
          <div className="flex items-baseline py-2 space-x-2">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-gray-800 mb-3">
              Customer Chats
            </h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Customer List */}
        <ScrollArea className="flex-1">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                selectedCustomer?.id === customer.id
                  ? "bg-blue-50 border-l-4 "
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={customer.avatar || "/placeholder.svg"}
                      alt={customer.name}
                    />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {customer.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {customer.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {customer.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {customer.lastMessage}
                    </p>
                    {customer.unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {customer.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedCustomer.avatar || "/placeholder.svg"}
                      alt={selectedCustomer.name}
                    />
                    <AvatarFallback>
                      {selectedCustomer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedCustomer.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedCustomer.isOnline
                      ? "Online"
                      : "Last seen recently"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4">
                {(mockMessages[selectedCustomer.id] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isAdmin ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isAdmin
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isAdmin ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a customer to start chatting
              </h3>
              <p className="text-gray-500">
                Choose a customer from the list to view and respond to their
                messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
