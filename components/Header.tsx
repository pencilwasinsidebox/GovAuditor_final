import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Bell, Menu, UserCircle, Search, Command, X, ShieldAlert, Info, Trash2, CheckCheck } from 'lucide-react';
import { ViewState, AppNotification } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, notifications, onMarkAsRead, onClearAll, onSearch }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems: { label: string; view: ViewState }[] = [
    { label: 'Oversight Registry', view: 'SELECTION' },
    { label: 'Audit Archives', view: 'REPORTS_LIST' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 z-[100] w-full glass border-b border-slate-200 transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
        <div 
          onClick={() => onNavigate('SELECTION')}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xl ring-4 ring-slate-900/10 transition-transform group-hover:scale-105">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-emerald-400 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Gov<span className="text-blue-600">Auditor</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1.5">
                Federal Intelligence Unit
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = currentView === item.view || (currentView === 'INPUT_FORM' && item.view === 'SELECTION') || (currentView === 'ANALYSIS_RESULT' && item.view === 'SELECTION');
            return (
             <button 
               key={item.label} 
               onClick={() => onNavigate(item.view)}
               className={`relative px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                   isActive 
                   ? 'text-blue-600 bg-blue-50/50 border border-blue-100 shadow-sm' 
                   : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
               }`}
             >
               {item.label}
               {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600"></span>}
             </button>
            );
          })}
          <div className="w-px h-6 bg-slate-200 mx-4"></div>
          <div className="flex items-center gap-1">
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <Command className="w-4 h-4" />
                <span>Console</span>
             </button>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center bg-slate-100/80 rounded-full px-3 py-1.5 border border-slate-200 focus-within:ring-2 ring-blue-500/20 focus-within:bg-white focus-within:border-blue-200 transition-all"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Audit ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs px-2 outline-none w-28 text-slate-700 font-bold placeholder:text-slate-400" 
            />
          </form>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 ${isNotificationsOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:shadow-md'}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-4 w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden glass animate-fade-in-up origin-top-right">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Intelligence Alerts</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">{unreadCount} New</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={onClearAll}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Clear All"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Bell className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Alerts</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors relative cursor-default ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                        >
                          {!notif.isRead && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
                          )}
                          <div className={`mt-1 flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ${
                            notif.type === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 
                            notif.type === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {notif.type === 'CRITICAL' ? <ShieldAlert className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h4 className="text-sm font-bold text-slate-900 truncate">{notif.title}</h4>
                              <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{notif.message}</p>
                            {!notif.isRead && (
                              <button 
                                onClick={() => onMarkAsRead(notif.id)}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                              >
                                <CheckCheck className="w-3 h-3" />
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button 
                      onClick={() => {
                        onNavigate('REPORTS_LIST');
                        setIsNotificationsOpen(false);
                      }}
                      className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors"
                    >
                      View All Activity Logs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>
          <button className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
             <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-white" />
             </div>
             <span className="text-xs font-bold hidden md:block">Officer ID: 992-B</span>
          </button>
          <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
             <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;