import React from 'react';
import { Promotion, ActionType } from '../types';
import { AlertCircle, Clock, Calendar } from 'lucide-react';

interface ActionTimelineProps {
  promotions: Promotion[];
}

export const ActionTimeline: React.FC<ActionTimelineProps> = ({ promotions }) => {
  // Filter promotions that have specific time/date actions
  const actionablePromos = promotions.filter(p => 
    p.actions.some(a => a.type === ActionType.LOGIN_TIME || a.type === ActionType.SPECIFIC_DATE)
  );

  if (actionablePromos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500">
        <div className="flex justify-center mb-2">
            <Clock className="w-8 h-8 text-gray-300" />
        </div>
        <p>No time-sensitive actions detected right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-orange-50 flex items-center justify-between">
        <h3 className="font-bold text-orange-800 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Critical Actions
        </h3>
        <span className="text-xs font-medium bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
            {actionablePromos.length} Upcoming
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {actionablePromos.map((promo) => (
          <div key={promo.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{promo.platform}</span>
                <span className="text-xs font-bold text-blue-600">{promo.discount}</span>
            </div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">{promo.title}</h4>
            <div className="space-y-2">
                {promo.actions.map((action, idx) => {
                    if (action.type !== ActionType.LOGIN_TIME && action.type !== ActionType.SPECIFIC_DATE) return null;
                    return (
                        <div key={idx} className="flex items-center text-sm text-gray-700 bg-white border border-gray-200 p-2 rounded-md">
                             {action.type === ActionType.LOGIN_TIME ? 
                                <Clock className="w-4 h-4 mr-2 text-red-500" /> : 
                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                             }
                             <span className="flex-1">{action.description}</span>
                        </div>
                    );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};