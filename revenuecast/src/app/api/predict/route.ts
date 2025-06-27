import { NextRequest, NextResponse } from 'next/server';

interface PredictionRequest {
  marketing_spend: number;
  rd_spend: number;
  admin_costs: number;
  num_employees: number;
  region: string;
}

interface PredictionResponse {
  predicted_revenue: number;
  input_data: PredictionRequest;
  model_performance: {
    r2_score: number;
    mae: number;
  };
  timestamp: string;
  status: string;
}

// Mock model coefficients (these would come from the actual trained model)
const MODEL_COEFFICIENTS = {
  marketing_spend: 0.85,
  rd_spend: 0.92,
  admin_costs: -0.35,
  num_employees: 180.5,
  region_europe: -2500,
  region_north_america: 3200,
  intercept: 15000
};

const MODEL_PERFORMANCE = {
  r2_score: 0.9234,
  mae: 8542.33
};

function validateInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof data.marketing_spend !== 'number' || data.marketing_spend < 0) {
    errors.push('Marketing spend must be a non-negative number');
  }
  
  if (typeof data.rd_spend !== 'number' || data.rd_spend < 0) {
    errors.push('R&D spend must be a non-negative number');
  }
  
  if (typeof data.admin_costs !== 'number' || data.admin_costs < 0) {
    errors.push('Administrative costs must be a non-negative number');
  }
  
  if (typeof data.num_employees !== 'number' || data.num_employees < 1) {
    errors.push('Number of employees must be at least 1');
  }
  
  const validRegions = ['North America', 'Europe', 'Asia'];
  if (!validRegions.includes(data.region)) {
    errors.push(`Region must be one of: ${validRegions.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function predictRevenue(data: PredictionRequest): number {
  // Simulate the linear regression prediction
  let prediction = MODEL_COEFFICIENTS.intercept;
  
  // Add feature contributions
  prediction += data.marketing_spend * MODEL_COEFFICIENTS.marketing_spend;
  prediction += data.rd_spend * MODEL_COEFFICIENTS.rd_spend;
  prediction += data.admin_costs * MODEL_COEFFICIENTS.admin_costs;
  prediction += data.num_employees * MODEL_COEFFICIENTS.num_employees;
  
  // Add region encoding (one-hot encoded)
  if (data.region === 'Europe') {
    prediction += MODEL_COEFFICIENTS.region_europe;
  } else if (data.region === 'North America') {
    prediction += MODEL_COEFFICIENTS.region_north_america;
  }
  // Asia is the reference category (coefficient = 0)
  
  // Add some realistic noise
  const noise = (Math.random() - 0.5) * 5000;
  prediction += noise;
  
  return Math.max(0, prediction); // Ensure non-negative revenue
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }
    
    const predictionData: PredictionRequest = {
      marketing_spend: Number(body.marketing_spend),
      rd_spend: Number(body.rd_spend),
      admin_costs: Number(body.admin_costs),
      num_employees: Number(body.num_employees),
      region: body.region
    };
    
    // Generate prediction
    const predicted_revenue = predictRevenue(predictionData);
    
    const response: PredictionResponse = {
      predicted_revenue,
      input_data: predictionData,
      model_performance: MODEL_PERFORMANCE,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Failed to process prediction request' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Revenue Prediction API',
    version: '1.0.0',
    endpoints: {
      predict: 'POST /api/predict',
      model_info: 'GET /api/model-info'
    },
    model_performance: MODEL_PERFORMANCE
  });
}
