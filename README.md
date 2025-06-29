# Techtoniq - Predict, Prepare, Protect

Techtoniq is an AI-powered earthquake prediction and safety platform that helps users anticipate seismic events, prepare effectively, and protect what matters most.
By combining Google Gemini API for advanced analysis of real-time data with comprehensive safety resources, Techtoniq provides a complete earthquake safety solution.

## 🔒 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
```

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
