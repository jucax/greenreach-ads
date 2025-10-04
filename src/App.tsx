import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './app/layout';
import { LandingPage } from './app/page';
import { AboutPage } from './app/about/page';
import { PricingPage } from './app/pricing/page';
import { LoginPage } from './app/auth/login/page';
import { DashboardPage } from './app/dashboard/page';
import { CreateCampaignPage } from './app/campaigns/create/page';
import { CompanyRegistrationPage } from './app/register/company/page';
import { IndividualRegistrationPage } from './app/register/individual/page';
import { CreateCampaignPage as NewCreateCampaignPage } from './app/campaign/create/page';
import { CampaignResultsPage } from './app/campaign/results/page';
import { CampaignDetailPage } from './app/campaign/[id]/page';
import { CampaignSuccessPage } from './app/campaign/success/page';
import { DemoDashboardPage } from './app/dashboard/demo/page';
import { DemoCreateCampaignPage } from './app/demo/campaign/create/page';
import { DemoCampaignResultsPage } from './app/demo/campaign/results/page';
import { DemoCampaignSuccessPage } from './app/demo/campaign/success/page';

function App() {
  console.log('🚀 App: Component rendering...');
  
  try {
    return (
      <AuthProvider>
        <Router>
        <Routes>
          {/* Landing page with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="pricing" element={<PricingPage />} />
          </Route>
          
          {/* Auth routes without layout */}
          <Route path="auth/login" element={<LoginPage />} />
          
          {/* Registration routes without layout */}
          <Route path="register/company" element={<CompanyRegistrationPage />} />
          <Route path="register/individual" element={<IndividualRegistrationPage />} />
          
          {/* Demo routes without layout */}
          <Route path="demo" element={<DemoDashboardPage />} />
          <Route path="demo/campaign/create" element={<DemoCreateCampaignPage />} />
          <Route path="demo/campaign/results" element={<DemoCampaignResultsPage />} />
          <Route path="demo/campaign/success" element={<DemoCampaignSuccessPage />} />
          
          {/* Protected routes - require authentication */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="campaigns/create" element={
            <ProtectedRoute>
              <CreateCampaignPage />
            </ProtectedRoute>
          } />
          <Route path="campaign/create" element={
            <ProtectedRoute>
              <NewCreateCampaignPage />
            </ProtectedRoute>
          } />
          <Route path="campaign/results" element={
            <ProtectedRoute>
              <CampaignResultsPage />
            </ProtectedRoute>
          } />
          <Route path="campaign/success" element={
            <ProtectedRoute>
              <CampaignSuccessPage />
            </ProtectedRoute>
          } />
          <Route path="campaign/details/:id" element={
            <ProtectedRoute>
              <CampaignDetailPage />
            </ProtectedRoute>
          } />
          {/* Static demo campaign detail page - use /demo/campaign/:id instead */}
          <Route path="campaign/demo/:id" element={
            <ProtectedRoute>
              <CampaignDetailPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
    );
  } catch (error) {
    console.error('❌ App: Error rendering app:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>App Error</h1>
        <p>Something went wrong: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}

export default App;
