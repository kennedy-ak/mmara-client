import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Scale,
  ShieldCheck,
  MessageSquare,
  Zap,
  BookOpen,
  Clock,
  Gavel,
  Users,
  ChevronRight,
  Check,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-green-600 flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">MMara</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
                How It Works
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition">
                About
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Legal First-Aid for Ghanaians
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Know Your Rights,{" "}
              <span className="bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
                Anytime, Anywhere
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              MMara is your intelligent legal companion that provides instant access to Ghanaian laws,
              criminal procedures, and traffic regulations. Get accurate legal information in seconds,
              not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700 text-lg px-8">
                  Start Free Trial
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free tier available
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">500+</div>
              <div className="text-sm text-muted-foreground">Legal Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-muted-foreground">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Instant</div>
              <div className="text-sm text-muted-foreground">Responses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Understand Your Rights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MMara combines cutting-edge AI with comprehensive Ghanaian legal databases to deliver
              accurate, context-aware legal information.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Scale className="w-6 h-6" />}
              title="Criminal Law Knowledge"
              description="Access information about Criminal Act 29, Criminal Procedure Code, and your rights during arrests and detentions."
              color="from-red-500 to-pink-600"
            />
            <FeatureCard
              icon={<Gavel className="w-6 h-6" />}
              title="Traffic Regulations"
              description="Understand Road Traffic Acts, traffic stops, vehicle searches, and penalties for various offenses."
              color="from-blue-500 to-cyan-600"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Safety Guards"
              description="Built-in safety mechanisms identify emergency situations and provide appropriate guidance and disclaimers."
              color="from-green-500 to-emerald-600"
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Natural Conversations"
              description="Chat naturally with MMara. Ask questions in plain English and get clear, easy-to-understand answers."
              color="from-purple-500 to-violet-600"
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Legal Citations"
              description="Every response includes specific legal citations - Acts, Sections, and relevant case law references."
              color="from-amber-500 to-orange-600"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Answers"
              description="Powered by advanced AI and optimized retrieval systems for lightning-fast legal information."
              color="from-yellow-500 to-amber-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How MMara Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get legal guidance in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number="1"
              title="Ask Your Question"
              description="Describe your legal situation or ask a question in plain language. Whether it's about traffic violations, arrest procedures, or search rights."
              icon={<MessageSquare className="w-8 h-8" />}
            />
            <StepCard
              number="2"
              title="AI Analysis"
              description="MMara's multi-agent system analyzes your query, retrieves relevant legal documents, and prepares accurate responses with proper citations."
              icon={<Zap className="w-8 h-8" />}
            />
            <StepCard
              number="3"
              title="Get Your Answer"
              description="Receive a clear, comprehensive response with legal references, explanations of your rights, and guidance on next steps."
              icon={<BookOpen className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Legal Coverage */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Comprehensive Legal Coverage
              </h2>
              <p className="text-lg text-muted-foreground">
                MMara covers essential areas of Ghanaian law
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CoverageCard
                title="Road Traffic Law"
                items={[
                  "RTA 683 and amendments",
                  "Traffic stop procedures",
                  "Vehicle search rights",
                  "DUI/DWI penalties",
                  "Dangerous driving offenses",
                  "Accident reporting requirements"
                ]}
                icon={<Gavel className="w-5 h-5" />}
              />
              <CoverageCard
                title="Criminal Law"
                items={[
                  "Criminal Act 29 provisions",
                  "Arrest and detention rights",
                  "Bail procedures",
                  "Search and seizure laws",
                  "Rights during questioning",
                  "Evidence Act requirements"
                ]}
                icon={<Scale className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-amber-500 to-green-600 border-0 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Know Your Rights Today
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of Ghanaians who use MMara to understand their legal rights.
                Start with our free tier - no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="text-lg px-8">
                    Create Free Account
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-green-600 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">MMara</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                AI-powered legal first-aid assistant for Ghanaians.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/register" className="hover:text-foreground">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/about" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/about" className="hover:text-foreground">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Important</h4>
              <p className="text-sm text-muted-foreground">
                MMara provides legal information, not legal advice. Always consult a qualified lawyer for legal matters.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MMara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
  icon
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative">
      <CardContent className="p-6 text-center">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
          {number}
        </div>
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-amber-600">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function CoverageCard({
  title,
  items,
  icon
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Check className="w-5 h-5 text-green-600 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
