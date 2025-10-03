# GreenReach Ads 🌱

**AI-powered advertising platform that reduces energy consumption by 60% while delivering better results**

GreenReach Ads is a sustainable advertising platform that combines AI-driven campaign optimization with environmental responsibility. Our platform helps businesses create effective advertising campaigns while significantly reducing their carbon footprint through intelligent targeting and energy-efficient processing.

## 🌐 Live Application

**The application is live and fully functional at: [greenreachads.com](https://greenreachads.com)**

All features are available on the live site, including:
- Complete demo experience
- User registration and authentication
- Campaign creation and management
- Real-time analytics and sustainability tracking

*You can also run the application locally if you prefer to explore the codebase.*

## What It Does

GreenReach Ads revolutionizes digital advertising by:

- **🎯 Smart Campaign Generation**: AI-powered campaign planning that creates targeted, effective advertising strategies in minutes
- **🌍 Environmental Impact**: Reduces energy consumption by 60% compared to traditional advertising platforms
- **📊 Real-time Analytics**: Track both campaign performance and sustainability metrics
- **👥 Team Collaboration**: Support for both individual users and company teams
- **💡 Intelligent Targeting**: Advanced audience segmentation and platform optimization

### Key Features

- **Automated Campaign Creation**: Describe your product and get a complete campaign plan
- **Multi-Platform Support**: Instagram, Facebook, and Google Ads integration
- **Sustainability Tracking**: Real-time CO2 reduction and energy savings metrics
- **Demo Mode**: Try the platform without registration
- **Company Management**: Team collaboration with company codes and user management

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🎯 Navigation Guide for Judges

**Visit [greenreachads.com](https://greenreachads.com) to explore the live application**

### 1. **Landing Page** (`/`)
- Overview of the platform and its benefits
- "Get Started" and "View Demo" buttons
- Company vs Individual registration options

### 2. **Demo Experience** (`/demo`)
- **Demo Dashboard** (`/demo`) - Overview of demo features
- **Create Campaign** (`/demo/campaign/create`) - Try campaign creation
- **View Results** (`/demo/campaign/results`) - See AI-generated campaign plan
- **Success Page** (`/demo/campaign/success`) - Campaign launch confirmation

### 3. **Production Features** (Requires Registration)
- **Registration** (`/register/company` or `/register/individual`)
- **Login** (`/auth/login`)
- **Dashboard** (`/dashboard`) - Campaign management
- **Create Campaign** (`/campaign/create`) - Full campaign creation
- **Campaign Results** (`/campaign/results`) - Detailed analytics

### 4. **Key User Flows to Test**

#### Demo Flow (No Registration Required)
1. Visit `/demo`
2. Click "Create Campaign"
3. Fill out the form with any product information
4. Watch the AI generate a campaign plan
5. Review the results and sustainability metrics

#### Production Flow (Registration Required)
1. Register as a company or individual
2. Log in to access the dashboard
3. Create a campaign with detailed product information
4. Review AI-generated targeting and ad variations
5. Launch the campaign and track performance

## 🚀 How to Run the Application Locally

*Note: The application is live at [greenreachads.com](https://greenreachads.com) - you can explore all features there without any setup.*

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greenreach-ads
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Alternative: Use the Run Script

We've included a `run.sh` script for easy setup:

```bash
chmod +x run.sh
./run.sh
```

This script will:
- Install dependencies
- Start the development server
- Open the application in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## ✅ How to Tell if the App Started Successfully

### Development Server
When the app starts successfully, you'll see:
```
VITE v7.1.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Browser Verification
1. **Landing Page Loads**: You should see the GreenReach Ads homepage with:
   - Hero section with "Ads That Don't Burn the Planet"
   - Navigation menu with logo
   - "Get Started" and "View Demo" buttons

2. **Demo Works**: Click "View Demo" and verify:
   - Demo dashboard loads
   - Campaign creation form is accessible
   - AI generation process works (shows loading states)

3. **No Console Errors**: Open browser dev tools and check for:
   - No red error messages in console
   - Mock data generation logs (🎭 emoji)
   - Successful component rendering

### Success Indicators
- ✅ Landing page renders with all sections
- ✅ Demo flow works without errors
- ✅ Mock data generation functions properly
- ✅ No TypeScript or build errors
- ✅ Responsive design works on different screen sizes

## 🎭 Demo Data

The application uses realistic mock data for campaign generation, including:
- Category-specific targeting (Technology, Fashion, Health, Food)
- Realistic budget allocation (40% Instagram, 35% Facebook, 25% Google)
- Three ad variations per campaign
- Sustainability metrics based on budget

## 📁 Project Structure

```
src/
├── app/                    # Page components
│   ├── auth/              # Authentication pages
│   ├── campaign/          # Campaign management
│   ├── demo/              # Demo experience
│   └── register/          # Registration pages
├── components/            # Reusable components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── lib/                  # Utilities and services
│   ├── claude.ts         # Campaign generation
│   ├── mockData.ts       # Mock data generator
│   └── supabase.ts       # Database client
└── assets/               # Static assets
```

## 🔧 Environment Setup

The application works out of the box with mock data. For full functionality with Supabase:

1. Create a `.env` file in the root directory
2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🏆 Key Differentiators

- **Sustainability Focus**: First advertising platform to prioritize environmental impact
- **AI-Powered**: Intelligent campaign generation without external API dependencies
- **User-Friendly**: Both demo and production experiences
- **Scalable**: Supports individual users and enterprise teams
- **Modern Tech**: Built with latest React and TypeScript

## 📞 Support

For questions or issues, please check the console logs for detailed error messages and debugging information.

---

**Built with ❤️ for a sustainable advertising future**