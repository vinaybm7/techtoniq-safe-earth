# Techtoniq Safe Earth - Comprehensive Project Guide

## Table of Contents
1. Project Overview
2. Project Structure
3. Core Features
4. Technical Stack
5. Setup & Installation
6. Deployment
7. API Integrations
8. Common Issues & Solutions
9. Presentation Q&A
10. Future Improvements

## 1. Project Overview

### What is Techtoniq Safe Earth?
Techtoniq Safe Earth is a comprehensive earthquake monitoring and alert system focused on India. The application provides real-time earthquake data, safety guidelines, and educational resources to help users stay informed and prepared for seismic activities.

### Key Objectives:
- Provide real-time earthquake monitoring with a focus on India
- Deliver timely alerts and safety information
- Offer educational resources about earthquakes
- Present historical earthquake data and statistics
- Create a community of earthquake-aware citizens

## 2. Project Structure

```
src/
├── components/      # Reusable UI components
├── config/         # Configuration files
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
├── pages/          # Application pages
│   ├── ContactUs/           # Contact information page
│   ├── EarthquakeByRegion/  # Regional earthquake data
│   ├── EarthquakeStatistics/ # Statistical analysis
│   ├── EducationalMaterials/ # Learning resources
│   ├── EmergencyResources/   # Emergency contacts and info
│   ├── LatestNews/          # News about earthquakes
│   ├── MyLocation/          # Location-based alerts
│   ├── RealTimeData/        # Live earthquake data
│   ├── SafetyGuidelines/    # Safety procedures
│   └── subscribe/           # Email subscription
├── services/       # API and data services
│   ├── api.ts              # API client
│   ├── earthquakeService.ts # Earthquake data
│   └── newsService.ts      # News aggregation
└── utils/          # Helper functions

server/
├── api/           # API endpoints
└── index.js       # Server entry point
```

## 3. Core Features

### 3.1 Real-time Earthquake Monitoring
- Fetches live data from multiple sources including USGS and NCS (National Center for Seismology, India)
- Displays earthquakes on an interactive map
- Provides detailed information about each seismic event

### 3.2 Location-based Alerts
- Uses geolocation to provide personalized alerts
- Shows nearby seismic activity
- Provides region-specific safety guidelines

### 3.3 Educational Resources
- Comprehensive guides on earthquake preparedness
- Safety procedures during and after earthquakes
- Interactive learning materials

### 3.4 News Aggregation
- Collects earthquake-related news from multiple sources
- Filters and prioritizes relevant content
- Provides both global and India-specific news

## 4. Technical Stack

### Frontend (React)

#### Project Setup and Commands

**1. Project Initialization**
This project was created using Vite with the React template:
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

**2. Key Dependencies**
- `react` & `react-dom`: Core React libraries
- `react-router-dom`: For client-side routing
- `@tanstack/react-query`: For data fetching and state management
- `framer-motion`: For animations
- `lucide-react`: For icons
- Various UI components from `shadcn/ui`

**3. Running the Development Server**
```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```
The development server typically runs on `http://localhost:5173`

**4. Building for Production**
```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

**5. How React is Used in This Project**

**Component-Based Architecture**
- **Pages**: Main route components (e.g., `Index.tsx`, `NotesPage.tsx`)
- **Components**: Reusable UI elements (e.g., `Header.tsx`, `Hero.tsx`)
- **UI**: Shared components like buttons, cards, and form elements

**State Management**
- Local state with `useState` and `useReducer`
- Global state management with React Context
- Server state management with React Query

**Key Features**
- Responsive design with Tailwind CSS
- Client-side routing with React Router
- Form handling with React Hook Form
- Animation and transitions with Framer Motion
- TypeScript for type safety

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN/UI** - Reusable UI components
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **Mapbox GL** - Interactive maps
- **Framer Motion** - Animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Supabase** - Backend-as-a-Service (Authentication, Database)
- **Axios** - HTTP client

### Deployment
- **Vercel** - Frontend hosting
- **Netlify** - Alternative hosting
- **Serverless Functions** - API endpoints

## 5. Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinaybm7/techtoniq-safe-earth.git
   cd techtoniq-safe-earth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:3001
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   VITE_NEWS_API_KEY=your_newsapi_key
   VITE_GNEWS_API_KEY=your_gnews_key
   VITE_CURRENTS_API_KEY=your_currents_key
   VITE_GOOGLE_ANALYTICS_ID=your_ga_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the backend server** (in a new terminal)
   ```bash
   cd server
   npm install
   node index.js
   ```

## 6. Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository
2. Import the repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Push your code to a GitHub repository
2. Import the repository on Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy site

## 7. API Integrations

### 7.1 USGS Earthquake API
- **Endpoint**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- **Purpose**: Fetches global earthquake data
- **Rate Limit**: 20,000 requests per hour

### 7.2 National Center for Seismology (India)
- **Endpoint**: `https://seismo.gov.in/earthquake`
- **Purpose**: Fetches India-specific earthquake data

### 7.3 News APIs
- **NewsAPI.org**: General news
- **GNews**: Google News API
- **CurrentsAPI**: Alternative news source
- **The Guardian**: Reputable news source

## 8. Common Issues & Solutions

### 8.1 CORS Errors
**Issue**: API requests blocked by CORS policy
**Solution**:
- Use a CORS proxy in development
- Ensure backend has proper CORS headers
- Configure allowed origins in production

### 8.2 Environment Variables Not Loading
**Issue**: Process.env variables are undefined
**Solution**:
- Ensure variables are prefixed with `VITE_`
- Restart the development server after adding new variables
- Check for typos in variable names

### 8.3 Map Not Displaying
**Issue**: Blank map or "Invalid access token" error
**Solution**:
- Verify Mapbox access token is set
- Check network requests in browser dev tools
- Ensure proper initialization of map component

## 9. Presentation Q&A

### Q: What is the flow of your project?
**A**: The application follows this flow:
1. User opens the app and sees the dashboard
2. Real-time data is fetched from USGS and NCS APIs
3. Earthquakes are displayed on an interactive map
4. Users can click on earthquakes for details
5. Users can view news, statistics, and educational content
6. Users can subscribe for email alerts

### Q: What technologies have you used and why?
**A**:
- **React & TypeScript**: For building a robust, type-safe frontend
- **Vite**: For fast development and optimized production builds
- **Tailwind CSS**: For rapid UI development with utility classes
- **Supabase**: For authentication and database needs
- **Mapbox GL**: For interactive, high-performance maps
- **React Query**: For efficient data fetching and caching

### Q: Can you explain how the earthquake detection works?
**A**: The system uses multiple data sources:
1. Fetches raw data from USGS and NCS APIs
2. Processes and filters the data
3. Identifies Indian earthquakes using location data and keywords
4. Renders the data on an interactive map
5. Sends alerts for significant events

### Q: What is your contribution to this project?
**A**: [Customize based on actual contributions]
- Implemented real-time data fetching and processing
- Developed the interactive map interface
- Created the notification system
- Optimized performance for low-bandwidth users
- Added accessibility features

## 10. Future Improvements

### 10.1 Short-term
- [ ] Add push notifications for significant earthquakes
- [ ] Implement offline support with service workers
- [ ] Add more regional languages for better accessibility

### 10.2 Medium-term
- [ ] Machine learning for earthquake prediction
- [ ] Crowdsourced damage reports
- [ ] Integration with emergency services

### 10.3 Long-term
- [ ] Mobile app development
- [ ] IoT sensor network integration
- [ ] Advanced simulation tools for disaster preparedness

## 11. AI-Powered Earthquake Prediction System

### 11.1 System Overview
The AI prediction system analyzes historical and real-time seismic data to identify patterns that might indicate potential earthquake activity. The system follows this workflow:

1. **Data Collection**: Fetches real-time and historical earthquake data from USGS
2. **Data Preprocessing**: Cleans and structures the data for analysis
3. **Feature Engineering**: Extracts meaningful patterns and indicators
4. **AI Analysis**: Processes data through Google's Gemini model
5. **Prediction Generation**: Produces probability scores for potential seismic events
6. **Alert Generation**: Triggers alerts for high-probability events

### 11.2 Data Flow Architecture

```
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│                 │     │                       │     │                     │
│   USGS API      ├─────▶  Data Preprocessing   ├─────▶  Feature Extraction  │
│  (JSON Format)  │     │                       │     │                     │
└─────────────────┘     └───────────┬───────────┘     └──────────┬──────────┘
                                    │                             │
                                    ▼                             ▼
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│                 │     │                       │     │                     │
│  Historical     │     │   Gemini AI Model    ◀─────┤  Processed Data     │
│  Database       │     │   (API Integration)  │     │                     │
└─────────────────┘     └───────────┬───────────┘     └──────────┬──────────┘
                                    │                             │
                                    ▼                             ▼
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│                 │     │                       │     │                     │
│  Alert System   ◀─────┤  Prediction Results   ◀─────┤  Model Evaluation   │
│  (Notifications)│     │                       │     │                     │
└─────────────────┘     └───────────────────────┘     └─────────────────────┘
```

### 11.3 Implementation Details

#### 11.3.1 Data Collection from USGS
```typescript
interface USGSFeature {
  properties: {
    mag: number;       // Magnitude
    place: string;     // Location
    time: number;      // Timestamp
    // ... other properties
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

async function fetchUSGSData() {
  const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-01-01&minmagnitude=2.5');
  const data = await response.json();
  return data.features as USGSFeature[];
}
```

#### 11.3.2 Data Preprocessing
```typescript
interface ProcessedEarthquakeData {
  timestamp: Date;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
  location: string;
  // Additional derived features
  clusterId?: number;
  seismicGap?: number;
  bValue?: number;
}

function preprocessData(features: USGSFeature[]): ProcessedEarthquakeData[] {
  return features.map(feature => ({
    timestamp: new Date(feature.properties.time),
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
    depth: feature.geometry.coordinates[2],
    magnitude: feature.properties.mag,
    location: feature.properties.place,
    // Additional preprocessing logic here
  }));
}
```

#### 11.3.3 Google Gemini API Integration
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function analyzeSeismicData(data: ProcessedEarthquakeData[]) {
  // Convert data to a structured prompt
  const prompt = `Analyze the following seismic data and predict potential earthquake patterns:
  
  ${JSON.stringify(data.slice(0, 100), null, 2)}
  
  Consider the following factors:
  1. Temporal patterns in seismic activity
  2. Spatial clustering of events
  3. Magnitude-frequency relationships
  4. Depth distribution
  5. Historical patterns in the region
  
  Provide a risk assessment and potential prediction for the next 7 days.`;

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      analysis: response.text(),
      timestamp: new Date().toISOString(),
      confidenceScore: 0.85, // Example confidence score
      riskAreas: extractRiskAreas(response.text())
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
```

### 11.4 Risk Assessment & Alert System

```typescript
interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  predictedMagnitude?: number;
  predictedLocation?: string;
  timeWindow?: string;
  recommendedActions: string[];
}

function generateRiskAssessment(analysis: string): RiskAssessment {
  // Parse the AI response and generate structured risk assessment
  // This is a simplified example - actual implementation would be more sophisticated
  
  const riskLevel = analysis.toLowerCase().includes('high risk') ? 'high' :
                   analysis.toLowerCase().includes('medium risk') ? 'medium' : 'low';
  
  return {
    riskLevel,
    confidence: parseFloat(analysis.match(/confidence: (\d+\.\d+)/)?.[1] || '0.7'),
    predictedMagnitude: parseFloat(analysis.match(/magnitude of (\d+\.\d+)/)?.[1] || '0'),
    predictedLocation: analysis.match(/near (.*?)\./)?.[1] || 'Unspecified region',
    timeWindow: analysis.match(/within the next (.*?)\./)?.[1] || 'next 7 days',
    recommendedActions: generateRecommendedActions(riskLevel)
  };
}

function generateRecommendedActions(riskLevel: string): string[] {
  const actions = [
    'Review emergency supplies',
    'Identify safe spots in buildings',
    'Update emergency contact information'
  ];
  
  if (riskLevel === 'high') {
    actions.push('Consider evacuation if in high-risk zone');
    actions.push('Monitor official channels for updates');
  }
  
  return actions;
}
```

### 11.5 System Integration

```typescript
// Main prediction pipeline
async function runPredictionPipeline() {
  try {
    // 1. Fetch latest data
    const rawData = await fetchUSGSData();
    
    // 2. Preprocess data
    const processedData = preprocessData(rawData);
    
    // 3. Get AI analysis
    const analysis = await analyzeSeismicData(processedData);
    
    // 4. Generate risk assessment
    const assessment = generateRiskAssessment(analysis.analysis);
    
    // 5. Trigger alerts if needed
    if (assessment.riskLevel === 'high') {
      await triggerHighRiskAlerts(assessment);
    }
    
    // 6. Store results
    await storePredictionResults({
      timestamp: new Date(),
      analysis,
      assessment,
      rawData: processedData
    });
    
    return assessment;
  } catch (error) {
    console.error('Prediction pipeline failed:', error);
    // Implement fallback or retry logic
    throw error;
  }
}
```

### 11.6 Implementation Notes

1. **Rate Limiting**: Implement proper rate limiting for API calls to Google Gemini
2. **Error Handling**: Robust error handling for API failures
3. **Caching**: Cache API responses to reduce costs and improve performance
4. **Fallback Mechanism**: Implement fallback to simpler statistical models if AI service is unavailable
5. **Data Privacy**: Ensure all data handling complies with privacy regulations

### 11.7 Future Enhancements

1. **Real-time Processing**: Implement streaming data processing for real-time analysis
2. **Ensemble Models**: Combine multiple AI models for improved accuracy
3. **Edge Computing**: Process data closer to the source for faster response times
4. **User Feedback**: Incorporate user-reported data to improve predictions
5. **Advanced Visualization**: Create interactive dashboards for data exploration

---
*Last Updated: August 1, 2024*
*Project Maintainers: [Your Name], [Team Members]*
*License: [Specify License]*
