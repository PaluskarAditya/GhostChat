import { useEffect, useState, useRef } from "react";
import socket from "./../utils/socket";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false); // Hidden by default on mobile
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Check user's preferred color scheme
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");

  // Generate the room URL
  const roomUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(roomUrl)}`;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isJoined) {
      socket.emit("joinRoom", { id, userId: socket.id });
      setIsJoined(true);
    }

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleRoomJoin = ({ userId }) => {
      if (userId !== socket.id) {
        setParticipants(prev => [...prev, userId]);
        toast(`User joined`, {
          description: "A new participant has entered the chat",
          action: {
            label: "View",
            onClick: () => setShowSidebar(true)
          }
        });
      }
    };

    const handleRoomLeave = ({ userId }) => {
      setParticipants(prev => prev.filter(id => id !== userId));
      toast(`User left`, {
        description: "A participant has left the chat"
      });
    };

    socket.on("message", handleMessage);
    socket.on("roomJoined", handleRoomJoin);
    socket.on("roomLeft", handleRoomLeave);

    return () => {
      socket.off("message", handleMessage);
      socket.off("roomJoined", handleRoomJoin);
      socket.off("roomLeft", handleRoomLeave);
    };
  }, [id, isJoined]);

  const handleSend = (e) => {
    e.preventDefault();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msg = {
      id: socket.id,
      text,
      room: id,
      time,
    };

    if (text.trim()) {
      socket.emit("message", msg);
      setText("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomUrl);
    toast.success("Room link copied to clipboard");
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            CG
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">ChatGhost</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Room: {id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors sm:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <main className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? 'sm:mr-80' : ''}`}>
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No messages yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Start the conversation by sending your first message. All messages are ephemeral and disappear after reading.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.id === socket.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.id === socket.id
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div className="text-sm">{msg.text}</div>
                    <div className={`text-xs mt-1 flex items-center ${msg.id === socket.id ? 'text-indigo-200 justify-end' : 'text-gray-500 dark:text-gray-400 justify-start'}`}>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full py-2 sm:py-3 px-4 sm:px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm dark:bg-gray-700 dark:text-white"
                  placeholder="Type a message..."
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="absolute right-2 bg-indigo-600 text-white p-1 sm:p-2 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Sidebar - Mobile overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`w-full sm:w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full fixed sm:relative right-0 top-0 bottom-0 z-30 transform ${showSidebar ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'} transition-transform duration-200 ease-in-out`}>
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Room Details</h2>
            <button 
              onClick={() => setShowSidebar(false)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 sm:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Share Room</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={roomUrl}
                    readOnly
                    className="w-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-3 pr-10 rounded-lg text-sm font-mono border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-2 p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Participants ({participants.length + 1})</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-800 dark:text-indigo-200 font-medium">
                      You
                    </div>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">You</div>
                </div>
                {participants.map((participant, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="relative">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-gray-200 font-medium">
                        {participant.substring(0, 2)}
                      </div>
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Anonymous #{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}