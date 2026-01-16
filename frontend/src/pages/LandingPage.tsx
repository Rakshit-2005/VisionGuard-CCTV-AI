import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield,
  Video,
  HardHat,
  Users,
  BarChart3,
  Bell,
  FileCheck,
  CheckCircle,
  ArrowRight,
  Building2,
} from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Real-Time Camera Monitoring',
    description: 'Connect unlimited RTSP/IP cameras across sites. AI analyzes feeds 24/7 to detect safety violations instantly.',
  },
  {
    icon: HardHat,
    title: 'Automated PPE Detection',
    description: 'Detect missing helmets, safety vests, gloves, boots, and harnesses. Immediate alerts for non-compliance.',
  },
  {
    icon: Users,
    title: 'Worker Management',
    description: 'Register workers, assign sites, track PPE requirements. Bulk import via CSV for easy onboarding.',
  },
  {
    icon: BarChart3,
    title: 'Compliance Analytics',
    description: 'Track safety ratings, violation trends, and compliance scores. Generate reports for regulators.',
  },
  {
    icon: Bell,
    title: 'Automatic Escalations',
    description: 'Configure escalation rules. Notify supervisors, safety officers, or authorities based on severity.',
  },
  {
    icon: FileCheck,
    title: 'Regulatory Compliance',
    description: 'Meet OSHA, local safety regulations, and government requirements. Audit-ready documentation.',
  },
];

const complianceFeatures = [
  'OSHA construction safety standards compliance',
  'Automated violation logging with timestamps',
  'Audit trail for all safety incidents',
  'Exportable reports for regulatory submissions',
  'Real-time alerts to designated authorities',
  'GST-registered company verification',
];

const trustedCompanies = ['BuildCorp', 'SafeStruct', 'PrimeConstruct', 'MetroBuild'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">SafetyAI</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2">Construction Safety Platform</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Compliance
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-30" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Government Compliant Safety Monitoring</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Automated Safety Detection for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Construction Sites
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered real-time monitoring to detect PPE violations, ensure worker safety, and maintain regulatory compliance across all your construction sites.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by leading construction companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {trustedCompanies.map((company) => (
              <div key={company} className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-5 h-5" />
                <span className="font-semibold text-lg">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Enterprise-Grade Safety Monitoring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to monitor, track, and ensure compliance across your entire operation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built for Regulatory Compliance
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform is designed to meet the strictest safety regulations and government requirements. Every feature is built with compliance in mind.
              </p>
              
              <ul className="space-y-4">
                {complianceFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-8 gap-2" asChild>
                <Link to="/register">
                  Register Your Company
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Safety Compliance Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">94.2%</span>
                        <span className="text-sm text-success">+12% this month</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">Across 12 active sites</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">156</p>
                      <p className="text-xs text-muted-foreground">Workers</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">24</p>
                      <p className="text-xs text-muted-foreground">Cameras</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-warning">3</p>
                      <p className="text-xs text-muted-foreground">Active Alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Improve Your Safety Compliance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of construction companies using SafetyAI to protect their workers and maintain regulatory compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/register">
                  Start Your Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">SafetyAI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 SafetyAI Construction Safety Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
