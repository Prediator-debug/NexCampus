import { useState, useRef, useEffect } from 'react';
import { X, Send, User, MessageCircle, MoreHorizontal, Smile, Paperclip, FileText, Music, Video, Download } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ChatBox() {
  const { activeChat, setActiveChat, messages, sendMessage, currentUser, users } = useStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const fileInputRef = useRef(null);
 
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);
 
  if (!activeChat || !currentUser) return null;
 
  // Filter messages for this specific chat
  const chatMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === activeChat.sellerId) ||
    (m.senderId === activeChat.sellerId && m.receiverId === currentUser.id)
  );
 
  const seller = users.find(u => u.id === activeChat.sellerId) || { name: 'Seller' };
 
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let fileType = 'file';
        if (file.type.startsWith('image/')) fileType = 'image';
        else if (file.type.startsWith('video/')) fileType = 'video';
        else if (file.type.startsWith('audio/')) fileType = 'audio';
        else if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('text')) fileType = 'doc';

        sendMessage({
          senderId: currentUser.id,
          receiverId: activeChat.sellerId,
          listingId: activeChat.listingId,
          listingTitle: activeChat.listingTitle || '',
          text: '',
          fileUrl: reader.result,
          fileType,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
 
    sendMessage({
      senderId: currentUser.id,
      receiverId: activeChat.sellerId,
      listingId: activeChat.listingId,
      listingTitle: activeChat.listingTitle || '',
      text: inputText
    });
    
    setInputText('');
 
    // Simulate auto-reply ONLY on the first message
    if (chatMessages.length === 0) {
      setTimeout(() => {
        sendMessage({
          senderId: activeChat.sellerId,
          receiverId: currentUser.id,
          listingId: activeChat.listingId,
          listingTitle: activeChat.listingTitle || '',
          text: `Hi! Yes, the "${activeChat.listingTitle}" is still available. Are you interested?`
        });
      }, 1500);
    }
  };

  const renderFileContent = (msg) => {
    // Backward compatibility for old messages that only have msg.image
    const fileUrl = msg.fileUrl || msg.image;
    const fileType = msg.fileType || (msg.image ? 'image' : null);

    if (!fileUrl) return null;

    switch (fileType) {
      case 'image':
        return <img src={fileUrl} alt="Attachment" className="max-w-full h-auto block" />;
      case 'video':
        return (
          <video controls className="max-w-full h-auto block bg-black rounded-t-xl">
            <source src={fileUrl} />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="p-4 bg-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <Music size={20} />
            </div>
            <audio controls className="h-8 w-full max-w-[200px]">
              <source src={fileUrl} />
            </audio>
          </div>
        );
      case 'doc':
      case 'file':
        return (
          <div className="p-4 bg-slate-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{msg.fileName || 'Document'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{fileType}</p>
              </div>
            </div>
            <a href={fileUrl} download={msg.fileName} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all shrink-0">
              <Download size={18} />
            </a>
          </div>
        );
      default:
        return null;
    }
  };
 
  return (
    <div className="fixed bottom-[85px] inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 w-auto sm:w-96 bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] flex flex-col h-[65vh] sm:h-[550px] animate-slide-up rounded-2xl overflow-hidden border">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-primary-600 to-purple-600 p-5 flex justify-between items-center shrink-0 shadow-lg gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <User size={24} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-indigo-600"></span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-lg leading-tight truncate">{seller.name}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70 truncate">
              Negotiating: {activeChat.listingTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="text-white hover:bg-white/20 p-2 rounded-xl transition-all">
            <MoreHorizontal size={22} />
          </button>
          <button 
            onClick={() => setActiveChat(null)}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all bg-white/10 ml-1"
            title="Close Chat"
          >
            <X size={26} />
          </button>
        </div>
      </div>
 
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
        <div className="flex flex-col items-center mb-6">
          <div className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Secure negotiation started
          </div>
        </div>
        
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-primary-400 opacity-50">
               <MessageCircle size={40} />
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Start a conversation with {seller.name} to discuss price, location, or item details.
            </p>
          </div>
        ) : (
          chatMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl overflow-hidden shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                  }`}>
                    {renderFileContent(msg)}
                    {msg.text && (
                      <div className="px-5 py-3.5 text-sm font-medium">
                        {msg.text}
                      </div>
                    )}
                  </div>
                  <div className={`text-[10px] mt-2 font-black uppercase tracking-tighter ${isMe ? 'text-primary-500' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
 
      {/* Input Area */}
      <div className="p-5 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <div className="flex items-center gap-1 pr-2">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
            >
              <Paperclip size={20} />
            </button>
          </div>
          <div className="relative flex-1 group">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors">
              <Smile size={20} />
            </button>
          </div>
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20"
          >
            <Send size={22} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
