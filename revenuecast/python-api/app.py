from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model and metadata
MODEL_PATH = '../models/revenue_model.pkl'
METADATA_PATH = '../models/model_metadata.json'

try:
    model = joblib.load(MODEL_PATH)
    with open(METADATA_PATH, 'r') as f:
        model_metadata = json.load(f)
    print("✅ Model loaded successfully!")
    print(f"📊 Model Performance: R² = {model_metadata['test_r2']:.4f}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    model_metadata = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information and metadata"""
    if not model_metadata:
        return jsonify({'error': 'Model metadata not available'}), 500
    
    return jsonify({
        'model_type': model_metadata['model_type'],
        'performance': {
            'r2_score': model_metadata['test_r2'],
            'mae': model_metadata['test_mae'],
            'rmse': model_metadata['test_rmse']
        },
        'training_date': model_metadata['training_date'],
        'dataset_size': model_metadata['dataset_size'],
        'features': model_metadata['features']
    })

@app.route('/predict', methods=['POST'])
def predict_revenue():
    """Predict revenue based on input features"""
    try:
        if not model:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get input data
        data = request.json
        
        # Validate required fields
        required_fields = ['marketing_spend', 'rd_spend', 'admin_costs', 'num_employees', 'region']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate region
        valid_regions = ['North America', 'Europe', 'Asia']
        if data['region'] not in valid_regions:
            return jsonify({
                'error': f'Invalid region. Must be one of: {valid_regions}'
            }), 400
        
        # Validate numeric fields
        numeric_fields = ['marketing_spend', 'rd_spend', 'admin_costs', 'num_employees']
        for field in numeric_fields:
            try:
                data[field] = float(data[field])
                if data[field] < 0:
                    return jsonify({'error': f'{field} must be non-negative'}), 400
            except (ValueError, TypeError):
                return jsonify({'error': f'{field} must be a valid number'}), 400
        
        # Create input dataframe
        input_data = pd.DataFrame([{
            'Marketing_Spend': data['marketing_spend'],
            'R&D_Spend': data['rd_spend'],
            'Administration_Costs': data['admin_costs'],
            'Number_of_Employees': int(data['num_employees']),
            'Region': data['region']
        }])
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        
        # Return prediction with input data for confirmation
        return jsonify({
            'predicted_revenue': float(prediction),
            'input_data': {
                'marketing_spend': data['marketing_spend'],
                'rd_spend': data['rd_spend'],
                'admin_costs': data['admin_costs'],
                'num_employees': int(data['num_employees']),
                'region': data['region']
            },
            'model_performance': {
                'r2_score': model_metadata['test_r2'] if model_metadata else None,
                'mae': model_metadata['test_mae'] if model_metadata else None
            },
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """Predict revenue for multiple companies"""
    try:
        if not model:
            return jsonify({'error': 'Model not loaded'}), 500
        
        data = request.json
        companies = data.get('companies', [])
        
        if not companies:
            return jsonify({'error': 'No companies provided'}), 400
        
        predictions = []
        
        for i, company in enumerate(companies):
            try:
                # Validate each company data
                required_fields = ['marketing_spend', 'rd_spend', 'admin_costs', 'num_employees', 'region']
                for field in required_fields:
                    if field not in company:
                        return jsonify({'error': f'Company {i+1}: Missing field {field}'}), 400
                
                # Create input dataframe
                input_data = pd.DataFrame([{
                    'Marketing_Spend': float(company['marketing_spend']),
                    'R&D_Spend': float(company['rd_spend']),
                    'Administration_Costs': float(company['admin_costs']),
                    'Number_of_Employees': int(company['num_employees']),
                    'Region': company['region']
                }])
                
                # Make prediction
                prediction = model.predict(input_data)[0]
                
                predictions.append({
                    'company_index': i,
                    'predicted_revenue': float(prediction),
                    'input_data': company
                })
                
            except Exception as e:
                return jsonify({'error': f'Company {i+1}: {str(e)}'}), 400
        
        return jsonify({
            'predictions': predictions,
            'total_companies': len(companies),
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Batch prediction failed: {str(e)}',
            'status': 'error'
        }), 500

if __name__ == '__main__':
    print("🚀 Starting RevenueCast API Server...")
    print(f"📊 Model Status: {'✅ Loaded' if model else '❌ Not Loaded'}")
    app.run(debug=True, host='0.0.0.0', port=5000)
