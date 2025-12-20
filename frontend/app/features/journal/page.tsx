'use client';
import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, ChevronLeft, ChevronRight, Sparkles, Check, X, Edit3, Brain } from 'lucide-react';
import Link from 'next/link';

export default function ReflectionsPage() {
    const [selectedReflection, setSelectedReflection] = useState<string | null>('ai-draft-1');
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    // Mock data - AI-generated reflections
    const reflections = [
        {
            id: 'ai-draft-1',
            type: 'ai-draft',
            title: 'Morning Conversation Reflection',
            date: '2025-12-19',
            time: '10:45',
            aiSummary: 'Based on your chat with Whiz this morning, you expressed feelings of gratitude and optimism. You mentioned being excited about your new project and feeling more energized than usual.',
            emotionalPatterns: ['Gratitude', 'Optimism', 'Energy'],
            keyInsights: [
                'Positive shift in morning routine',
                'Increased motivation for creative work',
                'Better sleep quality mentioned'
            ],
            conversationCount: 3,
            approved: false
        },
        {
            id: 'approved-1',
            type: 'approved',
            title: 'Evening Thoughts on Growth',
            date: '2025-12-18',
            time: '20:30',
            content: 'Today was challenging but rewarding. I realized that my anxiety around social situations is improving. The breathing exercises Whiz suggested really helped during the team meeting.',
            emotionalPatterns: ['Growth', 'Anxiety', 'Hope'],
            approved: true
        },
        {
            id: 'approved-2',
            type: 'approved',
            title: 'Midday Check-in',
            date: '2025-12-18',
            time: '13:20',
            content: 'Feeling overwhelmed with work deadlines. Talked to Whiz about time management. Need to remember to take breaks.',
            emotionalPatterns: ['Stress', 'Overwhelm'],
            approved: true
        }
    ];

    const aiDrafts = reflections.filter(r => r.type === 'ai-draft');
    const approvedReflections = reflections.filter(r => r.type === 'approved');

    const selectedItem = reflections.find(r => r.id === selectedReflection);

    // Calendar
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysInMonth = 31;
    const firstDay = 0;

    const handleApprove = () => {
        console.log('Approved reflection:', selectedReflection);
        // In real app: API call to approve
    };

    const handleReject = () => {
        console.log('Rejected reflection:', selectedReflection);
        // In real app: API call to reject
    };

    const handleEdit = () => {
        setEditMode(true);
        setEditedContent(selectedItem?.aiSummary || '');
    };

    const handleSaveEdit = () => {
        console.log('Saved edited reflection:', editedContent);
        setEditMode(false);
        // In real app: API call to save edited version
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A26] font-sans relative flex">
            {/* Abstract Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-50/40 via-teal-50/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Header */}
                <header className="px-6 py-4 flex items-center gap-4 border-b border-emerald-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                    <Link href="/dashboard" className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <BookOpen size={22} />
                        </div>
                        <div>
                            <h1 className="font-bold text-stone-900">Reflections</h1>
                            <p className="text-xs text-stone-500">AI-curated emotional insights</p>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        {selectedItem ? (
                            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100/50 rounded-2xl p-8 shadow-lg">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {selectedItem.type === 'ai-draft' && (
                                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                                                    <Brain size={12} />
                                                    AI Draft
                                                </span>
                                            )}
                                            {selectedItem.approved && (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1.5">
                                                    <Check size={12} />
                                                    Approved
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-bold text-stone-900 mb-2">{selectedItem.title}</h2>
                                        <div className="flex items-center gap-3 text-sm text-stone-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {selectedItem.date}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {selectedItem.time}
                                            </span>
                                            {selectedItem.conversationCount && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-emerald-600 font-medium">
                                                        {selectedItem.conversationCount} conversations
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Emotional Patterns */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-stone-700 mb-3">Emotional Patterns</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedItem.emotionalPatterns.map((pattern, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                                                {pattern}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-stone-700 mb-3">
                                        {selectedItem.type === 'ai-draft' ? 'AI-Generated Summary' : 'Your Reflection'}
                                    </h3>
                                    {editMode ? (
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full min-h-[200px] p-4 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl text-base leading-relaxed focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all outline-none"
                                        />
                                    ) : (
                                        <p className="text-base leading-relaxed text-stone-700 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                                            {selectedItem.aiSummary || selectedItem.content}
                                        </p>
                                    )}
                                </div>

                                {/* Key Insights (AI drafts only) */}
                                {selectedItem.keyInsights && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                                            <Sparkles size={16} className="text-emerald-500" />
                                            Key Insights
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedItem.keyInsights.map((insight, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {selectedItem.type === 'ai-draft' && (
                                    <div className="flex gap-3 pt-6 border-t border-emerald-100">
                                        {editMode ? (
                                            <>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-300/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Check size={18} />
                                                    Save & Approve
                                                </button>
                                                <button
                                                    onClick={() => setEditMode(false)}
                                                    className="px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleApprove}
                                                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-300/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Check size={18} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={handleEdit}
                                                    className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-all flex items-center gap-2"
                                                >
                                                    <Edit3 size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={handleReject}
                                                    className="px-6 py-3 bg-rose-50 text-rose-700 rounded-xl font-semibold hover:bg-rose-100 transition-all flex items-center gap-2"
                                                >
                                                    <X size={18} />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-emerald-200 rounded-2xl p-12 text-center">
                                <BookOpen size={48} className="text-emerald-300 mx-auto mb-4" />
                                <p className="text-stone-500">Select a reflection to view</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-emerald-100/50 bg-white/60 backdrop-blur-xl flex flex-col relative z-10">
                {/* Calendar */}
                <div className="p-5 border-b border-emerald-100/50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-stone-900">{monthNames[11]} 2025</span>
                        <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors">
                                <ChevronLeft size={16} className="text-emerald-600" />
                            </button>
                            <button className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors">
                                <ChevronRight size={16} className="text-emerald-600" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-center text-xs font-bold text-stone-500 py-2">{d}</div>
                        ))}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`e-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isToday = day === 19;
                            const hasEntry = day === 18 || day === 19;
                            return (
                                <button
                                    key={day}
                                    className={`aspect-square rounded-lg text-sm font-semibold transition-all ${isToday
                                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200'
                                            : hasEntry
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Reflections List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* AI Drafts */}
                    {aiDrafts.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Brain size={14} />
                                AI Drafts ({aiDrafts.length})
                            </h3>
                            <div className="space-y-2">
                                {aiDrafts.map((reflection) => (
                                    <button
                                        key={reflection.id}
                                        onClick={() => setSelectedReflection(reflection.id)}
                                        className={`w-full text-left p-3 rounded-xl transition-all ${selectedReflection === reflection.id
                                                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 shadow-md'
                                                : 'bg-white/50 border border-emerald-100 hover:bg-emerald-50/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-1.5">
                                            <h4 className="font-bold text-sm text-stone-900 truncate flex-1">{reflection.title}</h4>
                                            <Sparkles size={14} className="text-emerald-500 flex-shrink-0 ml-2" />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                                            <span>{reflection.time}</span>
                                            <span>•</span>
                                            <span className="text-emerald-600 font-medium">{reflection.conversationCount} chats</span>
                                        </div>
                                        <p className="text-xs text-stone-600 line-clamp-2">{reflection.aiSummary}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Approved Reflections */}
                    {approvedReflections.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Approved</h3>
                            <div className="space-y-2">
                                {approvedReflections.map((reflection) => (
                                    <button
                                        key={reflection.id}
                                        onClick={() => setSelectedReflection(reflection.id)}
                                        className={`w-full text-left p-3 rounded-xl transition-all ${selectedReflection === reflection.id
                                                ? 'bg-white border-2 border-emerald-200 shadow-md'
                                                : 'bg-white/50 border border-stone-200 hover:bg-white/80'
                                            }`}
                                    >
                                        <h4 className="font-bold text-sm text-stone-900 truncate mb-1.5">{reflection.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                                            <span>{reflection.date}</span>
                                            <span>•</span>
                                            <span>{reflection.time}</span>
                                        </div>
                                        <p className="text-xs text-stone-600 line-clamp-2">{reflection.content}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
