import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Users, Building } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent mb-6">
              Plans That Scale With Your Impact
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto">
              From startups to enterprises—sustainable advertising for every business
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Starter Tier */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <CardHeader className="p-8 text-center flex-grow flex flex-col">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-slate-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Starter</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">$69</div>
                <div className="text-slate-600 mb-6">/month</div>
                <CardDescription className="text-base mb-6">
                  Perfect for testing the waters
                </CardDescription>
                
                <div className="space-y-4 mb-8 text-left flex-grow">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">1 campaign per month</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">AI-generated ad copy</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Basic targeting recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Sustainability metrics dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Community support</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link to="/register/company">
                    <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                      Start Free
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>

            {/* Professional Tier - Highlighted */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-500 relative flex flex-col">
              <CardHeader className="p-8 text-center flex-grow flex flex-col">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Professional</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">$129</div>
                <div className="text-slate-600 mb-6">/month</div>
                <CardDescription className="text-base mb-6">
                  For growing businesses ready to scale
                </CardDescription>
                
                <div className="space-y-4 mb-8 text-left flex-grow">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">10 campaigns per month</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Advanced AI optimization</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Multi-platform deployment</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">A/B testing & analytics</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Team collaboration tools</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Custom sustainability reporting</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link to="/register/company">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                      Start Professional
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>

            {/* Enterprise Tier */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <CardHeader className="p-8 text-center flex-grow flex flex-col">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">$259</div>
                <div className="text-slate-600 mb-6">/month</div>
                <CardDescription className="text-base mb-6">
                  For large organizations with complex needs
                </CardDescription>
                
                <div className="space-y-4 mb-8 text-left flex-grow">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Unlimited campaigns</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Custom AI model training</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">White-label solutions</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Dedicated account manager</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">24/7 phone support</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Advanced security & compliance</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-sm">Custom integrations</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                    Contact Sales
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">📊</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Feature Comparison
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what's included in each plan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Features</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Starter</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-600">Professional</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-purple-600">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Monthly Campaigns</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">1</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">10</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">AI-Generated Content</td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Multi-Platform Deployment</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">A/B Testing</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Team Collaboration</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Custom AI Models</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">White-Label Solutions</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Support Level</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">Community</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">Priority</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">24/7 Phone</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sustainability Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🌱</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Sustainability Impact
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every plan includes our commitment to environmental responsibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">60%</div>
                <CardTitle className="text-xl mb-4">Energy Reduction</CardTitle>
                <CardDescription className="text-base">
                  Compared to traditional AI advertising platforms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
                <CardTitle className="text-xl mb-4">Renewable Energy</CardTitle>
                <CardDescription className="text-base">
                  All our infrastructure runs on clean energy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="p-8 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">Real-time</div>
                <CardTitle className="text-xl mb-4">Carbon Tracking</CardTitle>
                <CardDescription className="text-base">
                  Monitor your environmental impact with every campaign
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">❓</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg">What happens if I exceed my campaign limit?</CardTitle>
                <CardDescription className="text-base mt-2">
                  We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional campaigns as needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg">Is there a free trial for paid plans?</CardTitle>
                <CardDescription className="text-base mt-2">
                  Yes! All paid plans come with a 14-day free trial. No credit card required to start.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="p-6">
                <CardTitle className="text-lg">How do you measure sustainability impact?</CardTitle>
                <CardDescription className="text-base mt-2">
                  We use rigorous measurement frameworks including carbon intensity modeling, energy efficiency ratios, and third-party verification to track our environmental impact.
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
            Ready to start your sustainable advertising journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already making a positive impact with their advertising.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/company">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/about">
              <Button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
