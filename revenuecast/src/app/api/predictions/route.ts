import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Mock database for saved predictions
let savedPredictions: any[] = [
  {
    id: "1",
    userId: "1",
    companyName: "Tech Startup",
    input_data: {
      marketing_spend: 150000,
      rd_spend: 120000,
      admin_costs: 50000,
      num_employees: 250,
      region: "North America"
    },
    predicted_revenue: 156789,
    model_performance: {
      r2_score: 0.9234,
      mae: 8542.33
    },
    createdAt: "2024-01-15T10:30:00Z",
    notes: "Q1 2024 forecast for expansion planning"
  },
  {
    id: "2",
    userId: "1",
    companyName: "Manufacturing Co",
    input_data: {
      marketing_spend: 200000,
      rd_spend: 80000,
      admin_costs: 75000,
      num_employees: 500,
      region: "Europe"
    },
    predicted_revenue: 234567,
    model_performance: {
      r2_score: 0.9234,
      mae: 8542.33
    },
    createdAt: "2024-01-14T14:20:00Z",
    notes: "Annual revenue projection"
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Filter predictions for the current user
    const userPredictions = savedPredictions.filter(
      prediction => prediction.userId === session.user.id
    );

    // Sort by creation date (newest first)
    userPredictions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      predictions: userPredictions,
      total: userPredictions.length,
      status: 'success'
    });

  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['companyName', 'input_data', 'predicted_revenue', 'model_performance'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new prediction record
    const newPrediction = {
      id: (savedPredictions.length + 1).toString(),
      userId: session.user.id,
      companyName: body.companyName,
      input_data: body.input_data,
      predicted_revenue: body.predicted_revenue,
      model_performance: body.model_performance,
      createdAt: new Date().toISOString(),
      notes: body.notes || ''
    };

    // Save to mock database
    savedPredictions.push(newPrediction);

    return NextResponse.json({
      prediction: newPrediction,
      message: 'Prediction saved successfully',
      status: 'success'
    });

  } catch (error) {
    console.error('Error saving prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    // Find prediction
    const predictionIndex = savedPredictions.findIndex(
      p => p.id === predictionId && p.userId === session.user.id
    );

    if (predictionIndex === -1) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    // Remove prediction
    savedPredictions.splice(predictionIndex, 1);

    return NextResponse.json({
      message: 'Prediction deleted successfully',
      status: 'success'
    });

  } catch (error) {
    console.error('Error deleting prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
