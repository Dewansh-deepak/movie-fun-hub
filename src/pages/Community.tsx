import { useState } from "react";
import { Users, MessageCircle, Lock, Crown } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

const mockRooms = [
  {
    id: "1",
    name: "Drama Kings 👑",
    members: 2453,
    lastMessage: "Just posted a new emotional scene!",
    isLocked: false,
    avatar: "🎭",
  },
  {
    id: "2",
    name: "Horror Creators 👻",
    members: 1876,
    lastMessage: "Who's up for a collab?",
    isLocked: false,
    avatar: "😱",
  },
  {
    id: "3",
    name: "Comedy Central 😂",
    members: 5234,
    lastMessage: "That skit was hilarious!",
    isLocked: false,
    avatar: "🤣",
  },
  {
    id: "4",
    name: "Romance Club 💕",
    members: 3102,
    lastMessage: "New couple video trending...",
    isLocked: false,
    avatar: "💘",
  },
  {
    id: "5",
    name: "VIP Creators 💎",
    members: 156,
    lastMessage: "Exclusive tips inside",
    isLocked: true,
    avatar: "💎",
  },
];

const Community = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className="pt-16 pb-20">
        <div className="px-4 py-4">
          <h1 className="font-display text-2xl text-gradient">
            Creator Community
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with fellow creators
          </p>
        </div>

        <div className="px-4 space-y-3">
          {mockRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => !room.isLocked && setSelectedRoom(room.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                room.isLocked 
                  ? "bg-muted/50 opacity-75" 
                  : "bg-card hover:bg-muted"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-instagram flex items-center justify-center text-2xl">
                {room.avatar}
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{room.name}</span>
                  {room.isLocked && (
                    <Lock className="w-4 h-4 text-gold" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {room.lastMessage}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Users className="w-3 h-3" />
                  <span>{room.members.toLocaleString()} members</span>
                </div>
              </div>

              {room.isLocked ? (
                <div className="px-3 py-1.5 rounded-full bg-gradient-gold text-secondary-foreground text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  VIP
                </div>
              ) : (
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="mx-4 mt-6 p-6 rounded-xl bg-gradient-purple text-center">
          <h3 className="font-display text-xl text-white mb-2">
            Chat Coming Soon! 🚀
          </h3>
          <p className="text-sm text-white/80 mb-4">
            Connect with creators, share tips, and grow together
          </p>
          <Button className="bg-white text-purple-dark hover:bg-white/90">
            Get Notified
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Community;
