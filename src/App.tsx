import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './app/layout';
import { LandingPage } from './app/page';
import { LoginPage } from './app/auth/login/page';
import { RegisterPage } from './app/auth/register/page';
import { DashboardPage } from './app/dashboard/page';
import { CreateCampaignPage } from './app/campaigns/create/page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="campaigns/create" element={<CreateCampaignPage />} />
        </Route>
        {/* Auth routes without layout */}
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
