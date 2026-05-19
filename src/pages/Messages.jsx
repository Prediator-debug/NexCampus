import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User, Search, ArrowLeft, Smile, Paperclip, FileText, Music, Video, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function Messages() {
  const { currentUser, messages, sendMessage, users, listings } = useStore();
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (selectedChat) {
      useStore.getState().markMessagesAsRead(selectedChat.otherId);
    }
  }, [messages, selectedChat]);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in px-4">
        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-primary-600 mb-6 border border-slate-100">
          <MessageCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-slate-900">Sign in to view messages</h2>
        <p className="text-slate-500 mb-8 font-medium">Login to start chatting with buyers and sellers on campus.</p>
        <Link to="/login" className="btn-primary px-8 py-3">Login</Link>
      </div>
    );
  }

  // Build unique conversations list
  const myMessages = messages.filter(
    m => m.senderId === currentUser.id || m.receiverId === currentUser.id || m.receiverId === 'any'
  );

  // Group by the other person's ID
  const conversationMap = {};
  myMessages.forEach(msg => {
    const otherId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
    if (!conversationMap[otherId]) {
      conversationMap[otherId] = { otherId, messages: [] };
    }
    conversationMap[otherId].messages.push(msg);
  });

  const conversations = Object.values(conversationMap).map(conv => {
    // 1. Try to find in users list
    let other = users.find(u => u.id === conv.otherId);

    // 2. If not found, try to get name from listings (seller)
    if (!other) {
      const sellerListing = listings.find(l => l.sellerId === conv.otherId);
      if (sellerListing) {
        other = { id: conv.otherId, name: 'Seller', email: '' };
      }
    }

    // 3. Try to get name from message context (listingTitle)
    const lastMsg = conv.messages[conv.messages.length - 1];
    const listingContext = lastMsg?.listingTitle || '';

    // 4. Final fallback
    if (!other) {
      other = { id: conv.otherId, name: listingContext ? `Seller – ${listingContext}` : 'Campus User', email: '' };
    }

    return { ...conv, other, lastMsg, listingContext };
  });

  const filteredConversations = conversations.filter(c =>
    c.other.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat messages for selected conversation
  const chatMessages = selectedChat
    ? messages.filter(
        m =>
          (m.senderId === currentUser.id && m.receiverId === selectedChat.otherId) ||
          (m.senderId === selectedChat.otherId && m.receiverId === currentUser.id)
      )
    : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    sendMessage({
      senderId: currentUser.id,
      receiverId: selectedChat.otherId,
      listingId: selectedChat.lastMsg?.listingId || '',
      listingTitle: selectedChat.lastMsg?.listingTitle || '',
      text: inputText
    });

    // Simulate auto-reply ONLY on the first message
    if (chatMessages.length === 0) {
      setTimeout(() => {
        sendMessage({
          senderId: selectedChat.otherId,
          receiverId: currentUser.id,
          listingId: selectedChat.lastMsg?.listingId || '',
          listingTitle: selectedChat.lastMsg?.listingTitle || '',
          text: `Hi! Yes, the "${selectedChat.lastMsg?.listingTitle || 'item'}" is still available. Are you interested?`
        });
      }, 1500);
    }

    setInputText('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedChat) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let fileType = 'file';
        if (file.type.startsWith('image/')) fileType = 'image';
        else if (file.type.startsWith('video/')) fileType = 'video';
        else if (file.type.startsWith('audio/')) fileType = 'audio';
        else if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('text')) fileType = 'doc';

        sendMessage({
          senderId: currentUser.id,
          receiverId: selectedChat.otherId,
          listingId: selectedChat.lastMsg?.listingId || '',
          listingTitle: selectedChat.lastMsg?.listingTitle || '',
          text: '',
          fileUrl: reader.result,
          fileType,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFileContent = (msg) => {
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

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '?';

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900">Messages</h1>
        <p className="text-slate-500 font-medium">Chat with buyers and sellers on campus.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex h-[70vh] shadow-xl">
        {/* Sidebar — Conversation List */}
        <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-slate-50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <MessageCircle size={32} />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  No conversations yet. Browse the{' '}
                  <Link to="/marketplace" className="text-primary-600 hover:underline font-bold">
                    Marketplace
                  </Link>{' '}
                  and message a seller!
                </p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.otherId}
                  onClick={() => setSelectedChat(conv)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 ${
                    selectedChat?.otherId === conv.otherId ? 'bg-primary-50/50 border-l-2 border-l-primary-600' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md">
                    {getInitials(conv.other.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-slate-900 truncate">{conv.other.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                        {new Date(conv.lastMsg?.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{conv.lastMsg?.text}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-slate-50/30 ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-primary-600 to-purple-600 p-5 flex items-center gap-4 shrink-0 shadow-lg">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden text-white hover:bg-white/20 p-1.5 rounded-xl transition-all"
                >
                  <ArrowLeft size={22} />
                </button>
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold border border-white/20 shadow-inner">
                    {getInitials(selectedChat.other.name)}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-indigo-600"></span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-lg leading-tight truncate">{selectedChat.other.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary-400 shadow-sm border border-slate-100">
                      <MessageCircle size={36} />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Say hi to {selectedChat.other.name}!</p>
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-2xl overflow-hidden ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-sm ${
                            isMe ? 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-900'
                          }`}>
                            {renderFileContent(msg)}
                            {msg.text && (
                              <div className="px-5 py-3.5 text-sm font-medium">
                                {msg.text}
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-tighter ${isMe ? 'text-primary-600' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all shrink-0"
                    title="Attach File"
                  >
                    <Paperclip size={20} />
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-900 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors">
                      <Smile size={20} />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 shrink-0"
                  >
                    <Send size={20} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-4 bg-slate-50/50">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-primary-400 shadow-sm border border-slate-100">
                <MessageCircle size={52} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Select a conversation</h3>
              <p className="text-slate-500 text-sm font-medium max-w-xs">
                Choose a conversation from the list or message a seller from the{' '}
                <Link to="/marketplace" className="text-primary-600 hover:underline font-bold">Marketplace</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
