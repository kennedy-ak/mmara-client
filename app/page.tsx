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
  Check
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary-foreground" />
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
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-foreground text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Legal First-Aid for Ghanaians
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Know Your Rights,{" "}
              <span className="text-primary">
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
                <Button size="lg" className="text-lg px-8">
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
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Legal Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Instant</div>
              <div className="text-sm text-muted-foreground">Responses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-muted/30">
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
            />
            <FeatureCard
              icon={<Gavel className="w-6 h-6" />}
              title="Traffic Regulations"
              description="Understand Road Traffic Acts, traffic stops, vehicle searches, and penalties for various offenses."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Safety Guards"
              description="Built-in safety mechanisms identify emergency situations and provide appropriate guidance and disclaimers."
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Natural Conversations"
              description="Chat naturally with MMara. Ask questions in plain English and get clear, easy-to-understand answers."
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Legal Citations"
              description="Every response includes specific legal citations - Acts, Sections, and relevant case law references."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Answers"
              description="Powered by advanced AI and optimized retrieval systems for lightning-fast legal information."
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
      <section className="py-20 lg:py-32 bg-muted/30">
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
          <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Know Your Rights Today
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
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
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
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
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary-foreground" />
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
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
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
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          {number}
        </div>
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-primary">
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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
