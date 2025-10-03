import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Database, Cloud, Target } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent mb-6">
              Advertising That Works for Business and Planet
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto">
              We're building the future of sustainable digital marketing—where effectiveness and environmental responsibility go hand in hand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/company">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105">
                  Get Started
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
                  View Pricing
                </Button>
              </Link>
              <Link to="/#solution">
                <Button className="border-2 border-slate-600 text-slate-600 hover:bg-slate-50 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🎯</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Our Mission
              </h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-8 text-center">
                <CardDescription className="text-lg leading-relaxed text-slate-700">
                  Digital advertising shouldn't come at the planet's expense. GreenReach Ads proves that businesses can achieve better campaign results while dramatically reducing their environmental footprint. Through intelligent AI optimization and energy-efficient infrastructure, we're making sustainable advertising the new standard.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* The Problem We're Solving Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">⚠️</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                The Problem We're Solving
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl mb-4 text-center">The Energy Crisis in AI Advertising</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Traditional AI-powered advertising platforms consume massive computational resources. Energy expenditure occurs across data collection, model training, inference, and data center operations. As AI adoption accelerates, this environmental cost continues to escalate unchecked.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl mb-4 text-center">Wasted Budgets, Wasted Resources</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Poor targeting wastes approximately 60% of digital ad spend—costing businesses billions while frustrating consumers with irrelevant content. This inefficiency compounds the environmental problem: energy is burned serving ads that never convert.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">✨</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                How We're Different
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-4">Data-Centric AI</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Research shows that optimizing datasets can reduce energy consumption by up to <span className="font-bold text-emerald-600">92%</span> with minimal accuracy loss. We prioritize high-quality, well-labeled data over vast quantities of noisy information—maximizing output while minimizing resource use.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-4">Lightweight Models</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  We utilize optimized language models requiring <span className="font-bold text-emerald-600">40% less</span> computational power than standard alternatives. Through intelligent caching, batch processing, and smart model selection, we eliminate unnecessary computation at every stage.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-4">Renewable Infrastructure</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  We deploy exclusively on cloud providers with strong renewable energy commitments, prioritizing data centers in regions with high clean energy availability. Our smart scheduling aligns processing with peak renewable energy windows.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Sustainability Commitment Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🌱</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Our Environmental Commitment
              </h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-8 text-center">
                <div className="text-6xl font-bold text-emerald-600 mb-4">60%</div>
                <CardTitle className="text-2xl mb-4">Energy Reduction</CardTitle>
                <CardDescription className="text-lg leading-relaxed text-slate-700 mb-6">
                  Compared to traditional platforms
                </CardDescription>
                <CardDescription className="text-base leading-relaxed text-slate-600">
                  We track our impact through rigorous measurement frameworks including Absolute and Relative Risk Reduction metrics, efficiency ratios, and carbon intensity modeling. This isn't greenwashing—it's verifiable, transparent data.
                </CardDescription>
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700">
                    <strong>Transparency Promise:</strong> We're pursuing third-party sustainability certifications and maintain transparent ESG reporting standards.
                  </p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Team/Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🚀</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Built for the Future
              </h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-8 text-center">
                <CardDescription className="text-lg leading-relaxed text-slate-700">
                  GreenReach Ads was founded on the belief that technological progress and environmental responsibility aren't opposing forces. We're a team of engineers, marketers, and sustainability advocates building tools that prove effective business and ecological stewardship can coexist.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to make an impact?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join the sustainable advertising revolution and start creating campaigns that work for your business and the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/company">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Link to="/pricing">
              <Button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
                View Pricing
              </Button>
            </Link>
            <Link to="/#solution">
              <Button className="border-2 border-emerald-200 text-emerald-200 hover:bg-emerald-200 hover:text-emerald-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
