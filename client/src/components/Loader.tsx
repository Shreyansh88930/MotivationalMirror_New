export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-60 w-full">
      <div className="relative flex space-x-2">
        <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 rounded-full bg-pink-500 animate-bounce"></div>
      </div>
    </div>
  );
};