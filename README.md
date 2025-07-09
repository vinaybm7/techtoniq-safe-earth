# Techtoniq - Predict, Prepare, Protect

Techtoniq is an AI-powered earthquake prediction and safety platform that helps users anticipate seismic events, prepare effectively, and protect what matters most. This repository contains the Next.js application with serverless API routes for handling subscriptions and other backend functionality.

## 🚀 Features

- **Robust MongoDB Connection**: Optimized for serverless environments with connection pooling and retry logic
- **Serverless API**: Built with Next.js API routes for seamless deployment on Vercel
- **Type Safety**: Full TypeScript support with proper type definitions
- **Production-Ready**: Environment-specific configurations and error handling
- **Health Check**: Built-in health check endpoint for monitoring

## 🔒 Environment Variables

### Local Development
Create a `.env.local` file in the root directory with the following variables:

```env
# Required
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
NODE_ENV=development

# Optional
MONGODB_DB_NAME=techtoniq
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Vercel Deployment
Add these environment variables in your Vercel project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `MONGODB_DB_NAME`: (Optional) Your database name (defaults to 'techtoniq')
   - `JWT_SECRET`: (Optional) For authentication (generate a strong secret)

## 🛠️ MongoDB Atlas Setup

1. **Create a Cluster**:
   - Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new project and cluster
   - Choose your preferred cloud provider and region

2. **Database Access**:
   - Go to Database Access
   - Create a new database user with read/write access
   - Note down the username and password

3. **Network Access**:
   - Go to Network Access
   - Add IP address `0.0.0.0/0` to allow connections from anywhere
   - For production, restrict to Vercel's IP ranges:
     ```
     76.76.14.0/24
     100.24.0.0/16
     172.64.0.0/13
     2600:1f1c:2b9:6900::/56
     ```

4. **Get Connection String**:
   - Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` with your actual credentials

## 🌟 Features

- **AI-Powered Earthquake Prediction**: Advanced seismic pattern analysis using Google Gemini API to forecast potential events
- **Personalized Risk Assessment**: Get customized risk evaluations based on your location and real-time data
- **Intelligent Alert System**: Receive prioritized notifications with AI-analyzed threat levels and recommended actions
- **Comprehensive Safety Protocols**: Access location-specific safety plans and evacuation routes
- **Real-time Data Visualization**: Interactive maps and dashboards showing predicted and actual seismic activity

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account for database hosting

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/techtoniq.git
   cd techtoniq
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the `MONGODB_URI` with your MongoDB Atlas connection string
   - Make sure to include your database credentials in the connection string

4. Install MongoDB dependencies:
   ```sh
   npm install mongodb @types/mongodb
   ```

5. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## 🛠️ Tech Stack

This project is built with modern technologies to ensure a responsive, accessible, and performant user experience:

- **Frontend Framework**: React 18
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui
- **Type Safety**: TypeScript
- **Routing**: React Router
- **Data Visualization**: Recharts
- **3D Visualizations**: Three.js with React Three Fiber
- **Maps**: Mapbox GL
- **AI Integration**: Google Gemini API for earthquake prediction and analysis
- **Real-time Alerts**: USGS ShakeAlert system with custom enhancements

## 📂 Project Structure

```
techtoniq/
├── public/              # Static assets and resources
│   ├── safety-guide.pdf # Downloadable safety resources
│   └── ...
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and shared code
│   ├── pages/           # Page components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
└── ...
```

## 🌐 Deployment

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Configure the following settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set up environment variables:
   - Add `VITE_GEMINI_API_KEY` with your Google Gemini API key
4. Deploy the application

### Deploying to Netlify

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Set up environment variables:
   - Go to Site settings > Build & deploy > Environment
   - Add `VITE_GEMINI_API_KEY` with your Google Gemini API key
4. Deploy the application

### Environment Variables

The application requires the following environment variables:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for AI predictions

You can copy the `.env.example` file to `.env` and fill in your API keys for local development.

## Production Environment Variables

Set these in your Vercel/Netlify (or other) deployment dashboard:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (required for AI predictions)
- `VITE_API_BASE_URL`: Set to `/api` (default for Vercel/Netlify serverless API routes)

If you see errors like 'Failed to load prediction. Using sample data.' in production:
- Make sure the above environment variables are set.
- Ensure your API route (`src/pages/api/fault-lines.ts`) is deployed and accessible at `/api/fault-lines`.
- Do not use static export unless you deploy your API separately.

## MongoDB Environment Variables (Required for Subscriptions)

Set these in your Vercel/Netlify (or other) deployment dashboard:

- `MONGODB_URI`: Your MongoDB Atlas connection string (required for subscriptions)
- `MONGODB_DB_NAME`: (Optional) Your database name (defaults to 'techtoniq')
- `NODE_ENV`: `production`

If you see errors like 'Subscription failed' in production:
- Make sure the above environment variables are set.
- Ensure your MongoDB Atlas cluster allows connections from your deployment (IP whitelist).
- Only one subscribe API handler should exist: `src/pages/api/subscribe.ts`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or create an Issue to improve this project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- USGS for earthquake data
- Emergency preparedness organizations for safety guidelines
- Lovable for development platform services

---

## 📱 Contact
