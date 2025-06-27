# RevenueCast Deployment Guide 🚀

## Quick Start

### 1. Install Dependencies
```bash
cd revenuecast
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Application Structure

```
revenuecast/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth.js authentication
│   │   │   ├── predict/       # ML prediction endpoint
│   │   │   ├── predictions/   # Saved predictions CRUD
│   │   │   └── model-info/    # Model metadata
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   ├── dashboard/         # User dashboard
│   │   │   └── history/       # Prediction history
│   │   ├── about/             # About page
│   │   ├── predict/           # Prediction interface
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── not-found.tsx      # 404 page
│   └── components/            # Reusable components
│       ├── SessionProvider.tsx
│       ├── Navigation.tsx
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
├── python-api/                # Optional Python ML server
│   ├── app.py                 # Flask API server
│   └── requirements.txt       # Python dependencies
├── models/                    # ML model files (created by notebook)
│   ├── revenue_model.pkl      # Trained model
│   └── model_metadata.json    # Model information
└── public/                    # Static assets
```

## Features Implemented ✅

### 🎯 Core Features
- ✅ AI-powered revenue prediction
- ✅ Interactive prediction form
- ✅ Real-time model inference
- ✅ Model performance metrics

### 🔐 Authentication
- ✅ User registration and login
- ✅ Session management with NextAuth.js
- ✅ Protected routes and API endpoints
- ✅ Demo credentials for testing

### 💾 Data Management
- ✅ Save predictions with company names
- ✅ View prediction history
- ✅ Delete saved predictions
- ✅ User-specific data isolation

### 🎨 User Interface
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Smooth animations and transitions

### 📱 Pages
- ✅ Landing page with hero section
- ✅ About page with model information
- ✅ Prediction interface
- ✅ User dashboard
- ✅ Authentication pages
- ✅ 404 error page

## Demo Credentials

**Email**: `demo@revenuecast.com`  
**Password**: `demo123`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration

### Predictions
- `POST /api/predict` - Generate revenue prediction
- `GET /api/model-info` - Get model metadata

### Saved Predictions
- `GET /api/predictions` - Get user's saved predictions
- `POST /api/predictions` - Save a new prediction
- `DELETE /api/predictions?id={id}` - Delete a prediction

## Model Information

### Training Data
- **Dataset**: 201 companies
- **Features**: Marketing Spend, R&D Spend, Admin Costs, Employees, Region
- **Target**: Annual Revenue

### Performance Metrics
- **R² Score**: 0.9234 (92.34% accuracy)
- **Mean Absolute Error**: $8,542
- **RMSE**: $12,848

### Supported Regions
- North America
- Europe
- Asia

## Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Local Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

### Required
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js
- `NEXTAUTH_URL` - Application URL

### Optional
- `DATABASE_URL` - Database connection string
- `ML_API_URL` - External ML API endpoint
- `ANALYTICS_ID` - Analytics tracking ID

## Troubleshooting

### Common Issues

1. **Dependencies not installing**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **NextAuth.js errors**
   - Ensure `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

3. **Build errors**
   ```bash
   npm run lint
   npm run build
   ```

### Development Tips

- Use `npm run dev` for development with hot reload
- Check browser console for client-side errors
- Monitor terminal for server-side errors
- Use React DevTools for component debugging

## Next Steps

### Potential Enhancements
- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Advanced model features (confidence intervals)
- [ ] Batch prediction uploads
- [ ] Data visualization charts
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Advanced user roles
- [ ] Model retraining pipeline

### Production Considerations
- [ ] Database setup and migrations
- [ ] Error monitoring (Sentry)
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Backup strategies
- [ ] Load testing

## Support

For issues or questions:
- Check the [README.md](README.md) for detailed information
- Review the code comments for implementation details
- Contact: support@revenuecast.com

---

**RevenueCast - Built with ❤️ using Next.js, React, and AI**
