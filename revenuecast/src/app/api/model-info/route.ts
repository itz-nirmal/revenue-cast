import { NextResponse } from 'next/server';

const MODEL_INFO = {
  model_type: 'Linear Regression',
  version: '1.0.0',
  training_date: '2024-01-15T10:30:00Z',
  dataset_size: 201,
  features: [
    'Marketing_Spend',
    'R&D_Spend', 
    'Administration_Costs',
    'Number_of_Employees',
    'Region_Europe',
    'Region_North America'
  ],
  performance: {
    r2_score: 0.9234,
    mae: 8542.33,
    rmse: 12847.56,
    training_r2: 0.9456,
    test_r2: 0.9234
  },
  regions_supported: ['North America', 'Europe', 'Asia'],
  input_ranges: {
    marketing_spend: { min: 0, max: 500000, typical: [50000, 200000] },
    rd_spend: { min: 0, max: 300000, typical: [30000, 150000] },
    admin_costs: { min: 0, max: 200000, typical: [20000, 80000] },
    num_employees: { min: 1, max: 1000, typical: [50, 500] }
  },
  model_description: 'Advanced linear regression model trained on comprehensive business data to predict company revenue based on key financial and operational metrics.',
  last_updated: '2024-01-15T10:30:00Z'
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MODEL_INFO,
    timestamp: new Date().toISOString()
  });
}
