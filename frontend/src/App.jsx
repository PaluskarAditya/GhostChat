import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

export default function App() {
  const nav = useNavigate();

  return (
    <div className="h-screen overflow-hidden bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center mx-auto">
        {/* Logo with ghost theme */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-600"></div>
              </div>
            </div>
            <div className="absolute -bottom-1 left-0 right-0 flex justify-center">
              <div className="w-16 h-3 bg-gray-800 rounded-b-full"></div>
            </div>
          </div>
        </div>
        
        {/* App name with subtle glow */}
        <h1 className="text-3xl font-bold text-gray-100 mb-2 tracking-tighter">
          Chat<span className="text-purple-400">Ghost</span>
        </h1>
        
        {/* Tagline */}
        <p className="text-gray-400 mb-8 text-sm tracking-wide">
          Anonymous Chats • Disappear Fast • No Traces
        </p>
        
        {/* Action button with hover effect */}
        <button onClick={() => nav(`/chat?id=${nanoid(8)}`)} className="w-full max-w-xs mx-auto py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
          Start Anonymous Chat
        </button>
        
        {/* Subtle disclaimer */}
        <p className="text-gray-500 text-xs mt-8">
          Messages vanish after reading. No logs kept.
        </p>
      </div>
    </div>
  );
}