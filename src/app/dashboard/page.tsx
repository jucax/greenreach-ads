import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's an overview of your campaigns.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Active Campaigns</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Impressions</CardDescription>
              <CardTitle className="text-3xl">1.2M</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Energy Saved</CardDescription>
              <CardTitle className="text-3xl text-emerald-600">320 kWh</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>CO₂ Reduced</CardDescription>
              <CardTitle className="text-3xl text-emerald-600">150 kg</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link to="/campaigns/create">
              <Button variant="default" size="lg">
                Create New Campaign
              </Button>
            </Link>
            <Link to="/campaigns">
              <Button variant="outline" size="lg">
                View All Campaigns
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Campaigns</h2>
          <Card>
            <CardHeader>
              <CardDescription className="text-center py-8">
                Campaign data will be displayed here. This is a placeholder for the dashboard functionality.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

