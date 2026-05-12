import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Activity, FileText, Beaker, ChevronDown, Plus, X, Upload, Share2, HeartPulse, Droplets, Scale, Stethoscope, Camera } from 'lucide-react';
import { generateHealthSummary } from '../services/geminiService';

const INITIAL_FAMILY_MEMBERS = [
  { id: 'me', name: 'Sandeep', relation: 'Me', initials: 'SB', color: 'from-[#6C63FF] to-[#00D4AA]' },
  { id: 'sneha', name: 'Sneha', relation: 'Spouse', initials: 'SN', color: 'from-[#FF6B9D] to-[#FF9F7F]' },
  { id: 'kamla', name: 'Kamla', relation: 'Mother', initials: 'KA', color: 'from-[#00C9A7] to-[#A8FF78]' },
];

const INITIAL_TIMELINE_DATA: Record<string, any[]> = {
  me: [
    {
      id: 1,
      date: '19 Mar 2026',
      type: 'vitals',
      title: 'Vitals Logged',
      data: { bp: '130/85', hr: '72', weight: '78kg', sugar: '98 mg/dL' },
      color: 'from-[#00D4AA] to-[#008A70]',
      icon: Activity
    },
    {
      id: 2,
      date: '10 Mar 2026',
      type: 'prescription',
      title: 'Prescription Added',
      doctor: 'Dr. Priya Sharma',
      color: 'from-[#FFB347] to-[#FF6B6B]',
      icon: FileText
    },
    {
      id: 3,
      date: '05 Mar 2026',
      type: 'lab',
      title: 'HbA1c Test Results',
      value: '6.8%',
      status: 'Slightly Elevated',
      color: 'from-[#6C63FF] to-[#00D4AA]',
      icon: Beaker
    }
  ],
  sneha: [
    {
      id: 4,
      date: '18 Mar 2026',
      type: 'vitals',
      title: 'Vitals Logged',
      data: { bp: '118/76', hr: '70', weight: '58kg', sugar: '92 mg/dL' },
      color: 'from-[#00D4AA] to-[#008A70]',
      icon: Activity
    },
    {
      id: 5,
      date: '12 Mar 2026',
      type: 'prescription',
      title: 'Prescription Added',
      doctor: 'Dr. Meena Iyer',
      color: 'from-[#FFB347] to-[#FF6B6B]',
      icon: FileText
    }
  ],
  kamla: [
    {
      id: 6,
      date: '15 Mar 2026',
      type: 'lab',
      title: 'Lipid Profile',
      value: '210',
      status: 'High Cholesterol',
      color: 'from-[#6C63FF] to-[#00D4AA]',
      icon: Beaker
    },
    {
      id: 7,
      date: '08 Mar 2026',
      type: 'vitals',
      title: 'Vitals Logged',
      data: { bp: '145/92', hr: '74', weight: '62kg', sugar: '118 mg/dL' },
      color: 'from-[#00D4AA] to-[#008A70]',
      icon: Activity
    }
  ]
};

export default function RecordsScreen() {
  const [familyMembers, setFamilyMembers] = useState(INITIAL_FAMILY_MEMBERS);
  const [timelineData, setTimelineData] = useState(INITIAL_TIMELINE_DATA);
  const [activeMember, setActiveMember] = useState('me');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryData, setSummaryData] = useState<Record<string, any>>({});
  
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');

  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [showVitalsSheet, setShowVitalsSheet] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const currentTimeline = timelineData[activeMember] || [];
  const currentSummary = summaryData[activeMember];

  const filteredTimeline = currentTimeline.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Vitals' && item.type === 'vitals') return true;
    if (activeFilter === 'Labs' && item.type === 'lab') return true;
    if (activeFilter === 'Prescriptions' && item.type === 'prescription') return true;
    return false;
  });

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const member = familyMembers.find(m => m.id === activeMember);
    const context = member ? (member.id === 'me' ? 'myself' : `my ${member.relation} (${member.name})`) : undefined;
    const result = await generateHealthSummary(currentTimeline, context);
    setSummaryData(prev => ({ ...prev, [activeMember]: result }));
    setIsGenerating(false);
  };

  const handleAddMember = () => {
    if (!newMemberName || !newMemberRelation) return;
    
    const newId = newMemberName.toLowerCase().replace(/\s+/g, '-');
    const initials = newMemberName.substring(0, 2).toUpperCase();
    const colors = ['from-[#FFB347] to-[#FF6B6B]', 'from-[#00C9A7] to-[#A8FF78]', 'from-[#6C63FF] to-[#00D4AA]', 'from-[#FF6B9D] to-[#FF9F7F]'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newMember = {
      id: newId,
      name: newMemberName,
      relation: newMemberRelation,
      initials,
      color: randomColor
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setTimelineData({ ...timelineData, [newId]: [] });
    
    setShowAddMember(false);
    setNewMemberName('');
    setNewMemberRelation('');
    setActiveMember(newId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-6 space-y-6 pb-32"
    >
      <header>
        <h1 className="font-display text-3xl font-bold">Health Timeline 📋</h1>
        <p className="text-[#8B8FA8] mt-1">Medical history for you and your family.</p>
      </header>

      {/* Family Member Selector */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-4 no-scrollbar">
        {familyMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => setActiveMember(member.id)}
            className={`flex flex-col items-center shrink-0 transition-opacity ${activeMember === member.id ? 'opacity-100' : 'opacity-50'}`}
          >
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.color} p-[2px] mb-2`}>
              <div className={`w-full h-full rounded-full flex items-center justify-center font-display font-bold text-lg ${activeMember === member.id ? 'bg-transparent text-white' : 'bg-[#13131A] text-white'}`}>
                {member.initials}
              </div>
            </div>
            <span className="text-xs font-bold">{member.name}</span>
            <span className="text-[10px] text-[#8B8FA8]">{member.relation}</span>
          </button>
        ))}
        <button 
          onClick={() => setShowAddMember(true)}
          className="flex flex-col items-center shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-2 bg-white/5">
            <Plus size={20} className="text-white/50" />
          </div>
          <span className="text-xs font-bold text-white/50">Add</span>
          <span className="text-[10px] text-transparent">Member</span>
        </button>
      </div>

      {/* Actions Row */}
      <div className="flex gap-3">
        <button 
          onClick={() => setShowUploadSheet(true)}
          className="flex-1 glass-card p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mb-2">
            <Upload size={20} className="text-[#6C63FF]" />
          </div>
          <span className="font-bold text-xs sm:text-sm">Upload</span>
        </button>
        <button 
          onClick={() => setShowPrescriptionUpload(true)}
          className="flex-1 glass-card p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#FFB347]/20 flex items-center justify-center mb-2">
            <FileText size={20} className="text-[#FFB347]" />
          </div>
          <span className="font-bold text-xs sm:text-sm">Add Rx</span>
        </button>
        <button 
          onClick={() => setShowVitalsSheet(true)}
          className="flex-1 glass-card p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center mb-2">
            <Activity size={20} className="text-[#00D4AA]" />
          </div>
          <span className="font-bold text-xs sm:text-sm">Vitals</span>
        </button>
      </div>

      {/* AI Summary Button */}
      {!currentSummary && (
        <button 
          onClick={handleGenerateSummary}
          disabled={isGenerating || currentTimeline.length === 0}
          className={`w-full glass-card p-[1px] rounded-2xl overflow-hidden group relative ${currentTimeline.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="absolute inset-0 bg-primary-gradient opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="bg-[#13131A] m-[1px] rounded-2xl p-4 flex items-center justify-center relative z-10">
            {isGenerating ? (
              <div className="flex items-center text-[#00D4AA]">
                <Sparkles size={18} className="mr-2 animate-pulse" />
                <span className="font-bold text-sm">Analyzing records...</span>
              </div>
            ) : (
              <div className="flex items-center text-white">
                <Sparkles size={18} className="mr-2 text-[#6C63FF]" />
                <span className="font-bold text-sm">Generate AI Health Summary</span>
              </div>
            )}
          </div>
        </button>
      )}

      {/* AI Summary Result */}
      {currentSummary && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-1 rounded-2xl bg-gradient-to-br from-[#6C63FF]/30 to-[#00D4AA]/30 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-gradient" />
          <div className="bg-[#13131A]/80 backdrop-blur-md rounded-xl p-5">
            <div className="flex items-center mb-3">
              <Sparkles size={16} className="text-[#00D4AA] mr-2" />
              <h3 className="font-display font-bold text-lg">AI Health Summary</h3>
            </div>
            <p className="text-sm text-white/90 leading-relaxed mb-4">
              {currentSummary.paragraph}
            </p>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8B8FA8] uppercase tracking-wider">Action Plan</h4>
              {currentSummary.action_recommendations?.map((action: string, i: number) => (
                <div key={i} className="bg-white/5 rounded-lg p-3 text-sm flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] mt-1.5 mr-2 shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-3 no-scrollbar mt-6">
        {['All', 'Vitals', 'Labs', 'Prescriptions'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-5 h-11 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter 
                ? 'bg-primary-gradient text-white shadow-[0_4px_15px_rgba(108,99,255,0.3)]' 
                : 'glass-card text-[#8B8FA8] hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative pl-4 border-l-2 border-white/10 space-y-8 mt-6">
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-8 text-[#8B8FA8] text-sm">
            No records found for this category.
          </div>
        ) : (
          filteredTimeline.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-[25px] top-4 w-6 h-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg border-2 border-[#0A0A0F]`}>
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>

              <div 
                className={`glass-card p-5 cursor-pointer transition-all ${expandedCard === item.id ? 'border-white/30' : 'hover:border-white/20'}`}
                onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <span className="text-xs text-[#8B8FA8]">{item.date}</span>
                </div>

                {item.type === 'vitals' && item.data && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-[#8B8FA8] uppercase tracking-wider mb-1">Blood Pressure</div>
                      <div className="font-mono text-lg font-bold text-[#FF6B6B]">{item.data.bp}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-[#8B8FA8] uppercase tracking-wider mb-1">Heart Rate</div>
                      <div className="font-mono text-lg font-bold text-[#00D4AA]">{item.data.hr} <span className="text-xs">bpm</span></div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-[#8B8FA8] uppercase tracking-wider mb-1">Weight</div>
                      <div className="font-mono text-lg font-bold text-white">{item.data.weight}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-[#8B8FA8] uppercase tracking-wider mb-1">Blood Sugar</div>
                      <div className="font-mono text-lg font-bold text-[#FFB347]">{item.data.sugar}</div>
                    </div>
                  </div>
                )}

                {item.type === 'prescription' && (
                  <div className="mt-2 flex items-center justify-between bg-white/5 p-3 rounded-xl">
                    <div className="flex items-center">
                      <FileText size={16} className="text-[#FFB347] mr-2" />
                      <span className="text-sm font-medium">{item.doctor}</span>
                    </div>
                    <ChevronDown size={16} className={`text-[#8B8FA8] transition-transform ${expandedCard === item.id ? 'rotate-180' : ''}`} />
                  </div>
                )}

                {item.type === 'lab' && (
                  <div className="mt-2 bg-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-mono text-2xl font-bold text-[#6C63FF]">{item.value}</div>
                      <div className="text-xs text-[#FFB347] font-medium mt-1">{item.status}</div>
                    </div>
                    <button className="text-xs font-bold text-[#00D4AA] bg-[#00D4AA]/10 px-4 h-11 rounded-full flex items-center justify-center">
                      View Report
                    </button>
                  </div>
                )}

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedCard === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
                        <button className="flex items-center text-sm font-bold text-[#6C63FF] hover:text-[#8B8FA8] transition-colors">
                          <Share2 size={16} className="mr-2" /> Share with Doctor
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMember && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#080F0C]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <div className="bg-[#13131A] rounded-t-3xl p-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold">Add Family Member</h2>
                <button onClick={() => setShowAddMember(false)} className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-[#8B8FA8] mb-2">Name</label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Priya"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-[#8B8FA8] focus:outline-none focus:border-[#6C63FF]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B8FA8] mb-2">Relation</label>
                  <input
                    type="text"
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    placeholder="e.g. Sister"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-[#8B8FA8] focus:outline-none focus:border-[#6C63FF]/50 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddMember}
                disabled={!newMemberName || !newMemberRelation}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all ${(!newMemberName || !newMemberRelation) ? 'bg-white/10 text-[#8B8FA8] cursor-not-allowed' : 'bg-primary-gradient text-white shadow-[0_4px_20px_rgba(108,99,255,0.3)] hover:scale-[1.02]'}`}
              >
                Add Member
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Sheet */}
      <AnimatePresence>
        {showUploadSheet && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#080F0C]/90 backdrop-blur-sm flex flex-col justify-end max-w-[390px] mx-auto"
          >
            <div className="bg-[#13131A] rounded-t-3xl p-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold">Upload Record</h2>
                <button onClick={() => setShowUploadSheet(false)} className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Beaker, label: 'Lab Report', color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10', action: () => {} },
                  { icon: FileText, label: 'Prescription', color: 'text-[#FFB347]', bg: 'bg-[#FFB347]/10', action: () => { setShowUploadSheet(false); setShowPrescriptionUpload(true); } },
                  { icon: Activity, label: 'Vitals', color: 'text-[#00D4AA]', bg: 'bg-[#00D4AA]/10', action: () => { setShowUploadSheet(false); setShowVitalsSheet(true); } },
                  { icon: Stethoscope, label: 'Doctor Note', color: 'text-[#FF6B9D]', bg: 'bg-[#FF6B9D]/10', action: () => {} },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                    <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-3`}>
                      <item.icon size={24} className={item.color} />
                    </div>
                    <span className="font-bold text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enter Vitals Sheet */}
      <AnimatePresence>
        {showVitalsSheet && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#080F0C]/90 backdrop-blur-sm flex flex-col justify-end max-w-[390px] mx-auto"
          >
            <div className="bg-[#13131A] rounded-t-3xl p-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold">Enter Vitals</h2>
                <button onClick={() => setShowVitalsSheet(false)} className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center glass-card p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B6B]/20 flex items-center justify-center mr-4">
                    <HeartPulse size={20} className="text-[#FF6B6B]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-1">Blood Pressure</label>
                    <input type="text" inputMode="numeric" placeholder="120/80" className="w-full bg-transparent text-xl font-mono font-bold text-white focus:outline-none placeholder:text-white/20" />
                  </div>
                </div>
                
                <div className="flex items-center glass-card p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center mr-4">
                    <Activity size={20} className="text-[#00D4AA]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-1">Heart Rate</label>
                    <input type="number" inputMode="numeric" placeholder="72" className="w-full bg-transparent text-xl font-mono font-bold text-white focus:outline-none placeholder:text-white/20" />
                  </div>
                  <span className="text-[#8B8FA8] font-bold text-sm">bpm</span>
                </div>

                <div className="flex items-center glass-card p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mr-4">
                    <Scale size={20} className="text-[#6C63FF]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-1">Weight</label>
                    <input type="number" inputMode="decimal" placeholder="70.5" className="w-full bg-transparent text-xl font-mono font-bold text-white focus:outline-none placeholder:text-white/20" />
                  </div>
                  <span className="text-[#8B8FA8] font-bold text-sm">kg</span>
                </div>

                <div className="flex items-center glass-card p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#FFB347]/20 flex items-center justify-center mr-4">
                    <Droplets size={20} className="text-[#FFB347]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-1">Blood Sugar</label>
                    <input type="number" inputMode="numeric" placeholder="95" className="w-full bg-transparent text-xl font-mono font-bold text-white focus:outline-none placeholder:text-white/20" />
                  </div>
                  <span className="text-[#8B8FA8] font-bold text-sm">mg/dL</span>
                </div>
              </div>

              <button 
                onClick={() => setShowVitalsSheet(false)}
                className="w-full py-4 rounded-full font-bold text-lg transition-all bg-primary-gradient text-white shadow-[0_4px_20px_rgba(108,99,255,0.3)] hover:scale-[1.02]"
              >
                Save Vitals
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Prescription Upload Sheet */}
      <AnimatePresence>
        {showPrescriptionUpload && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#080F0C]/90 backdrop-blur-sm flex flex-col justify-end max-w-[390px] mx-auto"
          >
            <div className="bg-[#13131A] rounded-t-3xl p-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold">Upload Prescription</h2>
                <button onClick={() => { setShowPrescriptionUpload(false); setSelectedFile(null); }} className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {/* Drag & Drop Area */}
                <div 
                  className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-colors ${selectedFile ? 'border-[#00D4AA] bg-[#00D4AA]/5' : 'border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer'}`}
                  onClick={() => !selectedFile && setSelectedFile('prescription_dr_sharma.pdf')}
                >
                  {selectedFile ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[#00D4AA]/20 flex items-center justify-center mb-4">
                        <FileText size={32} className="text-[#00D4AA]" />
                      </div>
                      <h3 className="font-bold text-lg text-white mb-1">{selectedFile}</h3>
                      <p className="text-[#8B8FA8] text-sm mb-4">1.2 MB • PDF</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        className="text-[#FF6B6B] text-sm font-bold px-4 py-2 rounded-full bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 transition-colors"
                      >
                        Remove File
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mb-4">
                        <Upload size={32} className="text-[#6C63FF]" />
                      </div>
                      <h3 className="font-bold text-lg text-white mb-1">Tap to Browse</h3>
                      <p className="text-[#8B8FA8] text-sm">or drag and drop your file here</p>
                      <p className="text-[#8B8FA8] text-xs mt-4">Supports PDF, JPG, PNG (Max 5MB)</p>
                    </>
                  )}
                </div>

                {!selectedFile && (
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <span className="text-[#8B8FA8] text-sm font-medium">OR</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                  </div>
                )}

                {!selectedFile && (
                  <button 
                    onClick={() => setSelectedFile('scanned_prescription.jpg')}
                    className="w-full glass-card p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    <Camera size={20} className="text-[#00D4AA]" />
                    <span className="font-bold">Take a Photo</span>
                  </button>
                )}
              </div>

              <button 
                onClick={() => {
                  if (selectedFile) {
                    // Add to timeline
                    const newRecord = {
                      id: Date.now(),
                      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                      type: 'prescription',
                      title: 'Prescription Added',
                      doctor: 'Uploaded Document',
                      color: 'from-[#FFB347] to-[#FF6B6B]',
                      icon: FileText
                    };
                    setTimelineData(prev => ({
                      ...prev,
                      [activeMember]: [newRecord, ...(prev[activeMember] || [])]
                    }));
                    setShowPrescriptionUpload(false);
                    setSelectedFile(null);
                  }
                }}
                disabled={!selectedFile}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all ${!selectedFile ? 'bg-white/10 text-[#8B8FA8] cursor-not-allowed' : 'bg-primary-gradient text-white shadow-[0_4px_20px_rgba(108,99,255,0.3)] hover:scale-[1.02]'}`}
              >
                Upload Document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
