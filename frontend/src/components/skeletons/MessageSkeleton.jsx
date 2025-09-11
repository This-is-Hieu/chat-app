export default function MessageSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`chat ${i % 2 ? "chat-end" : "chat-start"}`}>
          <div className="chat-image avatar">
            <div className="size-10 rounded-full skeleton" />
          </div>
          <div className="chat-header mb-1 skeleton h-4 w-16" />
          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
