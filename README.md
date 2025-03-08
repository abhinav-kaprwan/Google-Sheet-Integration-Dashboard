# NextJS Dashboard with Google Sheets Integration

A dashboard application built with Next.js and Express.js that allows users to import and sync data from Google Sheets.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```

3. Environment Variables:

Create `.env` file in the Backend directory:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
```

Create `.env.local` file in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Google Sheets Setup:
- Create a service account in Google Cloud Console
- Download the service account key and save as `service-account-key.json` in the Backend directory
- Enable Google Sheets API in Google Cloud Console
- Share your Google Sheet with the service account email

## Running the Application

1. Start the backend:
```bash
cd Backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## Features
- Google Sheets Integration
- Real-time data sync
- Dynamic table management
- User authentication
- Responsive dashboard interface 