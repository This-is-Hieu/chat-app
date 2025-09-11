import { MessageSquare } from "lucide-react";

const NoChatSelected = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-16 bg-base-100/50 text-center space-y-6">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce mx-auto">
      <MessageSquare className="w-8 h-8 text-primary" />
    </div>
    <h2 className="text-2xl font-bold">Welcome!</h2>
    <p className="text-base-content/60">
      Select a conversation from the sidebar to start chatting
    </p>
  </div>
);

export default NoChatSelected;
