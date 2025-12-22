'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Brain, Lightbulb, AlertTriangle, Heart, Smile, Frown, Meh, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { getMoodTrends, getAnxietyPatterns, getInsights } from '@/utils/api';

export default function InsightsPage() {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
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
            // Pass timeRange directly as period ('week', 'month', 'year') matches backend expectations
            const period = timeRange === 'week' ? 'weekly' : 'monthly'; // For insights endpoint

            const [mood, anxiety, insights] = await Promise.all([
                getMoodTrends(user!.id, timeRange, token), // Pass 'week', 'month', 'year'
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

    // Show loading state
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

    // Show empty state if no data
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

    // Transform backend data for charts with appropriate labels
    let moodTrend = [];

    if (timeRange === 'year' && moodData.daily_moods) {
        // Aggregate 365 days into 12 months
        const monthlyData: { [key: string]: { score: number, count: number, emotions: any[] } } = {};
        const monthOrder: string[] = [];

        moodData.daily_moods.forEach((day: any) => {
            const date = new Date(day.date);
            const monthLabel = date.toLocaleDateString('en-US', { month: 'short' }); // "Jan", "Feb"

            if (!monthlyData[monthLabel]) {
                monthlyData[monthLabel] = { score: 0, count: 0, emotions: [] };
                monthOrder.push(monthLabel);
            }

            monthlyData[monthLabel].score += day.mood_score;
            monthlyData[monthLabel].count += 1;
            monthlyData[monthLabel].emotions.push(day.dominant_emotion);
        });

        // Ensure we respect date order (though the map iteration usually does, explicitly using the order of appearance)
        moodTrend = monthOrder.map(month => {
            const data = monthlyData[month];
            const avgScore = data.score / data.count;
            // Find most frequent emotion for the month
            const emotionCounts = data.emotions.reduce((acc: any, curr: any) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});
            const topEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);

            return {
                day: month, // Label is "Jan", "Feb"
                score: avgScore,
                label: topEmotion,
                fullDate: month
            };
        });
    } else {
        // Week and Month views (Daily bars)
        moodTrend = moodData.daily_moods?.map((day: any) => {
            const date = new Date(day.date);
            let label = '';

            if (timeRange === 'week') {
                // Show day names (Mon, Tue...)
                label = date.toLocaleDateString('en-US', { weekday: 'short' });
            } else if (timeRange === 'month') {
                // Show just the date number (1, 2, 3...) to keep it clean
                label = date.getDate().toString();
            }

            return {
                day: label,
                score: day.mood_score,
                label: day.dominant_emotion,
                fullDate: day.date
            };
        }) || [];
    }

    const emotionalBreakdown = moodData.dominant_emotions?.slice(0, 4).map((item: any, idx: number) => {
        const colors = ['bg-amber-400', 'bg-sky-400', 'bg-rose-400', 'bg-stone-400'];
        const icons = [Smile, Heart, Frown, Meh];
        const total = moodData.dominant_emotions.reduce((sum: number, e: any) => sum + e.count, 0);
        return {
            emotion: item.emotion,
            percentage: Math.round((item.count / total) * 100),
            color: colors[idx] || 'bg-gray-400',
            icon: icons[idx] || Meh
        };
    }) || [];

    const aiInsights = insightsData?.insights?.map((insight: string, idx: number) => ({
        id: idx + 1,
        type: idx === 0 ? 'positive' : idx === 1 ? 'trigger' : 'recommendation',
        title: insight.split('.')[0],
        description: insight,
        icon: idx === 0 ? TrendingUp : idx === 1 ? AlertTriangle : Lightbulb,
        color: idx === 0 ? 'emerald' : idx === 1 ? 'rose' : 'purple'
    })) || [];

    const anxietyTriggers = anxietyData?.triggers?.map((item: any) => ({
        trigger: item.trigger,
        frequency: item.count,
        severity: item.count > 5 ? 'high' : item.count > 2 ? 'medium' : 'low'
    })) || [];

    const maxScore = Math.max(...moodTrend.map((d: any) => d.score));

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A26] font-sans relative flex flex-col">
            {/* Abstract Background */}
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
                <div className="ml-auto flex gap-2">
                    {(['week', 'month', 'year'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${timeRange === range
                                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Top Row: Mood Trend + Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Mood Trend Chart */}
                        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-sky-100/50 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900">Mood Trend</h3>
                                    <p className="text-sm text-stone-500">
                                        {timeRange === 'week' ? 'Last 7 days' : timeRange === 'month' ? 'Last 30 days' : 'Last 12 months'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-bold">
                                    <TrendingUp size={16} />
                                    +15% Better
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="h-64 flex items-end justify-between gap-3">
                                {moodTrend.map((data: any, i: number) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full relative group">
                                            <div
                                                className="w-full bg-gradient-to-t from-sky-400 to-sky-300 rounded-t-xl hover:from-sky-500 hover:to-sky-400 transition-all cursor-pointer"
                                                style={{ height: `${(data.score / maxScore) * 240}px` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {data.label} ({data.score}%)
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-stone-600">{data.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Emotional Breakdown */}
                        <div className="bg-white/80 backdrop-blur-sm border border-sky-100/50 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-lg font-bold text-stone-900 mb-4">Emotional Breakdown</h3>
                            <div className="space-y-4">
                                {emotionalBreakdown.map((item: any, idx: number) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Icon size={18} className="text-stone-600" />
                                                    <span className="text-sm font-semibold text-stone-700">{item.emotion}</span>
                                                </div>
                                                <span className="text-sm font-bold text-stone-900">{item.percentage}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.color} rounded-full transition-all`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* AI-Generated Insights */}
                    <div className="bg-white/80 backdrop-blur-sm border border-sky-100/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-5">
                            <Brain size={20} className="text-sky-600" />
                            <h3 className="text-lg font-bold text-stone-900">AI-Generated Insights</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {aiInsights.map((insight: any) => {
                                const Icon = insight.icon;
                                const colorMap = {
                                    emerald: 'from-emerald-500 to-emerald-600',
                                    rose: 'from-rose-500 to-rose-600',
                                    purple: 'from-purple-500 to-purple-600',
                                    sky: 'from-sky-500 to-sky-600'
                                };
                                return (
                                    <div key={insight.id} className="bg-gradient-to-br from-sky-50/50 to-white border border-sky-100 rounded-xl p-5 hover:shadow-md transition-all">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${colorMap[insight.color as keyof typeof colorMap]} rounded-lg flex items-center justify-center text-white mb-3 shadow-md`}>
                                            <Icon size={20} />
                                        </div>
                                        <h4 className="font-bold text-stone-900 mb-2">{insight.title}</h4>
                                        <p className="text-sm text-stone-600 leading-relaxed">{insight.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Anxiety Triggers */}
                    <div className="bg-white/80 backdrop-blur-sm border border-sky-100/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-5">
                            <AlertTriangle size={20} className="text-rose-600" />
                            <h3 className="text-lg font-bold text-stone-900">Anxiety Triggers</h3>
                        </div>
                        <div className="space-y-3">
                            {anxietyTriggers.map((trigger: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50/50 to-orange-50/30 border border-rose-100 rounded-xl hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 font-bold">
                                            {trigger.frequency}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">{trigger.trigger}</h4>
                                            <p className="text-xs text-stone-500">Occurred {trigger.frequency} times this week</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${trigger.severity === 'high'
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {trigger.severity.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
