'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, ChevronLeft, ChevronRight, Sparkles, Check, X, Edit3, Brain } from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import {
    getUserReflections,
    approveReflection,
    editReflection,
    deleteReflection,
    Reflection
} from '@/utils/api';

// UI Reflection type (what the UI expects)
interface UIReflection {
    id: string;
    type: 'ai-draft' | 'approved';
    title: string;
    date: string;
    time: string;
    aiSummary?: string;
    content?: string;
    emotionalPatterns: string[];
    keyInsights: string[];
    conversationCount?: number;
    approved: boolean;
}

// Adapter: Convert backend Reflection to UI format
function adaptReflection(r: Reflection): UIReflection {
    const createdDate = new Date(r.created_at);
    return {
        id: r.id,
        type: r.user_approved ? 'approved' : 'ai-draft',
        title: `Reflection from ${createdDate.toLocaleDateString()}`,
        date: createdDate.toISOString().split('T')[0],
        time: createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        aiSummary: r.ai_generated_text,
        content: r.final_text,
        emotionalPatterns: r.emotions_detected || [],
        keyInsights: r.key_insights || [],
        conversationCount: 1,
        approved: r.user_approved
    };
}

export default function ReflectionsPage() {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [reflections, setReflections] = useState<UIReflection[]>([]);
    const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load reflections from backend
    useEffect(() => {
        if (user) {
            loadReflections();
        }
    }, [user]);

    const loadReflections = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const data = await getUserReflections(user!.id, 50, token);
            const uiReflections = data.map(adaptReflection);
            setReflections(uiReflections);
            if (uiReflections.length > 0 && !selectedReflection) {
                setSelectedReflection(uiReflections[0].id);
            }
        } catch (err) {
            console.error('Error loading reflections:', err);
            setError('Failed to load reflections');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reflectionId: string) => {
        try {
            const token = await getToken();
            await approveReflection(reflectionId, undefined, token);
            await loadReflections();
        } catch (err) {
            console.error('Error approving reflection:', err);
            setError('Failed to approve reflection');
        }
    };

    const handleEdit = async (reflectionId: string, newContent: string) => {
        try {
            const token = await getToken();
            await editReflection(reflectionId, newContent, token);
            await loadReflections();
            setEditMode(false);
        } catch (err) {
            console.error('Error editing reflection:', err);
            setError('Failed to edit reflection');
        }
    };

    const handleDelete = async (reflectionId: string) => {
        try {
            const token = await getToken();
            await deleteReflection(reflectionId, token);
            await loadReflections();
            setSelectedReflection(null);
        } catch (err) {
            console.error('Error deleting reflection:', err);
            setError('Failed to delete reflection');
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedReflection) return;
        await handleEdit(selectedReflection, editedContent);
    };

    const handleReject = async () => {
        if (!selectedReflection) return;
        await handleDelete(selectedReflection);
    };

    const aiDrafts = reflections.filter(r => !r.approved);
    const approvedReflections = reflections.filter(r => r.approved);

    const selectedItem = reflections.find(r => r.id === selectedReflection);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 border border-emerald-100">
                        <BookOpen size={40} className="text-emerald-500 animate-pulse" />
                    </div>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Gathering Your Reflections</h2>
                <p className="text-stone-500 text-center max-w-sm">
                    Whiz is organizing your thoughts and insights into a beautiful journal.
                </p>
            </div>
        );
    }

    // Show empty state if no reflections
    if (reflections.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/30 to-orange-50">
                <div className="absolute top-8 left-8 z-20">
                    <Link href="/dashboard" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors py-2 px-4 rounded-full hover:bg-white/50 backdrop-blur-sm border border-amber-100/50 text-sm font-medium">
                        <ArrowLeft size={16} />
                        <span>Dashboard</span>
                    </Link>
                </div>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <BookOpen className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-serif text-stone-700 mb-2">No Reflections Yet</h2>
                        <p className="text-stone-500">Start chatting with Whiz to generate your first reflection!</p>
                        <Link href="/features/chat" className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                            Start Chatting
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Calendar
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysInMonth = 31;
    const firstDay = 0;

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A26] font-sans relative flex">
            {/* Abstract Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-50/40 via-green-50/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl" />
            </div>

            {/* SIDEBAR */}
            <div className="w-80 bg-white/70 backdrop-blur-xl border-r border-emerald-100/50 p-6 relative z-10 flex flex-col h-screen overflow-y-auto">
                {/* Back Button */}
                <Link href="/dashboard" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-6 py-2 px-4 rounded-full hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 text-sm font-medium">
                    <ArrowLeft size={16} />
                    <span>Dashboard</span>
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent flex items-center gap-2">
                        <BookOpen size={28} className="text-emerald-600" />
                        Deep Journal
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">AI-powered reflections</p>
                </div>

                {/* Calendar Widget */}
                <div className="mb-6 bg-gradient-to-br from-emerald-50/50 to-green-50/30 border border-emerald-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <button className="p-1 hover:bg-emerald-100 rounded-lg transition-colors">
                            <ChevronLeft size={16} className="text-emerald-700" />
                        </button>
                        <span className="text-sm font-bold text-emerald-900">December 2025</span>
                        <button className="p-1 hover:bg-emerald-100 rounded-lg transition-colors">
                            <ChevronRight size={16} className="text-emerald-700" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-emerald-600 font-semibold py-1">{day}</div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => (
                            <div
                                key={i}
                                className={`py-1 rounded-lg cursor-pointer transition-all ${i === 18 ? 'bg-emerald-500 text-white font-bold' : 'hover:bg-emerald-100 text-stone-700'
                                    }`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Drafts Section */}
                {aiDrafts.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-3 flex items-center gap-2">
                            <Sparkles size={14} />
                            AI Drafts ({aiDrafts.length})
                        </h3>
                        <div className="space-y-2">
                            {aiDrafts.map(reflection => (
                                <button
                                    key={reflection.id}
                                    onClick={() => setSelectedReflection(reflection.id)}
                                    className={`w-full text-left p-3 rounded-xl transition-all border ${selectedReflection === reflection.id
                                        ? 'bg-gradient-to-r from-emerald-100 to-green-50 border-emerald-300 shadow-sm'
                                        : 'bg-white/50 border-emerald-100/50 hover:bg-emerald-50/50 hover:border-emerald-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="text-xs font-bold text-emerald-700">NEW</span>
                                        <div className="flex items-center gap-1 text-xs text-stone-500">
                                            <Clock size={12} />
                                            {reflection.time}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-stone-800 line-clamp-2">{reflection.title}</p>
                                    {reflection.conversationCount && (
                                        <p className="text-xs text-stone-500 mt-1">
                                            From {reflection.conversationCount} conversation{reflection.conversationCount > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Approved Reflections */}
                {approvedReflections.length > 0 && (
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-stone-600 font-bold mb-3">
                            Your Reflections ({approvedReflections.length})
                        </h3>
                        <div className="space-y-2">
                            {approvedReflections.map(reflection => (
                                <button
                                    key={reflection.id}
                                    onClick={() => setSelectedReflection(reflection.id)}
                                    className={`w-full text-left p-3 rounded-xl transition-all border ${selectedReflection === reflection.id
                                        ? 'bg-gradient-to-r from-emerald-100 to-green-50 border-emerald-300 shadow-sm'
                                        : 'bg-white/50 border-stone-100 hover:bg-stone-50 hover:border-stone-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={12} className="text-stone-500" />
                                        <span className="text-xs text-stone-500">{reflection.date}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-stone-800 line-clamp-2">{reflection.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 relative z-10 overflow-y-auto">
                {selectedItem ? (
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">{selectedItem.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-stone-500">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {selectedItem.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    {selectedItem.time}
                                </div>
                            </div>
                        </div>

                        {/* Emotional Patterns */}
                        {selectedItem.emotionalPatterns && (
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
                        )}

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
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50/50 border border-emerald-200 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                        <Brain size={16} />
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
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {selectedItem.type === 'ai-draft' ? (
                                editMode ? (
                                    <>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-300/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={18} />
                                            Save Changes
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
                                            onClick={() => selectedReflection && handleApprove(selectedReflection)}
                                            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-300/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={18} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => { setEditMode(true); setEditedContent(selectedItem?.aiSummary || selectedItem?.content || ''); }}
                                            className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-all flex items-center gap-2"
                                        >
                                            <Edit3 size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="px-6 py-3 bg-rose-50 text-rose-700 rounded-xl font-semibold hover:bg-rose-100 transition-all flex items-center gap-2"
                                        >
                                            <X size={16} />
                                            Reject
                                        </button>
                                    </>
                                )
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-stone-500">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                            <p>Select a reflection to view</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
