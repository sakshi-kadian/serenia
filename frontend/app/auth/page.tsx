'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn, useSignUp, useUser } from '@clerk/nextjs';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function AuthPage() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const router = useRouter();
    const { signIn, setActive: setActiveSignIn } = useSignIn();
    const { signUp, setActive: setActiveSignUp } = useSignUp();
    const { isSignedIn, isLoaded } = useUser();

    // Redirect if already signed in
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push('/dashboard');
        }
    }, [isLoaded, isSignedIn, router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!signIn) return;

            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === 'complete') {
                await setActiveSignIn({ session: result.createdSessionId });
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!signUp) return;

            const result = await signUp.create({
                emailAddress: email,
                password,
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' ') || undefined,
            });

            // Prepare email verification
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            // Show verification UI
            setIsVerifying(true);
            setError('Verification code sent to your email!');
        } catch (err: any) {
            console.error('Sign up error:', err);
            setError(err.errors?.[0]?.message || err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!signUp) return;

            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (result.status === 'complete') {
                await setActiveSignUp({ session: result.createdSessionId });
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.errors?.[0]?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!signIn) return;

            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });

            setError('Password reset email sent! Check your inbox.');
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF7] text-[#2C2A26] font-sans selection:bg-rose-100 selection:text-rose-900 overflow-hidden relative">

            {/* 1. WARM GRADIENT BACKGROUND - Smooth & Beautiful */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at top, #fde68a 0%, #ffedd5 50%, #fde68a 100%)'
                }} />
            </div>

            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="flex items-center gap-2 text-[#57534E] hover:text-[#2C2A26] transition-colors py-2 px-4 rounded-full hover:bg-white/30 backdrop-blur-md border border-white/20 hover:border-white/40 text-xs font-medium uppercase tracking-wide">
                    <ArrowLeft size={14} />
                    <span>Return</span>
                </Link>
            </div>

            {/* 2. THE CARD - Premium White Glassmorphism */}
            <div className="relative z-10 w-full max-w-[460px] px-4">

                <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_80px_-10px_rgba(202,138,4,0.3)] border border-white/80 p-8 animate-fade-in-up overflow-hidden">

                    {/* Content wrapper */}
                    <div className="relative z-10">
                        {isForgotPassword ? (
                            /* FORGOT PASSWORD VIEW */
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-serif font-medium bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent tracking-tight">
                                        Reset Password
                                    </h1>
                                    <p className="text-sm text-yellow-700/70 mt-3">Enter your email to receive a reset link</p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                                        {error}
                                    </div>
                                )}

                                {/* FORM */}
                                <form className="space-y-3" onSubmit={handleForgotPassword}>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-3.5 bg-white/70 border border-yellow-100/60 hover:border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-200/60 focus:border-yellow-300 focus:bg-white transition-all placeholder:text-yellow-500/60 text-sm text-yellow-700 font-medium shadow-sm disabled:opacity-50"
                                            placeholder="Email Address"
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500/60 group-focus-within:text-yellow-600 transition-colors" size={16} />
                                    </div>

                                    {/* THE BUTTON */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-2 bg-yellow-200 shadow-[0_8px_24px_-4px_rgba(250,204,21,0.3)] text-yellow-800 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_12px_32px_-4px_rgba(250,204,21,0.4)] hover:bg-yellow-300 hover:scale-[1.02] transform transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>

                                    {/* Back to Sign In */}
                                    <div className="text-center pt-3">
                                        <button type="button" onClick={() => { setIsForgotPassword(false); setError(''); }} className="text-xs text-yellow-700 hover:text-yellow-800 font-medium transition-colors uppercase tracking-wider cursor-pointer">
                                            Back to Sign In
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : isVerifying ? (
                            /* EMAIL VERIFICATION VIEW */
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-serif font-medium bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent tracking-tight">
                                        Verify Your Email
                                    </h1>
                                    <p className="text-sm text-yellow-700/70 mt-3">Enter the code sent to {email}</p>
                                </div>

                                {/* Error/Success Message */}
                                {error && (
                                    <div className={`mb-4 p-3 border rounded-lg text-xs ${error.includes('sent') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                        {error}
                                    </div>
                                )}

                                {/* FORM */}
                                <form className="space-y-3" onSubmit={handleVerifyEmail}>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            required
                                            disabled={loading}
                                            maxLength={6}
                                            className="w-full pl-10 pr-4 py-3.5 bg-white/70 border border-yellow-100/60 hover:border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-200/60 focus:border-yellow-300 focus:bg-white transition-all placeholder:text-yellow-500/60 text-sm text-yellow-700 font-medium shadow-sm disabled:opacity-50 text-center tracking-widest text-lg"
                                            placeholder="000000"
                                        />
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500/60 group-focus-within:text-yellow-600 transition-colors" size={16} />
                                    </div>

                                    {/* THE BUTTON */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-2 bg-yellow-200 shadow-[0_8px_24px_-4px_rgba(250,204,21,0.3)] text-yellow-800 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_12px_32px_-4px_rgba(250,204,21,0.4)] hover:bg-yellow-300 hover:scale-[1.02] transform transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Verifying...' : 'Verify Email'}
                                    </button>

                                    {/* Back to Sign Up */}
                                    <div className="text-center pt-3">
                                        <button type="button" onClick={() => { setIsVerifying(false); setError(''); }} className="text-xs text-yellow-700 hover:text-yellow-800 font-medium transition-colors uppercase tracking-wider cursor-pointer">
                                            Back to Sign Up
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            /* LOGIN/SIGNUP VIEW */
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-serif font-medium bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent tracking-tight">
                                        {isSignIn ? "Welcome Back" : "Join Serenia"}
                                    </h1>
                                </div>

                                {/* TOGGLE SWITCH */}
                                <div className="relative p-1 bg-yellow-100 rounded-xl flex mb-6">
                                    {/* Sliding background */}
                                    <div
                                        className={`absolute inset-y-1 w-[calc(50%-4px)] bg-yellow-200 rounded-lg shadow-md transition-all duration-300 ${isSignIn ? 'left-1' : 'left-[calc(50%+2px)]'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setIsSignIn(true); setError(''); }}
                                        className={`relative z-10 w-1/2 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${isSignIn ? 'text-yellow-900' : 'text-yellow-700/70'}`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsSignIn(false); setError(''); }}
                                        className={`relative z-10 w-1/2 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${!isSignIn ? 'text-yellow-900' : 'text-yellow-700/70'}`}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                                        {error}
                                    </div>
                                )}

                                {/* FORM */}
                                <form className="space-y-3" onSubmit={isSignIn ? handleSignIn : handleSignUp}>
                                    {!isSignIn && (
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="w-full pl-10 pr-4 py-3.5 bg-white/70 border border-yellow-100/60 hover:border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-200/60 focus:border-yellow-300 focus:bg-white transition-all placeholder:text-yellow-500/60 text-sm text-yellow-700 font-medium shadow-sm disabled:opacity-50"
                                                placeholder="Full Name"
                                            />
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500/60 group-focus-within:text-yellow-600 transition-colors" size={16} />
                                        </div>
                                    )}

                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-3.5 bg-white/70 border border-yellow-100/60 hover:border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-200/60 focus:border-yellow-300 focus:bg-white transition-all placeholder:text-yellow-500/60 text-sm text-yellow-700 font-medium shadow-sm disabled:opacity-50"
                                            placeholder="Email Address"
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500/60 group-focus-within:text-yellow-600 transition-colors" size={16} />
                                    </div>

                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-3.5 bg-white/70 border border-yellow-100/60 hover:border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-200/60 focus:border-yellow-300 focus:bg-white transition-all placeholder:text-yellow-500/60 text-sm text-yellow-700 font-medium shadow-sm disabled:opacity-50"
                                            placeholder="Password"
                                        />
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500/60 group-focus-within:text-yellow-600 transition-colors" size={16} />
                                    </div>

                                    {isSignIn && (
                                        <div className="flex justify-end pt-1">
                                            <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); }} className="text-xs text-yellow-700 hover:text-yellow-800 font-medium transition-colors uppercase tracking-wider cursor-pointer">Forgot password?</button>
                                        </div>
                                    )}

                                    {/* THE BUTTON - Pure Golden Gradient */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 mt-2 bg-yellow-200 shadow-[0_8px_24px_-4px_rgba(250,204,21,0.3)] text-yellow-800 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_12px_32px_-4px_rgba(250,204,21,0.4)] hover:bg-yellow-300 hover:scale-[1.02] transform transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Please wait...' : (isSignIn ? "Continue" : "Create Account")}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
