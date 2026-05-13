import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Mic, MicOff, Share2, Printer, ClipboardList, Pill, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { generateMedicalNote } from '../services/geminiService';

type ScribeState = 'idle' | 'recording' | 'processing' | 'result';

export default function MedicalScribeScreen() {
  const { popScreen } = useNavigation();
  const [scribeState, setScribeState] = useState<ScribeState>('idle');
  const [transcript, setTranscript] = useState('');
  const [medicalNote, setMedicalNote] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    let finalTranscript = '';
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalTranscript += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      const full = finalTranscript + interim;
      transcriptRef.current = full;
      setTranscript(full);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setScribeState('recording');
  };

  const stopRecording = async () => {
    recognitionRef.current?.stop();
    setScribeState('processing');

    const text = transcriptRef.current || transcript;
    if (!text.trim()) {
      setScribeState('idle');
      return;
    }

    const note = await generateMedicalNote(text);
    setMedicalNote(note);
    setScribeState('result');
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const formatNoteAsText = (note: any) => [
    '--- HealthSphere Medical Note ---',
    `Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    '',
    `Chief Complaint: ${note.chief_complaint}`,
    `Symptoms: ${note.symptoms?.join(', ')}`,
    `Diagnosis: ${note.diagnosis}`,
    `Prescription:\n${note.prescription?.map((p: any) => `  • ${p.name} ${p.dosage} — ${p.frequency} for ${p.duration}`).join('\n')}`,
    `Advice: ${note.advice?.join('. ')}`,
    `Follow-up: ${note.follow_up}`,
  ].join('\n');

  const shareNote = async () => {
    if (!medicalNote) return;
    const text = formatNoteAsText(medicalNote);
    if (navigator.share) {
      try { await navigator.share({ title: 'Medical Consultation Note', text }); } catch {}
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const resetScribe = () => {
    setScribeState('idle');
    setTranscript('');
    setMedicalNote(null);
    transcriptRef.current = '';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-white/5">
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Medical Scribe</h1>
          <p className="text-[#6C63FF] text-xs font-medium">AI-powered consultation notes</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-16 no-scrollbar">
        <AnimatePresence mode="wait">
          {/* Idle */}
          {scribeState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center pt-8"
            >
              <div className="w-28 h-28 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center mb-8">
                <Mic size={44} className="text-[#6C63FF]/60" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Start Consultation</h2>
              <p className="text-[#8B8FA8] text-sm mb-8 max-w-[280px] leading-relaxed">
                Tap the button to record your consultation. HealthSphere AI will transcribe and generate a structured medical note.
              </p>

              <div className="w-full glass-card rounded-2xl p-5 border border-white/5 mb-8 text-left space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8] mb-1">Extracted fields</p>
                {['Chief Complaint & Symptoms', 'Diagnosis', 'Prescription with Dosage', 'Advice & Follow-up'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-[#00D4AA] shrink-0" />
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg flex items-center justify-center shadow-[0_8px_32px_rgba(108,99,255,0.3)]"
              >
                <Mic size={20} className="mr-2" /> Start Consultation
              </motion.button>
            </motion.div>
          )}

          {/* Recording */}
          {scribeState === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
              <div className="flex items-center justify-center gap-2 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-[#FF4B4B]"
                />
                <span className="text-sm font-bold text-[#FF4B4B] uppercase tracking-wider">Recording</span>
              </div>

              <div className="flex items-center justify-center gap-1 mb-8 h-16">
                {Array.from({ length: 22 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05, ease: 'easeInOut' }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-[#6C63FF] to-[#00D4AA]"
                    style={{ height: '40px', transformOrigin: 'center' }}
                  />
                ))}
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/5 mb-6 min-h-40 max-h-60 overflow-y-auto no-scrollbar">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8] mb-3">Live Transcript</p>
                {transcript ? (
                  <p className="text-sm text-white/90 leading-relaxed">{transcript}</p>
                ) : (
                  <p className="text-sm text-[#8B8FA8] italic">Listening... speak clearly near the microphone.</p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="w-full h-14 rounded-full bg-[#FF4B4B] text-white font-bold text-lg flex items-center justify-center shadow-[0_8px_32px_rgba(255,75,75,0.3)]"
              >
                <MicOff size={20} className="mr-2" /> End Consultation
              </motion.button>
            </motion.div>
          )}

          {/* Processing */}
          {scribeState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center pt-24 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-[#6C63FF]/20 border-t-[#6C63FF] mb-6"
              />
              <h2 className="font-display text-xl font-bold mb-2">Generating Note</h2>
              <p className="text-[#8B8FA8] text-sm">Gemini AI is extracting the structured medical note...</p>
            </motion.div>
          )}

          {/* Result */}
          {scribeState === 'result' && medicalNote && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Note header */}
              <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-[#6C63FF]/10 to-[#00D4AA]/10 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-display text-xl font-bold">Consultation Note</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={shareNote}
                      className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="w-9 h-9 rounded-xl bg-white/10 text-[#8B8FA8] flex items-center justify-center"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-[#8B8FA8] text-xs">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Chief Complaint */}
              <div className="glass-card rounded-2xl p-5 border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8] mb-2">Chief Complaint</p>
                <p className="text-white font-medium">{medicalNote.chief_complaint}</p>
              </div>

              {/* Symptoms */}
              {medicalNote.symptoms?.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8] mb-3">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {medicalNote.symptoms.map((s: string) => (
                      <span key={s} className="px-3 py-1.5 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              <div className="glass-card rounded-2xl p-5 border border-[#6C63FF]/30 bg-[#6C63FF]/5">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList size={16} className="text-[#6C63FF]" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8]">Diagnosis</p>
                </div>
                <p className="text-white font-bold text-lg">{medicalNote.diagnosis}</p>
              </div>

              {/* Prescription */}
              {medicalNote.prescription?.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-[#00D4AA]/30 bg-[#00D4AA]/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill size={16} className="text-[#00D4AA]" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8]">Prescription</p>
                  </div>
                  <div className="space-y-3">
                    {medicalNote.prescription.map((p: any, i: number) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4">
                        <p className="font-bold text-white">{p.name}</p>
                        <p className="text-sm text-[#00D4AA] mt-0.5">{p.dosage} · {p.frequency}</p>
                        <p className="text-xs text-[#8B8FA8] mt-0.5">Duration: {p.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {medicalNote.advice?.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8] mb-3">Advice</p>
                  <div className="space-y-2">
                    {medicalNote.advice.map((a: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#00D4AA]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#00D4AA] text-[10px] font-bold">{i + 1}</span>
                        </div>
                        <p className="text-sm text-white/80">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up */}
              <div className="glass-card rounded-2xl p-5 border border-[#FFB347]/30 bg-[#FFB347]/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-[#FFB347]" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8]">Follow-up</p>
                </div>
                <p className="text-white/90 text-sm">{medicalNote.follow_up}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={shareNote}
                  className="flex-1 h-12 rounded-2xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Share2 size={16} /> WhatsApp
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 h-12 rounded-2xl bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Printer size={16} /> Save PDF
                </button>
              </div>

              <button
                onClick={resetScribe}
                className="w-full h-12 rounded-2xl glass-card text-[#8B8FA8] text-sm font-medium mb-4"
              >
                Start New Consultation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
