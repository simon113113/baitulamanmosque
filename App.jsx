import React, { useState, useEffect, useCallback } from 'react';
import { 
  Moon, Sun, MapPin, Phone, Mail, Menu, X, 
  Heart, DollarSign, MessageCircle, 
  Send, Lock, Calendar, Clock, Edit3, 
  CheckCircle, BookOpen, Volume2
} from 'lucide-react';

// --- Mock Data & Config ---
const INITIAL_PRAYER_TIMES = {
  fajr: "05:15 AM",
  dhuhr: "01:15 PM",
  asr: "04:30 PM",
  maghrib: "06:45 PM",
  isha: "08:15 PM",
  jummah: "01:30 PM",
  sunrise: "06:30 AM",
  iftar: "06:45 PM",
  suhoor: "04:45 AM"
};

const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: "Ramadan Preparation", date: "2024-03-01", content: "Join us for a special lecture series on preparing for the holy month." },
  { id: 2, title: "Youth Soccer", date: "2024-03-05", content: "Registration is open for the community youth soccer league." }
];

const INITIAL_QUESTIONS = [
  { id: 1, question: "When does the library open?", answer: "The library is open daily from Asr to Isha.", isPublic: true, isAnswered: true, category: "General" },
  { id: 2, question: "Is Zakat due on jewelry?", answer: "Yes, if it meets the Nisab threshold. Please consult the Imam for specific calculations.", isPublic: true, isAnswered: true, category: "Fiqh" },
  { id: 3, question: "Can I bring my children to Jummah?", answer: null, isPublic: true, isAnswered: false, category: "General" }
];

const DONATION_GOAL = 50000;
const CURRENT_DONATIONS = 32500;

// Helper to parse "05:15 AM" into object {hours, minutes}
const parseTimeStr = (timeStr) => {
  if (!timeStr) return { hours: 0, minutes: 0 };
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (hours === 12 && modifier === 'AM') hours = 0;
  if (modifier === 'PM' && hours !== 12) hours += 12;
  return { hours, minutes };
};

// --- Main App Component ---
export default function BaitulAmanApp() {
  const [view, setView] = useState('home'); // home, prayer, ask, donate, login, admin
  const [user, setUser] = useState(null); // null or 'admin'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Data State
  const [prayerTimes, setPrayerTimes] = useState(INITIAL_PRAYER_TIMES);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [isRamadanMode, setIsRamadanMode] = useState(false);

  // Navigation Helper
  const navigate = useCallback((page) => {
    setView(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  // --- Chatbot Logic ---
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: "Assalamu Alaikum! I am the Assistant for Baitul Aman Masjid. Ask me about prayer times, location, or events." }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.toLowerCase();
    const newMessages = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");

    // Simple Rule-based AI
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Please contact the office.";
      
      if (userMsg.includes('fajr')) botResponse = `Fajr is at ${prayerTimes.fajr}.`;
      else if (userMsg.includes('maghrib') || userMsg.includes('iftar')) botResponse = `Maghrib/Iftar is at ${prayerTimes.maghrib}.`;
      else if (userMsg.includes('isha')) botResponse = `Isha is at ${prayerTimes.isha}.`;
      else if (userMsg.includes('jummah') || userMsg.includes('friday')) botResponse = `Jummah prayer is at ${prayerTimes.jummah}.`;
      else if (userMsg.includes('time') || userMsg.includes('prayer')) botResponse = `Fajr: ${prayerTimes.fajr}, Dhuhr: ${prayerTimes.dhuhr}, Asr: ${prayerTimes.asr}, Maghrib: ${prayerTimes.maghrib}, Isha: ${prayerTimes.isha}.`;
      else if (userMsg.includes('location') || userMsg.includes('where')) botResponse = "We are located in Dhanmondi, Dhaka. Check the map section!";
      else if (userMsg.includes('donate') || userMsg.includes('zakat')) botResponse = "You can donate Zakat or Sadaqah on our Donation page.";
      else if (userMsg.includes('course') || userMsg.includes('quran')) botResponse = "Quran classes are held every Tuesday and Thursday after Asr.";
      else if (userMsg.includes('hello') || userMsg.includes('salam')) botResponse = "Wa Alaikum Assalam! How can I help you today?";

      setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
              <div className="bg-emerald-600 p-2 rounded-lg text-white mr-3">
                <Moon size={20} fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-900 leading-tight">Baitul Aman</h1>
                <p className="text-xs text-emerald-600 font-medium tracking-wide">MASJID PLATFORM</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'Prayer Times', 'Ask Imam', 'Donate'].map((item) => (
                <button 
                  key={item}
                  onClick={() => navigate(item.toLowerCase().replace(' ', ''))}
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${view === item.toLowerCase().replace(' ', '') ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-600'}`}
                >
                  {item}
                </button>
              ))}
              {user === 'admin' ? (
                <button onClick={() => navigate('admin')} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition">Dashboard</button>
              ) : (
                <button onClick={() => navigate('login')} className="flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600">
                  <Lock size={14} className="mr-1" /> Admin
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-emerald-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Home', 'Prayer Times', 'Ask Imam', 'Donate', 'Admin'].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate(item.toLowerCase().replace(' ', ''))}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* --- Main Content Switcher --- */}
      <main className="min-h-[calc(100vh-4rem)]">
        {view === 'home' && <HomeView navigate={navigate} prayerTimes={prayerTimes} announcements={announcements} />}
        {view === 'prayertimes' && <PrayerTimesView prayerTimes={prayerTimes} isRamadanMode={isRamadanMode} />}
        {view === 'askimam' && <AskImamView questions={questions} setQuestions={setQuestions} />}
        {view === 'donate' && <DonateView />}
        {view === 'login' && <LoginView setUser={setUser} navigate={navigate} />}
        {view === 'admin' && (
          <AdminDashboard 
            user={user} 
            prayerTimes={prayerTimes} 
            setPrayerTimes={setPrayerTimes} 
            questions={questions}
            setQuestions={setQuestions}
            isRamadanMode={isRamadanMode}
            setIsRamadanMode={setIsRamadanMode}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            navigate={navigate}
          />
        )}
      </main>

      {/* --- Global Footer --- */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Moon size={24} className="text-emerald-400 mr-2" />
              <h2 className="text-xl font-bold">Baitul Aman Masjid</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A community-driven platform dedicated to serving the spiritual and social needs of our neighborhood in Dhanmondi.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><button onClick={() => navigate('prayertimes')} className="hover:text-white">Prayer Times</button></li>
              <li><button onClick={() => navigate('askimam')} className="hover:text-white">Ask the Imam</button></li>
              <li><button onClick={() => navigate('donate')} className="hover:text-white">Donate</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Contact Us</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start">
                <MapPin size={16} className="mt-1 mr-2 text-emerald-500" />
                <span>Road 8/A, Dhanmondi<br/>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-emerald-500" />
                <span>+880 123 456 7890</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-emerald-500" />
                <span>contact@baitulaman.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2024 Baitul Aman Masjid Digital Platform. All rights reserved.
        </div>
      </footer>

      {/* --- AI Chatbot FAB --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:bg-emerald-700 transition-transform hover:scale-105 flex items-center justify-center"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden border border-emerald-100 flex flex-col h-[500px]">
            <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <Volume2 size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Masjid Assistant</h3>
                  <p className="text-xs text-emerald-100">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-emerald-700 p-1 rounded">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about prayer times..."
                className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700">
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

// 1. Home View
function HomeView({ navigate, prayerTimes, announcements }) {
  const [timeLeft, setTimeLeft] = useState('Loading...');
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [nextPrayerTimeStr, setNextPrayerTimeStr] = useState('');

  // Update Countdown and Find Next Prayer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      let upcoming = null;
      let upcomingDate = null;

      // Check for next prayer today
      for (let p of prayerOrder) {
        const tObj = parseTimeStr(prayerTimes[p]);
        const pDate = new Date();
        pDate.setHours(tObj.hours, tObj.minutes, 0, 0);
        
        if (pDate > now) {
          upcoming = p;
          upcomingDate = pDate;
          break;
        }
      }

      // If no more prayers today, it's Fajr tomorrow
      if (!upcoming) {
        upcoming = 'fajr';
        const tObj = parseTimeStr(prayerTimes.fajr);
        upcomingDate = new Date();
        upcomingDate.setDate(upcomingDate.getDate() + 1); // Tomorrow
        upcomingDate.setHours(tObj.hours, tObj.minutes, 0, 0);
      }

      setNextPrayerName(upcoming.charAt(0).toUpperCase() + upcoming.slice(1));
      setNextPrayerTimeStr(prayerTimes[upcoming]);

      const diff = upcomingDate - now;
      if (diff > 0) {
        const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      } else {
        setTimeLeft("Time's up!");
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden">
        {/* Background Image Wrapper */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1537207432367-93339833a466?q=80&w=2940&auto=format&fit=crop"
            alt="Mosque Background" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-900/60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-800/80 backdrop-blur rounded-full text-xs font-semibold tracking-wider mb-4 border border-emerald-500/30">
              WELCOME TO BAITUL AMAN MASJID
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              Connecting Hearts,<br/>Building Community.
            </h1>
            <p className="text-emerald-50 text-lg mb-8 max-w-lg drop-shadow-md">
              Join us for daily prayers, community events, and educational programs. 
              A sanctuary for peace and spiritual growth in Dhanmondi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('prayertimes')} className="px-6 py-3 bg-white text-emerald-900 font-bold rounded-lg hover:bg-emerald-50 transition shadow-lg">
                Prayer Times
              </button>
              <button onClick={() => navigate('donate')} className="px-6 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-600 transition border border-emerald-600">
                Make a Donation
              </button>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2" size={20}/> Next Prayer: {nextPrayerName}
            </h3>
            <div className="text-4xl font-bold mb-2">{nextPrayerTimeStr}</div>
            <p className="text-emerald-200 text-sm mb-6">Countdown: <span className="font-mono text-emerald-100">{timeLeft}</span></p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                <span>Fajr</span> <span className="font-mono">{prayerTimes.fajr}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                <span>Dhuhr</span> <span className="font-mono">{prayerTimes.dhuhr}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-2 font-bold text-emerald-300">
                <span>Asr</span> <span className="font-mono">{prayerTimes.asr}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                <span>Maghrib</span> <span className="font-mono">{prayerTimes.maghrib}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Isha</span> <span className="font-mono">{prayerTimes.isha}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Our Services</h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div onClick={() => navigate('askimam')} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition cursor-pointer group">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <BookOpen className="text-emerald-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Ask the Imam</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have a religious question? Submit it privately or publicly and get answers directly from our Imam.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition cursor-pointer group">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Calendar className="text-blue-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Events & Education</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                From Quran classes to youth sports, stay updated with our community calendar.
              </p>
            </div>

            <div onClick={() => navigate('donate')} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition cursor-pointer group">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors">
                <DollarSign className="text-amber-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Donations</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Support the Masjid securely online. Zakat, Sadaqah, and Masjid Maintenance funds accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements & Map */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          {/* Announcements */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <Volume2 className="mr-2 text-emerald-600" /> Latest Announcements
            </h2>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{ann.title}</h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-slate-500 italic">No announcements at this time.</p>}
            </div>
          </div>

          {/* Map */}
          <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <MapPin className="mr-2 text-emerald-600" /> Visit Us
            </h2>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 h-80 overflow-hidden">
               {/* Google Maps Embed centered on Dhanmondi, Dhaka */}
               <iframe 
                title="Baitul Aman Masjid Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430136!2d90.37397731498136!3d23.75085808458925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1647854321098!5m2!1sen!2sbd"
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
               <span className="flex items-center"><MapPin size={16} className="mr-1"/> Dhanmondi, Dhaka</span>
               <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-medium hover:underline">Get Directions</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 2. Prayer Times View
function PrayerTimesView({ prayerTimes, isRamadanMode }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set dynamic date (e.g. "Monday, December 21, 2025")
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Daily Prayer Schedule</h2>
        <p className="text-slate-500 mt-2">Accurate timings for the 5 daily prayers and Jummah.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Today's Timings</h3>
            <p className="text-emerald-100 text-sm">{currentDate}</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-sm opacity-80">Sunrise</div>
            <div className="font-bold text-lg">{prayerTimes.sunrise}</div>
          </div>
        </div>

        <div className="p-0">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Prayer</th>
                <th className="py-4 px-6 text-right text-sm font-semibold text-slate-600">Adhan</th>
                <th className="py-4 px-6 text-right text-sm font-semibold text-slate-600">Iqamah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Fajr', time: prayerTimes.fajr },
                { name: 'Dhuhr', time: prayerTimes.dhuhr },
                { name: 'Asr', time: prayerTimes.asr },
                { name: 'Maghrib', time: prayerTimes.maghrib },
                { name: 'Isha', time: prayerTimes.isha },
                { name: 'Jummah', time: prayerTimes.jummah, isSpecial: true },
              ].map((prayer, idx) => (
                <tr key={prayer.name} className={`hover:bg-slate-50 transition-colors ${prayer.isSpecial ? 'bg-emerald-50/50' : ''}`}>
                  <td className="py-4 px-6 font-medium text-slate-800 flex items-center">
                    {prayer.isSpecial && <Sun size={16} className="text-amber-500 mr-2" />}
                    {prayer.name}
                  </td>
                  {/* Mock logic for Adhan vs Iqamah difference */}
                  <td className="py-4 px-6 text-right text-slate-500 font-mono">{prayer.time}</td>
                  <td className="py-4 px-6 text-right font-bold text-emerald-700 font-mono">{prayer.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isRamadanMode && (
        <div className="mt-8 bg-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-amber-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Moon className="mr-3 text-amber-400" /> Ramadan Schedule
              </h3>
              <p className="text-indigo-200">May Allah accept our fasting and prayers.</p>
            </div>
            <div className="flex gap-8 text-center">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[120px]">
                <div className="text-sm text-indigo-200 mb-1">Suhoor Ends</div>
                <div className="text-2xl font-bold text-white">{prayerTimes.suhoor}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[120px]">
                <div className="text-sm text-indigo-200 mb-1">Iftar Time</div>
                <div className="text-2xl font-bold text-white">{prayerTimes.iftar}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Ask Imam View
function AskImamView({ questions, setQuestions }) {
  const [activeTab, setActiveTab] = useState('browse'); // browse, ask
  const [formData, setFormData] = useState({ question: '', isPublic: true, category: 'General' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQ = {
      id: Date.now(),
      question: formData.question,
      answer: null,
      isPublic: formData.isPublic,
      isAnswered: false,
      category: formData.category
    };
    setQuestions([...questions, newQ]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ question: '', isPublic: true, category: 'General' });
      setActiveTab('browse');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Ask the Imam</h2>
          <p className="text-slate-500 mt-2">Get answers to your religious queries.</p>
        </div>
        <div className="mt-4 md:mt-0 flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'browse' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
          >
            Recent Answers
          </button>
          <button 
            onClick={() => setActiveTab('ask')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'ask' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
          >
            Submit Question
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <div className="space-y-4">
          {questions.filter(q => q.isPublic && q.isAnswered).map(q => (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wide">{q.category}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-4">"{q.question}"</h3>
              <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-emerald-500">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{q.answer}</p>
                <div className="mt-2 text-xs text-slate-400 font-medium">- Answered by Imam</div>
              </div>
            </div>
          ))}
          {questions.filter(q => q.isPublic && q.isAnswered).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No public questions answered yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-100 max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-800">Question Submitted!</h3>
              <p className="text-slate-500">JazakAllah Khair. The Imam will review it shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>General</option>
                  <option>Fiqh</option>
                  <option>Family</option>
                  <option>Aqeedah</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Question</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Type your question here..."
                  value={formData.question}
                  onChange={e => setFormData({...formData, question: e.target.value})}
                ></textarea>
              </div>
              <div className="mb-8 flex items-center">
                <input 
                  type="checkbox" 
                  id="public"
                  checked={formData.isPublic}
                  onChange={e => setFormData({...formData, isPublic: e.target.checked})}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="public" className="ml-2 text-sm text-slate-600">
                  Allow this question to be published publicly (anonymously)
                </label>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-lg">
                Submit Question
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// 4. Donate View
function DonateView() {
  const progress = Math.min((CURRENT_DONATIONS / DONATION_GOAL) * 100, 100);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [category, setCategory] = useState('Masjid Fund');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Support Your Masjid</h2>
        <p className="text-slate-500 mt-2">"Those who spend in charity will be richly rewarded." (Quran 57:10)</p>
      </div>

      {/* Fundraising Progress */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 mb-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Masjid Expansion Fund</h3>
            <p className="text-sm text-slate-500">Help us build a new educational wing</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-600">${CURRENT_DONATIONS.toLocaleString()}</span>
            <span className="text-sm text-slate-400"> / ${DONATION_GOAL.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Donation Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Make a Secure Donation</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['Masjid Fund', 'Zakat', 'Sadaqah'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2 text-sm rounded-lg border ${category === cat ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 text-slate-600 hover:border-emerald-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (BDT / USD)</label>
               <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-lg" 
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-3">
             <button 
              onClick={() => setMethod('card')}
              className={`w-full flex items-center justify-center py-3 border rounded-lg hover:bg-slate-50 transition ${method === 'card' ? 'ring-2 ring-emerald-500 border-transparent' : 'border-slate-200'}`}
             >
                <span className="font-bold text-slate-700">Credit Card / Stripe</span>
             </button>
             <button 
               onClick={() => setMethod('bkash')}
               className={`w-full flex items-center justify-center py-3 border rounded-lg hover:bg-pink-50 transition ${method === 'bkash' ? 'ring-2 ring-pink-500 border-transparent' : 'border-slate-200'}`}
             >
                <span className="font-bold text-pink-600">bKash</span>
             </button>
             <button 
               onClick={() => setMethod('ssl')}
               className={`w-full flex items-center justify-center py-3 border rounded-lg hover:bg-blue-50 transition ${method === 'ssl' ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}
             >
                <span className="font-bold text-blue-800">SSLCommerz</span>
             </button>
          </div>

          <button className="w-full mt-8 bg-emerald-600 text-white font-bold py-4 rounded-lg hover:bg-emerald-700 transition shadow-lg">
            Complete Donation
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-emerald-900 text-white p-8 rounded-2xl flex flex-col justify-center">
           <h3 className="text-2xl font-bold mb-4">Why Donate?</h3>
           <ul className="space-y-4">
             <li className="flex items-start">
               <Heart className="mr-3 text-emerald-400 shrink-0" size={20} />
               <span className="text-emerald-100 text-sm">Maintain the house of Allah and cover daily operational costs.</span>
             </li>
             <li className="flex items-start">
               <BookOpen className="mr-3 text-emerald-400 shrink-0" size={20} />
               <span className="text-emerald-100 text-sm">Support educational programs for children and new Muslims.</span>
             </li>
             <li className="flex items-start">
               <User className="mr-3 text-emerald-400 shrink-0" size={20} />
               <span className="text-emerald-100 text-sm">Help the needy in our community through Zakat funds.</span>
             </li>
           </ul>
           <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur text-sm">
             <p className="font-semibold">Bank Transfer Info:</p>
             <p className="font-mono mt-1 text-emerald-200">Bank Asia<br/>Acct: 1234567890<br/>Branch: Dhanmondi</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// 5. Login View
function LoginView({ setUser, navigate }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === 'admin123') {
      setUser('admin');
      navigate('admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Login</h2>
          <p className="text-slate-500 text-sm">Enter credentials to manage the platform.</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => {setPass(e.target.value); setError(false);}}
            />
            {error && <p className="text-red-500 text-xs mt-2">Incorrect password. Try 'admin123'.</p>}
          </div>
          <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// 6. Admin Dashboard (Protected)
function AdminDashboard({ 
  user, prayerTimes, setPrayerTimes, 
  questions, setQuestions, 
  isRamadanMode, setIsRamadanMode,
  announcements, setAnnouncements,
  navigate 
}) {
  
  // Guard clause for security simulation
  useEffect(() => {
    if (user !== 'admin') navigate('login');
  }, [user, navigate]);

  const [tab, setTab] = useState('times'); // times, questions, announcements
  const [replyText, setReplyText] = useState('');
  const [selectedQId, setSelectedQId] = useState(null);

  // Handlers
  const handleTimeChange = (key, value) => {
    setPrayerTimes(prev => ({ ...prev, [key]: value }));
  };

  const handleAnswerSubmit = (id) => {
    const updated = questions.map(q => 
      q.id === id ? { ...q, answer: replyText, isAnswered: true } : q
    );
    setQuestions(updated);
    setReplyText('');
    setSelectedQId(null);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const date = new Date().toISOString().split('T')[0];
    setAnnouncements([...announcements, { id: Date.now(), title, content, date }]);
    e.target.reset();
  };

  if (user !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-slate-400 text-sm">Welcome back, Imam.</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => setTab('times')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'times' ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Prayer Times
          </button>
          <button 
            onClick={() => setTab('questions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'questions' ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Questions <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{questions.filter(q => !q.isAnswered).length}</span>
          </button>
          <button 
            onClick={() => setTab('announcements')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'announcements' ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Announcements
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
        
        {/* 1. Prayer Times Editor */}
        {tab === 'times' && (
          <div>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
               <h3 className="font-bold text-xl text-slate-800">Manage Prayer Schedule</h3>
               <div className="flex items-center space-x-2">
                 <span className="text-sm font-medium text-slate-600">Ramadan Mode</span>
                 <button 
                  onClick={() => setIsRamadanMode(!isRamadanMode)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isRamadanMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
                 >
                   <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${isRamadanMode ? 'translate-x-6' : ''}`}></div>
                 </button>
               </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(prayerTimes).map(key => (
                (isRamadanMode || (!['iftar', 'suhoor'].includes(key))) && (
                  <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{key}</label>
                    <input 
                      className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 font-mono"
                      type="text"
                      value={prayerTimes[key]} 
                      onChange={(e) => handleTimeChange(key, e.target.value)}
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* 2. Question Manager */}
        {tab === 'questions' && (
          <div>
            <h3 className="font-bold text-xl text-slate-800 mb-6">Pending Questions</h3>
            <div className="space-y-4">
              {questions.filter(q => !q.isAnswered).map(q => (
                <div key={q.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition">
                  <div className="flex justify-between mb-2">
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded">{q.category}</span>
                    <span className="text-xs text-slate-400">{q.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  <p className="font-semibold text-slate-800 mb-4">"{q.question}"</p>
                  
                  {selectedQId === q.id ? (
                    <div className="mt-2">
                      <textarea 
                        className="w-full border border-emerald-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        rows="3"
                        placeholder="Type your answer..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                      ></textarea>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleAnswerSubmit(q.id)}
                          className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700"
                        >
                          Submit Answer
                        </button>
                        <button 
                          onClick={() => setSelectedQId(null)}
                          className="px-3 py-1 text-slate-500 text-sm hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedQId(q.id)}
                      className="text-sm text-emerald-600 font-semibold hover:underline flex items-center"
                    >
                      <Edit3 size={14} className="mr-1"/> Reply
                    </button>
                  )}
                </div>
              ))}
              {questions.filter(q => !q.isAnswered).length === 0 && (
                <div className="text-center py-8 text-slate-500">No pending questions. Alhamdulillah.</div>
              )}
            </div>
          </div>
        )}

        {/* 3. Announcement Manager */}
        {tab === 'announcements' && (
          <div>
            <h3 className="font-bold text-xl text-slate-800 mb-6">Manage Announcements</h3>
            
            <form onSubmit={handleAddAnnouncement} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Post New Update</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <input name="title" required placeholder="Title" className="p-2 border rounded" />
                <input name="content" required placeholder="Details..." className="p-2 border rounded md:col-span-2" />
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-700">Post Announcement</button>
            </form>

            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.id} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0">
                  <div>
                    <div className="font-bold text-slate-800">{ann.title}</div>
                    <div className="text-xs text-slate-500">{ann.date}</div>
                  </div>
                  <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}