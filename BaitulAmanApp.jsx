import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Clock, Menu, X, Heart, Calendar, MapPin, 
  ChevronRight, Send, Lock, Edit3, User, BookOpen, 
  ZoomIn, MessageCircle 
} from 'lucide-react';

// --- Global Constants & Mock Data ---
const DONATION_GOAL = 50000;
const CURRENT_DONATIONS = 32450;

const INITIAL_PRAYER_TIMES = {
  fajr: '05:15 AM',
  dhuhr: '01:15 PM',
  asr: '04:45 PM',
  maghrib: '06:10 PM',
  isha: '07:45 PM',
  jummah: '01:30 PM',
  iftar: '06:10 PM', // Ramadan specific
  suhoor: '04:50 AM' // Ramadan specific
};

const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: "Ramadan Moon Sighting", date: "2024-03-10", content: "Moon sighting committee will meet after Maghrib." },
  { id: 2, title: "Weekend Islamic School", date: "2024-03-08", content: "Registration open for ages 5-12." }
];

const INITIAL_QUESTIONS = [
  { id: 1, category: "Fasting", question: "Does using an inhaler break the fast?", answer: "According to most scholars, if it reaches the throat/stomach, it may break the fast. Consult local Imam for specifics.", isAnswered: true, isPublic: true },
  { id: 2, category: "Prayer", question: "Can I pray with shoes on?", answer: "", isAnswered: false, isPublic: false }
];

// --- 1. Home View ---
function HomeView({ prayerTimes, announcements, navigate }) {
  // Helper to get next prayer (simplified logic)
  const nextPrayer = { name: 'Asr', time: prayerTimes.asr, timeUntil: '1h 20m' };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-emerald-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="w-96 h-96 bg-emerald-400 rounded-full blur-3xl absolute -top-20 -left-20"></div>
          <div className="w-96 h-96 bg-yellow-400 rounded-full blur-3xl absolute bottom-0 right-0"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Masjid Al-Nur</h1>
          <p className="text-emerald-100 text-lg md:text-xl mb-8">A center for worship, education, and community unity.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('donate')} className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-full font-bold transition shadow-lg flex items-center">
              <Heart className="mr-2" size={20}/> Donate Now
            </button>
            <button onClick={() => navigate('times')} className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full font-bold transition flex items-center border border-white/30">
              <Calendar className="mr-2" size={20}/> Prayer Times
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="max-w-6xl mx-auto -mt-10 px-4 relative z-20">
        <div className="bg-white rounded-xl shadow-xl p-6 grid md:grid-cols-3 gap-6 border border-slate-100">
          
          {/* Next Prayer Card */}
          <div className="flex items-center space-x-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Next Prayer</p>
              <h3 className="text-xl font-bold text-slate-800">{nextPrayer.name} <span className="text-emerald-600">{nextPrayer.time}</span></h3>
              <p className="text-xs text-slate-400">Jummah: {prayerTimes.jummah}</p>
            </div>
          </div>

          {/* Announcements Ticker */}
          <div className="flex items-center space-x-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <MessageCircle size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500 uppercase font-bold">Latest Update</p>
              <p className="text-sm font-medium text-slate-800 truncate">
                {announcements.length > 0 ? announcements[0].title : "No updates"}
              </p>
              <button onClick={() => navigate('gallery')} className="text-xs text-blue-500 hover:underline mt-1">View Gallery & Events</button>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Visit Us</p>
              <p className="text-sm font-medium text-slate-800">123 Islamic Center Way</p>
              <a href="#" className="text-xs text-orange-500 hover:underline flex items-center mt-1">
                Get Directions <ChevronRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. Prayer Times View ---
function PrayerTimesView({ prayerTimes, isRamadanMode }) {
  const times = [
    { name: 'Fajr', time: prayerTimes.fajr, icon: <Moon size={18} /> },
    { name: 'Sunrise', time: '06:45 AM', icon: <Sun size={18} /> }, // Static for demo
    { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: <Sun size={18} /> },
    { name: 'Asr', time: prayerTimes.asr, icon: <Sun size={18} /> },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: <Moon size={18} /> },
    { name: 'Isha', time: prayerTimes.isha, icon: <Moon size={18} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Daily Prayer Schedule</h2>
        <p className="text-slate-500 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {isRamadanMode && (
        <div className="bg-emerald-900 text-white rounded-xl p-6 mb-8 shadow-lg flex justify-between items-center">
          <div>
            <p className="text-emerald-200 text-sm font-bold uppercase">Suhoor Ends</p>
            <p className="text-2xl font-bold">{prayerTimes.suhoor}</p>
          </div>
          <div className="h-10 w-px bg-emerald-700"></div>
          <div className="text-right">
            <p className="text-emerald-200 text-sm font-bold uppercase">Iftar Begins</p>
            <p className="text-2xl font-bold">{prayerTimes.iftar}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 grid grid-cols-3 font-bold text-slate-500 text-sm uppercase tracking-wide">
          <div>Prayer</div>
          <div className="text-center">Adhan</div>
          <div className="text-right">Iqamah</div>
        </div>
        <div className="divide-y divide-slate-100">
          {times.map((t) => (
            <div key={t.name} className="p-4 grid grid-cols-3 items-center hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-3 font-medium text-slate-800">
                <span className="text-slate-400">{t.icon}</span>
                {t.name}
              </div>
              <div className="text-center text-slate-600">{t.time}</div>
              <div className="text-right font-bold text-emerald-700">
                {/* Mock logic for Iqamah adding 15 mins */}
                {t.name === 'Sunrise' ? '-' : t.time} 
              </div>
            </div>
          ))}
          <div className="p-4 grid grid-cols-3 items-center bg-emerald-50/50">
            <div className="font-bold text-emerald-900">Jummah</div>
            <div className="text-center text-slate-600">1:00 PM</div>
            <div className="text-right font-bold text-emerald-700">{prayerTimes.jummah}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. Gallery View (Interactive) ---
function GalleryView() {
  const images = [
    { id: 1, src: "/api/placeholder/600/400", cat: "Events", caption: "Annual Eid Prayer Gathering" },
    { id: 2, src: "/api/placeholder/600/400", cat: "Construction", caption: "New Wing Foundation Work" },
    { id: 3, src: "/api/placeholder/600/400", cat: "Community", caption: "Ramadan Iftar Together" },
    { id: 4, src: "/api/placeholder/600/400", cat: "Events", caption: "Youth Quran Competition" },
    { id: 5, src: "/api/placeholder/600/400", cat: "Construction", caption: "Interior Calligraphy Art" },
    { id: 6, src: "/api/placeholder/600/400", cat: "Community", caption: "Weekly Food Drive" },
  ];

  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = filter === 'All' ? images : images.filter(img => img.cat === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Community Gallery</h2>
        <p className="text-slate-500 mt-2">Moments of unity, worship, and progress.</p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {['All', 'Events', 'Construction', 'Community'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filter === cat 
                ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedImage(img)}
            className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
          >
            <img src={img.src} alt={img.caption} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"/>
            <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-bold text-lg">{img.caption}</p>
                <span className="text-xs bg-emerald-500/80 px-2 py-1 rounded mt-2 inline-block">{img.cat}</span>
                <div className="mt-3 flex justify-center text-emerald-200"><ZoomIn size={24} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white/70 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full p-2"><X size={32} /></button>
          <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.caption} className="w-full max-h-[80vh] object-contain bg-slate-100"/>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{selectedImage.caption}</h3>
                <p className="text-emerald-600 text-sm">{selectedImage.cat}</p>
              </div>
              <button onClick={() => setSelectedImage(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. Donate View ---
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
          <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Make a Secure Donation</h3>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['Masjid Fund', 'Zakat', 'Sadaqah'].map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`py-2 text-sm rounded-lg border ${category === cat ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (BDT / USD)</label>
               <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-lg" placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-3">
              <button onClick={() => setMethod('card')} className={`w-full flex items-center justify-center py-3 border rounded-lg hover:bg-slate-50 transition ${method === 'card' ? 'ring-2 ring-emerald-500 border-transparent' : 'border-slate-200'}`}><span className="font-bold text-slate-700">Credit Card / Stripe</span></button>
              <button onClick={() => setMethod('bkash')} className={`w-full flex items-center justify-center py-3 border rounded-lg hover:bg-pink-50 transition ${method === 'bkash' ? 'ring-2 ring-pink-500 border-transparent' : 'border-slate-200'}`}><span className="font-bold text-pink-600">bKash</span></button>
              <button onClick={() => setMethod('ssl')} className={`w-full flex items-center justify-center py-3 border rounded-lg hover:bg-blue-50 transition ${method === 'ssl' ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}><span className="font-bold text-blue-800">SSLCommerz</span></button>
          </div>
          <button className="w-full mt-8 bg-emerald-600 text-white font-bold py-4 rounded-lg hover:bg-emerald-700 transition shadow-lg">Complete Donation</button>
        </div>

        <div className="bg-emerald-900 text-white p-8 rounded-2xl flex flex-col justify-center">
           <h3 className="text-2xl font-bold mb-4">Why Donate?</h3>
           <ul className="space-y-4">
             <li className="flex items-start"><Heart className="mr-3 text-emerald-400 shrink-0" size={20} /><span className="text-emerald-100 text-sm">Maintain the house of Allah and cover daily operational costs.</span></li>
             <li className="flex items-start"><BookOpen className="mr-3 text-emerald-400 shrink-0" size={20} /><span className="text-emerald-100 text-sm">Support educational programs for children and new Muslims.</span></li>
             <li className="flex items-start"><User className="mr-3 text-emerald-400 shrink-0" size={20} /><span className="text-emerald-100 text-sm">Help the needy in our community through Zakat funds.</span></li>
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

// --- 5. Ask Imam View ---
function AskImamView({ questions, setQuestions }) {
    const [newQ, setNewQ] = useState('');
    const [category, setCategory] = useState('General');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!newQ.trim()) return;
      const q = {
        id: Date.now(),
        category,
        question: newQ,
        answer: "",
        isAnswered: false,
        isPublic: false
      };
      setQuestions([...questions, q]);
      setNewQ('');
      alert("Question submitted! It will appear after Imam's approval.");
    };
  
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
              <h3 className="font-bold text-xl mb-4 flex items-center"><Send className="mr-2 text-emerald-600" size={20}/> Ask the Imam</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Topic</label>
                  <select className="w-full p-2 border rounded-lg" value={category} onChange={(e)=>setCategory(e.target.value)}>
                    <option>General</option>
                    <option>Fiqh (Jurisprudence)</option>
                    <option>Family</option>
                    <option>Creed</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
                  <textarea rows="4" className="w-full p-2 border rounded-lg" value={newQ} onChange={(e)=>setNewQ(e.target.value)} placeholder="Type your question anonymously..."></textarea>
                </div>
                <button className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition">Submit Question</button>
              </form>
            </div>
          </div>
  
          {/* Q&A List */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Q & A</h2>
            <div className="space-y-6">
              {questions.filter(q => q.isPublic && q.isAnswered).map(q => (
                <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold">{q.category}</span>
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 mb-3">"{q.question}"</h4>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-600 text-sm leading-relaxed"><span className="font-bold text-emerald-600">Imam's Answer:</span> {q.answer}</p>
                  </div>
                </div>
              ))}
              {questions.filter(q => q.isPublic && q.isAnswered).length === 0 && (
                <p className="text-slate-500 italic">No public questions answered yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

// --- 6. Login View ---
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

// --- 7. Admin Dashboard (Protected) ---
function AdminDashboard({ 
  user, prayerTimes, setPrayerTimes, 
  questions, setQuestions, 
  isRamadanMode, setIsRamadanMode,
  announcements, setAnnouncements,
  navigate 
}) {
  
  useEffect(() => {
    if (user !== 'admin') navigate('login');
  }, [user, navigate]);

  const [tab, setTab] = useState('times'); 
  const [replyText, setReplyText] = useState('');
  const [selectedQId, setSelectedQId] = useState(null);

  const handleTimeChange = (key, value) => {
    setPrayerTimes(prev => ({ ...prev, [key]: value }));
  };

  const handleAnswerSubmit = (id) => {
    const updated = questions.map(q => 
      q.id === id ? { ...q, answer: replyText, isAnswered: true, isPublic: true } : q
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
          <button onClick={() => setTab('times')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'times' ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Prayer Times</button>
          <button onClick={() => setTab('questions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'questions' ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Questions <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{questions.filter(q => !q.isAnswered).length}</span></button>
          <button onClick={() => setTab('announcements')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'announcements' ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Announcements</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
        
        {/* 1. Prayer Times Editor */}
        {tab === 'times' && (
          <div>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
               <h3 className="font-bold text-xl text-slate-800">Manage Prayer Schedule</h3>
               <div className="flex items-center space-x-2">
                 <span className="text-sm font-medium text-slate-600">Ramadan Mode</span>
                 <button onClick={() => setIsRamadanMode(!isRamadanMode)} className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isRamadanMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                   <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${isRamadanMode ? 'translate-x-6' : ''}`}></div>
                 </button>
               </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(prayerTimes).map(key => (
                (isRamadanMode || (!['iftar', 'suhoor'].includes(key))) && (
                  <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{key}</label>
                    <input className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 font-mono" type="text" value={prayerTimes[key]} onChange={(e) => handleTimeChange(key, e.target.value)} />
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
                      <textarea className="w-full border border-emerald-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" rows="3" placeholder="Type your answer..." value={replyText} onChange={e => setReplyText(e.target.value)}></textarea>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleAnswerSubmit(q.id)} className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700">Submit Answer</button>
                        <button onClick={() => setSelectedQId(null)} className="px-3 py-1 text-slate-500 text-sm hover:text-slate-700">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedQId(q.id)} className="text-sm text-emerald-600 font-semibold hover:underline flex items-center"><Edit3 size={14} className="mr-1"/> Reply</button>
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
                  <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null); // 'admin' or null
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Central State Data
  const [prayerTimes, setPrayerTimes] = useState(INITIAL_PRAYER_TIMES);
  const [isRamadanMode, setIsRamadanMode] = useState(false);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);

  const navigate = (p) => {
    setPage(p);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch(page) {
      case 'home': return <HomeView prayerTimes={prayerTimes} announcements={announcements} navigate={navigate} />;
      case 'times': return <PrayerTimesView prayerTimes={prayerTimes} isRamadanMode={isRamadanMode} />;
      case 'gallery': return <GalleryView />;
      case 'donate': return <DonateView />;
      case 'ask': return <AskImamView questions={questions} setQuestions={setQuestions} />;
      case 'login': return <LoginView setUser={setUser} navigate={navigate} />;
      case 'admin': return <AdminDashboard 
          user={user} 
          prayerTimes={prayerTimes} setPrayerTimes={setPrayerTimes}
          questions={questions} setQuestions={setQuestions}
          isRamadanMode={isRamadanMode} setIsRamadanMode={setIsRamadanMode}
          announcements={announcements} setAnnouncements={setAnnouncements}
          navigate={navigate} 
        />;
      default: return <HomeView prayerTimes={prayerTimes} announcements={announcements} navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2">
                <Moon className="text-white" size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">Masjid Al-Nur</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'Times', 'Gallery', 'Donate', 'Ask'].map((item) => (
                <button 
                  key={item}
                  onClick={() => navigate(item.toLowerCase())}
                  className={`text-sm font-semibold transition-colors duration-200 ${page === item.toLowerCase() ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-500'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>

            {/* Admin Link */}
            <div className="hidden md:block">
              <button onClick={() => navigate(user ? 'admin' : 'login')} className="text-slate-400 hover:text-slate-600">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-lg absolute w-full z-50">
            {['Home', 'Times', 'Gallery', 'Donate', 'Ask', 'Admin'].map((item) => (
              <button 
                key={item}
                onClick={() => navigate(item === 'Admin' ? (user ? 'admin' : 'login') : item.toLowerCase())}
                className="block w-full text-left font-semibold text-slate-600 py-2"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-64px)]">
        {renderContent()}
      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>&copy; 2024 Masjid Al-Nur. All rights reserved.</p>
      </footer>
    </div>
  );
}
