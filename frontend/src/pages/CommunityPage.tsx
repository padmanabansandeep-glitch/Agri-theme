import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  PhoneCall, 
  ThumbsUp, 
  Send, 
  Award, 
  Share2,
  CheckCircle2
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'paddy' | 'soil' | 'subsidies' | 'pests'>('all');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'K. Ramasamy',
      district: 'Thanjavur, Tamil Nadu',
      time: '2 hours ago',
      category: 'paddy',
      title: 'How to manage leaf folder in Samba Paddy without chemical heavy sprays?',
      content: 'I noticed some white bleached leaves with folded tips in my 45-day CO 51 crop. Need organic or bio-control recommendations before panicle initiation.',
      likes: 18,
      isLiked: false,
      answers: [
        {
          expert: 'Dr. S. Meenakshi (TNAU Agronomist)',
          text: 'Spray Bacillus thuringiensis (Bt) @ 1.5 g/litre or release Trichogramma chilonis egg parasitoid cards @ 2 cc/acre twice at 7-day interval.',
          verified: true
        }
      ]
    },
    {
      id: 2,
      author: 'Murugan Praveen',
      district: 'Coimbatore, Tamil Nadu',
      time: '4 hours ago',
      category: 'soil',
      title: 'Soil test report shows 7.8 pH and low zinc. What is the best corrective dosage?',
      content: 'Planning to sow maize next month. Current nitrogen is medium (140 kg/ha) and phosphorus is high. Should I apply gypsum or zinc sulphate?',
      likes: 12,
      isLiked: false,
      answers: [
        {
          expert: 'Er. V. Sundaram (Soil Scientist)',
          text: 'Apply Zinc Sulphate @ 10 kg/acre basal mixed with 50 kg well-decomposed FYM. Do not mix zinc directly with DAP or SSP to prevent zinc phosphate precipitation.',
          verified: true
        }
      ]
    },
    {
      id: 3,
      author: 'Balachandran R.',
      district: 'Erode, Tamil Nadu',
      time: 'Yesterday',
      category: 'subsidies',
      title: 'PM-Kisan 19th Installment status and e-KYC deadline update',
      content: 'Has anyone received the recent DBT credit for PM-KISAN? Make sure your Aadhaar-linked land record (patta/chitta) is seeded on the state AGRISNET portal.',
      likes: 29,
      isLiked: false,
      answers: [
        {
          expert: 'Govt Agriculture Extension Officer',
          text: 'Next installment release is scheduled for DBT credit. Farmers can check Aadhaar NPCI seeding status via their local post office or CSC center.',
          verified: true
        }
      ]
    }
  ]);

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newPost = {
      id: Date.now(),
      author: 'Murugan Farmer (You)',
      district: 'Thanjavur, Tamil Nadu',
      time: 'Just now',
      category: 'paddy',
      title: newQuestionText,
      content: 'Question submitted to the community & TNAU extension network.',
      likes: 0,
      isLiked: false,
      answers: []
    };
    setPosts([newPost, ...posts]);
    setNewQuestionText('');
  };

  const filteredPosts = posts.filter(p => activeFilter === 'all' || p.category === activeFilter);

  return (
    <div className="w-full min-h-screen bg-[#f4f7f4] text-zinc-800 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header (Light Theme) */}
        <div className="bg-gradient-to-r from-emerald-50 via-white to-green-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono uppercase font-bold mb-2 shadow-xs">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                Kisan Farmer Community & Agronomist Network
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-display">
                Farmer Discussion Forum & Knowledge Hub
              </h1>
              <p className="text-sm text-zinc-600 mt-2 max-w-2xl leading-relaxed">
                Ask crop management questions, share field experiences, and receive peer-reviewed guidance from TNAU & ICAR extension scientists.
              </p>
            </div>

            {/* Helpline quick card */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-zinc-500 font-semibold">Toll Free Kisan Call Centre</div>
                <div className="text-base font-bold text-emerald-800 font-mono">1800-180-1551</div>
                <div className="text-[10px] text-zinc-500">6 AM – 10 PM · 22 Regional Languages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ask Question Bar (Light Theme) */}
        <form onSubmit={handlePostQuestion} className="bg-white border border-zinc-200 p-4 rounded-3xl shadow-sm flex gap-3">
          <input 
            type="text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            placeholder="Ask a question about crop pests, fertilizer dosage, weather impact, or mandi prices..."
            className="flex-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-2xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
          <button 
            type="submit"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </form>

        {/* Filter Tabs (Light Theme) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Discussions' },
            { id: 'paddy', label: 'Paddy & Grains' },
            { id: 'soil', label: 'Soil Health & Fertilizer' },
            { id: 'subsidies', label: 'Schemes & Subsidies' },
            { id: 'pests', label: 'Pest & Disease Control' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Discussions List (Light Theme) */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 font-display">{post.author}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">· {post.district}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">· {post.time}</span>
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 mt-1">{post.title}</h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{post.content}</p>
                </div>
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                    post.isLiked 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes}</span>
                </button>
              </div>

              {/* Answers */}
              {post.answers.length > 0 && (
                <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
                  {post.answers.map((ans, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                        <Award className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{ans.expert}</span>
                        <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full text-[9px] font-bold">Verified Answer</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed">{ans.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
