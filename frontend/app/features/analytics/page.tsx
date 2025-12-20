'use client';
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Brain, Lightbulb, AlertTriangle, Heart, Smile, Frown, Meh, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function InsightsPage() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

    // Mock data
    const moodTrend = [
        { day: 'Mon', score: 65, label: 'Calm' },
        { day: 'Tue', score: 45, label: 'Anxious' },
        { day: 'Wed', score: 70, label: 'Happy' },
        { day: 'Thu', score: 80, label: 'Energetic' },
        { day: 'Fri', score: 75, label: 'Content' },
        { day: 'Sat', score: 85, label: 'Joyful' },
        { day: 'Sun', score: 90, label: 'Peaceful' }
    ];

    const emotionalBreakdown = [
        { emotion: 'Happy', percentage: 42, color: 'bg-amber-400', icon: Smile },
        { emotion: 'Calm', percentage: 28, color: 'bg-sky-400', icon: Heart },
        { emotion: 'Anxious', percentage: 18, color: 'bg-rose-400', icon: Frown },
        { emotion: 'Neutral', percentage: 12, color: 'bg-stone-400', icon: Meh }
    ];

    const aiInsights = [
        {
            id: 1,
            type: 'positive',
            title: 'Improved Sleep Pattern',
            description: 'Your mood scores are 23% higher on days when you mention getting 7+ hours of sleep.',
            icon: TrendingUp,
            color: 'emerald'
        },
        {
            id: 2,
            type: 'trigger',
            title: 'Tuesday Morning Anxiety',
            description: 'You tend to feel anxious on Tuesday mornings. Consider a 5-minute breathing exercise before work.',
            icon: AlertTriangle,
            color: 'rose'
        },
        {
            id: 3,
            type: 'recommendation',
            title: 'Social Connection Boost',
            description: 'Conversations with friends correlate with 31% improvement in your emotional state.',
            icon: Lightbulb,
            color: 'sky'
        }
    ];

    const anxietyTriggers = [
        { trigger: 'Work deadlines', frequency: 8, severity: 'high' },
        { trigger: 'Social events', frequency: 5, severity: 'medium' },
        { trigger: 'Sleep deprivation', frequency: 4, severity: 'high' },
        { trigger: 'Family concerns', frequency: 3, severity: 'medium' }
    ];

    const maxScore = Math.max(...moodTrend.map(d => d.score));

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
                                    <p className="text-sm text-stone-500">Last 7 days</p>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-bold">
                                    <TrendingUp size={16} />
                                    +15% Better
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="h-64 flex items-end justify-between gap-3">
                                {moodTrend.map((data, i) => (
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
                                {emotionalBreakdown.map((item, idx) => {
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
                            {aiInsights.map((insight) => {
                                const Icon = insight.icon;
                                const colorMap = {
                                    emerald: 'from-emerald-500 to-emerald-600',
                                    rose: 'from-rose-500 to-rose-600',
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
                            {anxietyTriggers.map((trigger, idx) => (
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
