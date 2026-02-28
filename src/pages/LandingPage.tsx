import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  BarChart3, 
  Target, 
  Brain, 
  Clock, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Shield
} from "lucide-react";
import heroImage from "@/assets/hero-study.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                StudyOS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" className="hidden sm:inline-flex font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="gradient-primary text-white hover:opacity-90 transition-smooth shadow-sm font-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-white opacity-60" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-100/40 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-medium text-sm mb-6 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Study Management</span>
              </div>
              
              <h1 className="text-display mb-6">
                Your Ultimate
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                  Study Operating System
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Built for serious JEE & NEET aspirants. Plan smarter, track progress, analyze performance, and achieve your goals with intelligent automation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/auth" className="sm:w-auto w-full">
                  <Button size="lg" className="w-full gradient-primary text-white hover:opacity-90 transition-smooth shadow-premium-lg hover:shadow-premium-xl font-semibold text-base h-12 px-8">
                    Start Free Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="#features" className="sm:w-auto w-full">
                  <Button size="lg" variant="outline" className="w-full border-2 border-gray-300 hover:border-violet-400 hover:bg-violet-50 transition-smooth font-semibold text-base h-12 px-8">
                    See Features
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Secure & Private</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-scale-in lg:animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-premium-xl border border-gray-200">
                <img 
                  src={heroImage} 
                  alt="Modern study workspace" 
                  className="w-full h-auto"
                />
                {/* Floating Stats Card */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-premium-xl p-5 border border-gray-100 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">95%</div>
                      <div className="text-sm text-gray-600 font-medium">Accuracy Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-medium text-sm mb-6">
              <Zap className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-heading-1 mb-5">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive tools designed specifically for competitive exam preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-premium hover:shadow-premium-lg transition-smooth border border-gray-100 hover:border-violet-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm mb-6">
            <Shield className="w-4 h-4" />
            <span>Trusted by thousands of students</span>
          </div>
          <h2 className="text-heading-1 text-white mb-6">
            Ready to Transform Your Study Routine?
          </h2>
          <p className="text-xl text-violet-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join students who are achieving their goals with StudyOS. Start organizing, tracking, and excelling today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-50 transition-smooth shadow-premium-xl hover:shadow-premium-xl hover:scale-105 font-semibold text-base h-14 px-10">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-lg font-bold text-gray-900">StudyOS</span>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              © 2026 StudyOS. Built for students who dream big.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Calendar,
    title: "Smart Daily Planner",
    description: "Plan your day with precision. Auto-reminders, session tracking, and intelligent time management with unlimited extensions.",
  },
  {
    icon: Brain,
    title: "Question Practice Tracker",
    description: "Log questions solved, track wrong answers, and identify patterns. Upload screenshots and build your personal error library.",
  },
  {
    icon: TrendingUp,
    title: "Exam Analytics",
    description: "Schedule exams, track results, and visualize your performance trends across multiple tests with motivational insights.",
  },
  {
    icon: Target,
    title: "Goal Planning",
    description: "Set weekly and monthly goals with flexible date ranges. Track progress and stay motivated with dynamic goal management.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Deep insights into your study patterns, accuracy rates, and improvement trends with interactive visualizations.",
  },
  {
    icon: Clock,
    title: "Smart Notifications",
    description: "Intelligent popup system that respects your preferences. Context-aware reminders and once-per-day notifications.",
  },
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "500K+", label: "Questions Solved" },
  { value: "95%", label: "Accuracy Rate" },
  { value: "24/7", label: "Always Available" },
];
