import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './app/layout';
import { LandingPage } from './app/page';
import { LoginPage } from './app/auth/login/page';
import { RegisterPage } from './app/auth/register/page';
import { DashboardPage } from './app/dashboard/page';
import { CreateCampaignPage } from './app/campaigns/create/page';
import { CompanyRegistrationPage } from './app/register/company/page';
import { IndividualRegistrationPage } from './app/register/individual/page';
import { CreateCampaignPage as NewCreateCampaignPage } from './app/campaign/create/page';
import { CampaignResultsPage } from './app/campaign/results/page';
import { CampaignDetailPage } from './app/campaign/[id]/page';
import { CampaignSuccessPage } from './app/campaign/success/page';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
        </Route>
        {/* Dashboard and campaign routes without landing layout (has own header) */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="campaigns/create" element={<CreateCampaignPage />} />
        <Route path="campaign/create" element={<NewCreateCampaignPage />} />
        <Route path="campaign/results" element={<CampaignResultsPage />} />
        <Route path="campaign/success" element={<CampaignSuccessPage />} />
        <Route path="campaign/:id" element={<CampaignDetailPage />} />
        {/* Auth routes without layout */}
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        {/* New registration routes without layout */}
        <Route path="register/company" element={<CompanyRegistrationPage />} />
        <Route path="register/individual" element={<IndividualRegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
