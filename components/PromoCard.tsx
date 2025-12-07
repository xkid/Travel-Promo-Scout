import React from 'react';
import { Promotion, ActionType } from '../types';
import { Clock, Calendar, Smartphone, Tag, ArrowRight } from 'lucide-react';

interface PromoCardProps {
  promo: Promotion;
}

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Traveloka': return 'bg-blue-500 text-white';
    case 'Trip.com': return 'bg-blue-600 text-white';
    case 'Agoda': return 'bg-purple-600 text-white';
    case 'Booking.com': return 'bg-blue-900 text-white';
    case 'AirAsia': return 'bg-red-600 text-white';
    default: return 'bg-gray-600 text-white';
  }
};

export const PromoCard: React.FC<PromoCardProps> = ({ promo }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center ${getPlatformColor(promo.platform)}`}>
        <span>{promo.platform}</span>
        <span className="bg-white/20 px-2 py-0.5 rounded text-white">{promo.discount}</span>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">{promo.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{promo.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {promo.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                    {tag}
                </span>
            ))}
        </div>

        <div className="space-y-3 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>{promo.period}</span>
          </div>

          {promo.actions.map((action, idx) => (
            <div key={idx} className="flex items-start text-sm bg-orange-50 p-2 rounded-lg text-orange-800">
              {action.type === ActionType.LOGIN_TIME && <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />}
              {action.type === ActionType.SPECIFIC_DATE && <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />}
              {action.type === ActionType.APP_ONLY && <Smartphone className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />}
              {action.type === ActionType.COUPON_CODE && <Tag className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />}
              {action.type === ActionType.NONE && <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />}
              <span className="font-medium">{action.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};