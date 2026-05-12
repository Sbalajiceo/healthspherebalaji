# HealthSphere

India's first Gen-Z and millennial-focused healthcare superapp. A highly polished, single-page application built with React, Vite, and Tailwind CSS.

## Deploying to Vercel

This project is fully configured for deployment on [Vercel](https://vercel.com). Simply follow these steps to deploy:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Vercel will automatically detect the **Vite** framework and apply the right build settings (`npm run build`).
4. **Important**: You must add your Gemini API Key in the Vercel deployment settings:
   - Go to **Settings > Environment Variables** in your Vercel project.
   - Add a new variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: `your_actual_gemini_api_key_here`
5. Click **Deploy**.

## Features
- **Health Timeline**: Local storage based health timeline tracking.
- **AI Prescription Scanning**: Uses Gemini 2.5 Flash Vision API to instantly parse prescription images.
- **E-Pharmacy**: A tailored shopping cart experience.
- **Authentication**: Fully functional UI with local storage persistence.

*Note: Since the app utilizes the Gemini API directly from the frontend, it relies on Vite's inline environment replacement during the build.*
