'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, BarChart3, Brain, Lightbulb, AlertTriangle, Heart, Smile, Frown, Meh, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { getMoodTrends, getAnxietyPatterns, getInsights } from '@/utils/api';

export default function InsightsPage() {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [timeRange, setTimeRange] = useState<'week' | 'month'>('week'); // Removed 'year' as daily breakdown isn't as useful without chart
    const [loading, setLoading] = useState(true);
    const [moodData, setMoodData] = useState<any>(null);
    const [anxietyData, setAnxietyData] = useState<any>(null);
    const [insightsData, setInsightsData] = useState<any>(null);

    // Load analytics data
    useEffect(() => {
        if (user) {
            loadAnalytics();
        }
    }, [user, timeRange]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const period = timeRange === 'week' ? 'weekly' : 'monthly';

            const [mood, anxiety, insights] = await Promise.all([
                getMoodTrends(user!.id, timeRange, token),
                getAnxietyPatterns(user!.id, 30, token),
                getInsights(user!.id, period, token)
            ]);

            setMoodData(mood);
            setAnxietyData(anxiety);
            setInsightsData(insights);
        } catch (err) {
            console.error('Error loading analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-sky-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-sky-50 w-24 h-24 rounded-full flex items-center justify-center shadow-lg shadow-sky-100 border border-sky-100">
                        <BarChart3 size={40} className="text-sky-500 animate-pulse" />
                    </div>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Analyzing Your Patterns</h2>
                <p className="text-stone-500 text-center max-w-sm">
                    Whiz is gathering your emotional trends to help you understand yourself better.
                </p>
            </div>
        );
    }

    if (!moodData || moodData.message_count === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
                <div className="absolute top-8 left-8 z-20">
                    <Link href="/dashboard" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors py-2 px-4 rounded-full hover:bg-white/50 backdrop-blur-sm border border-sky-100/50 text-sm font-medium">
                        <ArrowLeft size={16} />
                        <span>Dashboard</span>
                    </Link>
                </div>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-sky-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-serif text-stone-700 mb-2">No Analytics Yet</h2>
                        <p className="text-stone-500">Start chatting with Whiz to see your insights!</p>
                        <Link href="/features/chat" className="mt-4 inline-block px-6 py-3 bg-sky-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-sky-200 transition-all">
                            Start Chatting
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Process Data
    const getEmotionConfig = (emotion: string) => {
        const e = emotion.toLowerCase();

        // Positive - Yellow
        if (['joy', 'excitement', 'optimism', 'happy', 'love', 'gratitude'].includes(e))
            return { icon: Smile, color: 'bg-yellow-400' };

        // Sadness - Sky Blue
        if (['sadness', 'grief', 'loneliness', 'remorse'].includes(e))
            return { icon: Frown, color: 'bg-sky-400' };

        // Anger - Red
        if (['anger', 'annoyance', 'disapproval', 'disgust', 'hate'].includes(e))
            return { icon: AlertTriangle, color: 'bg-rose-500' };

        // Fear/Anxiety - Orange
        if (['fear', 'nervousness', 'anxiety', 'worried', 'panic'].includes(e))
            return { icon: AlertTriangle, color: 'bg-orange-400' };

        // Confusion - Purple 
        if (['confusion', 'uncertainty', 'doubt'].includes(e))
            return { icon: HelpCircle, color: 'bg-violet-400' };

        // Disappointment - Indigo
        if (['disappointment', 'embarrassment'].includes(e))
            return { icon: Frown, color: 'bg-indigo-400' };

        // Caring/Admiration - Pale rose
        if (['caring', 'admiration', 'pride', 'relief'].includes(e))
            return { icon: Heart, color: 'bg-rose-400' };

        // Neutral - Grey
        if (['neutral', 'calm', 'realization', 'indifference', 'curiosity'].includes(e))
            return { icon: Meh, color: 'bg-stone-400' };

        // Default
        return { icon: Sparkles, color: 'bg-sky-400' };
    };

    const emotionalBreakdown = moodData.dominant_emotions?.slice(0, 5).map((item: any) => {
        const total = moodData.dominant_emotions.reduce((sum: number, e: any) => sum + e.count, 0);
        const config = getEmotionConfig(item.emotion);

        return {
            emotion: item.emotion,
            percentage: Math.round((item.count / total) * 100),
            color: config.color,
            icon: config.icon
        };
    }) || [];

    const aiInsights = insightsData?.insights?.map((insight: string, idx: number) => {
        const titles = ["Mood Trend", "Emotional Pattern", "Anxiety Analysis", "Progress Update"];
        return {
            id: idx,
            title: titles[idx] || "Insight",
            description: insight,
            icon: Brain,
            color: idx === 0 ? 'purple' : idx === 1 ? 'sky' : idx === 2 ? 'amber' : 'emerald'
        };
    }) || [];

    const recommendations = insightsData?.recommendations?.map((rec: string, idx: number) => ({
        id: idx,
        text: rec,
        icon: Lightbulb
    })) || [];

    const anxietyTriggers = anxietyData?.triggers?.map((item: any) => ({
        trigger: item.trigger,
        frequency: item.count,
        severity: item.count > 5 ? 'high' : item.count > 2 ? 'medium' : 'low'
    })) || [];

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A26] font-sans relative flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-sky-50/40 via-blue-50/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-100/30 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-50 px-6 py-4 flex items-center gap-4 border-b border-sky-100/50 bg-white/80 backdrop-blur-xl sticky top-0">
                <Link href="/dashboard" className="p-2 hover:bg-sky-50 rounded-full transition-colors text-sky-600">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                        <BarChart3 size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold text-stone-900">Insights</h1>
                        <p className="text-xs text-stone-500">Your emotional patterns</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Row 1: Emotional Breakdown & Anxiety (Replaces Mood Trend) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Emotional Breakdown */}
                        <div className="bg-white/80 backdrop-blur-sm border border-sky-100/50 rounded-2xl p-6 shadow-lg flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900">Emotional Breakdown</h3>
                                    <p className="text-sm text-stone-500">How you've been feeling lately</p>
                                </div>
                                <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Sparkles size={14} />
                                    Top: <span className="capitalize">{moodData.dominant_emotions?.[0]?.emotion || 'Neutral'}</span>
                                </div>
                            </div>

                            <div className="space-y-5 flex-1 overflow-y-auto pr-2">
                                {emotionalBreakdown.length > 0 ? emotionalBreakdown.map((item: any, idx: number) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={idx} className="group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-lg ${item.color.replace('bg-', 'bg-opacity-20 text-').replace('400', '700')} bg-opacity-20`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-stone-700 capitalize">{item.emotion}</span>
                                                </div>
                                                <span className="text-sm font-bold text-stone-900">{item.percentage}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out group-hover:brightness-95`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="flex flex-col items-center justify-center h-48 text-stone-400">
                                        <Meh size={48} className="mb-2 opacity-20" />
                                        <p>No enough data yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Anxiety Triggers */}
                        <div className="bg-white/80 backdrop-blur-sm border border-sky-100/50 rounded-2xl p-6 shadow-lg flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <AlertTriangle size={20} className="text-rose-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900">Anxiety Triggers</h3>
                                    <p className="text-sm text-stone-500">Identified stress patterns</p>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                                {anxietyTriggers.length > 0 ? anxietyTriggers.map((trigger: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50/80 to-white border border-rose-100/50 rounded-xl hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-rose-500 font-bold shadow-sm border border-rose-100 text-sm group-hover:scale-110 transition-transform">
                                                {trigger.frequency}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-stone-800 text-sm">{trigger.trigger}</h4>
                                                <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">{trigger.severity} IMPACT</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center flex-1 min-h-64 text-stone-400 bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
                                        <CheckCircle2 size={32} className="mb-2 text-emerald-400" />
                                        <p className="text-sm">No anxiety triggers detected!</p>
                                        <p className="text-xs">Great job maintaining balance.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: AI Insights (First 3 in a row) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiInsights.slice(0, 3).map((insight: any) => (
                            <div key={insight.id} className="bg-white/90 backdrop-blur border border-sky-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`p-2 rounded-lg bg-${insight.color}-100 text-${insight.color}-600`}>
                                        <insight.icon size={18} />
                                    </div>
                                    <h4 className="font-bold text-stone-800">{insight.title}</h4>
                                </div>
                                <p className="text-sm text-stone-600 leading-relaxed">{insight.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Row 3: Suggestions (Full Width, Horizontal) */}
                    {recommendations.length > 0 && (
                        <div className="bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/30 border border-emerald-100/50 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb size={20} className="text-emerald-600" />
                                <h3 className="text-lg font-bold text-stone-900">Suggestions</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recommendations.map((rec: any) => (
                                    <div key={rec.id} className="flex gap-3 text-sm text-stone-700 bg-white/80 p-4 rounded-xl border border-emerald-100/50 shadow-sm hover:shadow-md transition-all">
                                        <div className="mt-0.5 min-w-[4px] h-4 rounded-full bg-emerald-400" />
                                        <p>{rec.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-emerald-100/50 text-center">
                                <Link href="/features/chat" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide">
                                    Start a new session →
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
