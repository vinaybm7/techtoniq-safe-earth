# Techtoniq Documentation

Techtoniq is an advanced AI-powered earthquake prediction and safety platform, designed to provide critical information and resources to help individuals and communities prepare for and respond effectively to seismic events.

## Introduction

Techtoniq combines cutting-edge AI technology with real-time data visualization to offer predictive insights, customized alerts, and comprehensive safety protocols tailored to users' needs and locations.

## Project Structure

```
techtoniq/
├── public/              # Static assets and resources
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and shared code
│   ├── pages/           # Page components
│   ├── services/        # API service definitions
│   ├── styles/          # Application styles
|
└── ...
```

## Key Features

- **AI-Powered Earthquake Prediction:** Utilizing advanced seismic pattern analysis to forecast potential earthquake events before they occur.
- **Real-Time Alerts & Notifications:** Personalized risk assessments and direct alerts about seismic activity.
- **Comprehensive Safety Protocols:** Customized safety plans and evacuation routes based on location and threat level.
- **Interactive Data Visualization:** Rich visual representations, including maps, showing predicted and actual seismic activity.
- **Educational Resources:** Quality educational content regarding earthquakes and safety measures.

## Design Language

Techtoniq's design is driven by clarity and accessibility, with a focus on essential information delivery. The color palette is reflective of earth tones and emergency alert signals, balancing calmness with urgency.

### Theme Colors
- **Blue:** Safety and reliability (`hsl(var(--primary))`)
- **Teal:** Trust and calm (`hsl(var(--secondary))`)
- **Earth:** Groundedness and stability (`hsl(var(--background))`)
- **Alert:** Immediate attention and action (`#F97316`)

## Core Architecture

### Frontend
- **Framework:** React with Vite as the build tool.
- **Styles:** Tailwind CSS with custom themes.
- **Routing:** React Router for handling multi-page navigation.
- **State Management:** React Context API for handling subscriptions and user interactions.

### Backend
- **APIs:** Leveraging serverless API functions using Vercel for scalability.
- **Database:** Supabase (with in-memory fallback) for handling user subscriptions.
- Services: Integration with Google Gemini API for real-time prediction updates.

## Deployment Configuration

The platform is built with modern deployment strategies, supporting continuous delivery via Vercel and Netlify.

- **Vercel Configuration:**
  ```json
  {
    "buildCommand": "vite build",
    "outputDirectory": "dist",
    "framework": null
  }
  ```

- **Environment Variables:**
  - `VITE_GEMINI_API_KEY`: API key for AI predictions
  - `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`: For Supabase integration

## Usage

### Local Development
1. **Installation:**
   ```bash
   npm install
   npm run dev
   ```

2. **Environment Setup:**
   Create a `.env.local` file and add necessary environment variables including API keys and database URLs.

### Production Deployment
- Deploy to Vercel with automatic build and scale.
- Configuration of DNS settings for custom domains to be managed within Vercel’s platform.

## Subscription API

The subscription service utilizes both Supabase and an in-memory store to ensure flexibility and reliability.

Endpoint: `/api/subscribe`
- **GET:** Health check
- **POST:** Add email to subscription list

## Conclusion

Techtoniq enables communities and individuals to take proactive measures against the threats posed by earthquakes. By leveraging AI and real-time data analytics, it offers predictive, protective, and educational resources essential for modern disaster preparedness.

---

### Contact

Email: contact@techtoniq.com
GitHub: [Techtoniq Repo](https://github.com/vinaybm7/techtoniq-safe-earth)
