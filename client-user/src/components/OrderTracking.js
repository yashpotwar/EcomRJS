// src/components/OrderTracking.jsx

import React from 'react';
import { CheckCircle, Truck, PackageCheck } from 'lucide-react';

const OrderTracking = ({ status }) => {
  const steps = ['Packed', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(status);

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow mt-4">
      {steps.map((step, index) => {
        const isCompleted = index <= currentStep;

        return (
          <div key={step} className="flex-1 text-center relative">
            <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full
              ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}
            `}>
              {step === 'Packed' && <PackageCheck className="w-5 h-5" />}
              {step === 'Shipped' && <Truck className="w-5 h-5" />}
              {step === 'Delivered' && <CheckCircle className="w-5 h-5" />}
            </div>
            <p className={`mt-2 text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
              {step}
            </p>

            {/* Progress line */}
            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-1 -z-10 
                ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}
                style={{ transform: 'translateX(50%)', width: '100%' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracking;
