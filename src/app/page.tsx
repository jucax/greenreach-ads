import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, Leaf, FileText, Brain, Eye, Rocket } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import companyLogo1 from '../assets/company-logo-1.png';
import companyLogo2 from '../assets/company-logo-2.png';
import companyLogo3 from '../assets/company-logo-3.png';
import companyLogo4 from '../assets/company-logo-4.png';
import companyLogo5 from '../assets/company-logo-5.png';

export const LandingPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent mb-6">
              AI-Powered Advertising That Doesn't Cost the Earth
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto">
              Personalized campaigns that reach the right audience while cutting energy use by 60%
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('choose-path')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105"
              >
                Get Started
              </button>
              <Link to="/dashboard">
                <button className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105">
                  View Demo
                </button>
              </Link>
              <button
                onClick={() => scrollToSection('solution')}
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-4 px-8 rounded-lg text-lg transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🍃</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                The Hidden Cost of Digital Advertising
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="text-5xl mb-4">💸</div>
                <CardTitle className="text-xl mb-3">Wasted Budget</CardTitle>
                <CardDescription className="text-base">
                  <span className="font-bold text-emerald-600">63%</span> of ad spend reaches wrong audiences
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="text-5xl mb-4">🌍</div>
                <CardTitle className="text-xl mb-3">Environmental Impact</CardTitle>
                <CardDescription className="text-base">
                  Traditional AI campaigns generate <span className="font-bold text-red-600">35kg CO2</span>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section id="solution" className="py-20 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">✨</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Meet GreenReach Ads
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Energy-efficient AI that automates your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-4">Automated Campaigns</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  AI handles strategy, platforms, and scheduling in <span className="font-bold text-emerald-600">15 minutes</span>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-4">Personalized Content</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Generate tailored ad copy for different audiences <span className="font-bold text-emerald-600">instantly</span>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-4">Measurably Sustainable</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  <span className="font-bold text-emerald-600">60% less energy</span> through smart models and renewable infrastructure
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold text-slate-600 mb-8">Trusted By</h3>
          </div>
          
          <div className="flex justify-center items-center gap-6 lg:gap-8">
            <div className="w-48 h-36 bg-white rounded-lg flex items-center justify-center p-5 shadow-md hover:shadow-xl transition-shadow">
              <img 
                src={companyLogo1} 
                alt="Partner Company" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-48 h-36 bg-white rounded-lg flex items-center justify-center p-5 shadow-md hover:shadow-xl transition-shadow">
              <img 
                src={companyLogo2} 
                alt="Partner Company" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-48 h-36 bg-white rounded-lg flex items-center justify-center p-5 shadow-md hover:shadow-xl transition-shadow">
              <img 
                src={companyLogo3} 
                alt="Partner Company" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-48 h-36 bg-white rounded-lg flex items-center justify-center p-5 shadow-md hover:shadow-xl transition-shadow">
              <img 
                src={companyLogo4} 
                alt="Partner Company" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-48 h-36 bg-white rounded-lg flex items-center justify-center p-5 shadow-md hover:shadow-xl transition-shadow">
              <img 
                src={companyLogo5} 
                alt="Partner Company" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              From Product to Campaign in Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <div className="relative w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-emerald-600" />
                  <span className="absolute -top-2 -left-2 w-8 h-8 bg-emerald-600 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-lg">1</span>
                </div>
                <CardTitle className="text-lg mb-3 text-center mt-4">Describe Your Product</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Tell us about what you're advertising—features, benefits, target use cases. Upload product images and set your budget. The more detail you provide, the smarter our AI recommendations.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Step 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <div className="relative w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-emerald-600" />
                  <span className="absolute -top-2 -left-2 w-8 h-8 bg-emerald-600 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-lg">2</span>
                </div>
                <CardTitle className="text-lg mb-3 text-center mt-4">AI Analyzes & Strategizes</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Our agentic AI identifies your ideal audience demographics, selects the best platforms (Instagram, Facebook, Google), and determines optimal posting times—all while prioritizing energy-efficient processing.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Step 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <div className="relative w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-emerald-600" />
                  <span className="absolute -top-2 -left-2 w-8 h-8 bg-emerald-600 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-lg">3</span>
                </div>
                <CardTitle className="text-lg mb-3 text-center mt-4">Review Recommendations</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  See AI-generated ad copy variations for different audience segments, complete budget breakdowns, platform strategies, and real-time sustainability impact calculations before you launch.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Step 4 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <div className="relative w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-emerald-600" />
                  <span className="absolute -top-2 -left-2 w-8 h-8 bg-emerald-600 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-lg">4</span>
                </div>
                <CardTitle className="text-lg mb-3 text-center mt-4">Launch & Track</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Approve your campaign with one click. Monitor performance metrics, reach, conversions, and environmental impact from your dashboard. Our AI continues optimizing throughout the campaign.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Real Impact, Measured Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-10">
                <div className="text-5xl mb-4">⚡</div>
                <div className="text-5xl font-bold text-emerald-600 mb-2">60%</div>
                <CardTitle className="text-xl mb-2">Less Energy</CardTitle>
                <p className="text-slate-600">vs traditional platforms</p>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-10">
                <div className="text-5xl mb-4">📈</div>
                <div className="text-5xl font-bold text-emerald-600 mb-2">35%</div>
                <CardTitle className="text-xl mb-2">Higher ROI</CardTitle>
                <p className="text-slate-600">through better targeting</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">💚</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Smart Business Meets Environmental Responsibility
            </h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            Effective advertising and sustainability achieved together. <span className="font-bold text-emerald-600">Reduce your carbon footprint</span> while improving performance and gaining <span className="font-bold text-emerald-600">ESG credentials</span>.
          </p>
        </div>
      </section>

      {/* Choose Your Path Section */}
      <section id="choose-path" className="py-20 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started with GreenReach Ads in the way that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Companies */}
            <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col">
              <CardHeader className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <span className="text-6xl">🏢</span>
                </div>
                <CardTitle className="text-2xl mb-3 text-center">For Companies</CardTitle>
                <CardDescription className="text-base mb-6 flex-1">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Launch your organization's sustainable advertising hub</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Get AI-powered campaign automation and personalization</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Track energy savings and ESG impact across all campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Give your team the tools to create effective, responsible ads</span>
                    </li>
                  </ul>
                </CardDescription>
                <Link to="/register/company" className="block mt-auto">
                  <Button variant="default" size="lg" className="w-full">
                    Register Company
                  </Button>
                </Link>
              </CardHeader>
            </Card>

            {/* For Individuals */}
            <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col">
              <CardHeader className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <span className="text-6xl">👤</span>
                </div>
                <CardTitle className="text-2xl mb-3 text-center">For Individuals</CardTitle>
                <CardDescription className="text-base mb-6 flex-1">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Join your company with a team code</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Create and manage campaigns with AI assistance</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>See your personal sustainability impact</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Access the same professional tools as enterprise teams</span>
                    </li>
                  </ul>
                </CardDescription>
                <Link to="/register/individual" className="block mt-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Join as Individual
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Advertise Smarter?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join businesses proving sustainability and effectiveness go hand in hand
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('choose-path')}
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105"
            >
              Get Started
            </button>
            <Link to="/dashboard">
              <button className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105">
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};