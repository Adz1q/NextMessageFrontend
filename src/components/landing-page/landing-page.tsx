"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquareText, Zap, ShieldCheck, Users, ExternalLink, ChevronRight, MessageCircle } from 'lucide-react';

const FeatureCard = ({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) => (
    <div className="flex flex-col items-center p-6 text-center bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="mb-4 text-primary">
            <Icon size={48} strokeWidth={1.5} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
);

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground"> 
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2" prefetch={false}>
                        <MessageCircle className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">NextMessage</span>
                    </Link>
                    <nav className="flex items-center gap-2 sm:gap-4">
                        <Link href="/sign-in" passHref prefetch={false}>
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/sign-up" passHref prefetch={false}>
                            <Button variant="default" size="sm">
                                Sign Up
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/5 via-background to-background">
                    <div className="px-4 md:px-6 text-center"> 
                        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground leading-tight">
                            Connect <span className="text-primary">Faster</span> and <span className="text-primary">More Securely</span>.
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-8">
                            NextMessage is a modern messaging platform that combines elegance with performance. Join us and discover a new dimension of communication.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center"> 
                            <Link href="/sign-up" passHref prefetch={false}>
                                <Button size="lg" className="w-full sm:w-auto">
                                    Get Started Free
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="#features" passHref prefetch={false}>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-16 md:py-24 bg-muted/40">
                    <div className="px-4 md:px-6">
                        <div className="mb-12 text-center"> 
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                                Why NextMessage?
                            </h2>
                            <p className="mt-3 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                                We built NextMessage with you in mind – your privacy, convenience, and need to stay connected.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                            <FeatureCard
                                icon={MessageSquareText}
                                title="Real-time Conversations"
                                description="Messages appear instantly, without delay, ensuring a smooth and dynamic conversation flow."
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Modern Interface"
                                description="A clean, intuitive, and aesthetically pleasing design that makes communication a pleasure."
                            />
                            <FeatureCard
                                icon={ShieldCheck}
                                title="Security & Privacy First"
                                description="Your conversations are important. We use modern methods to protect your data and ensure privacy."
                            />
                            <FeatureCard
                                icon={Users}
                                title="Easy Contact Management"
                                description="Simple friend additions and intuitive management of your contact list and groups."
                            />
                             <FeatureCard
                                icon={ExternalLink}
                                title="Integrations (Coming Soon!)"
                                description="We are planning integrations with popular tools to streamline your workflow."
                            />
                             <FeatureCard
                                icon={Zap}
                                title="Cross-Platform Availability"
                                description="Use NextMessage on your desktop and mobile devices (mobile app in development)."
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full py-20 md:py-32">
                    <div className="px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mb-8">
                            Join thousands of users already enjoying a new quality of communication. Registration takes only a moment.
                        </p>
                        <Link href="/sign-up" passHref prefetch={false}>
                            <Button size="lg" className="w-full max-w-xs mx-auto">
                                Create Your NextMessage Account
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <footer className="w-full border-t bg-muted/20">
                <div className="flex flex-col items-center justify-center gap-2 h-20 px-4 text-center sm:h-16 sm:flex-row sm:justify-between md:px-6">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} NextMessage. All rights reserved.
                    </p>
                    <nav className="flex gap-4 sm:gap-6 text-xs">
                        <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
