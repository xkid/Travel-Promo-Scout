import React, { useState, useEffect } from 'react';
import { Search, RotateCw, Plane, ExternalLink, ShieldAlert } from 'lucide-react';
import { fetchPromotions } from './services/geminiService';
import { PromoDataState, PlatformName } from './types';
import { PromoCard } from './components/PromoCard';
import { ActionTimeline } from './components/ActionTimeline';
import { ComparisonChart } from './components/ComparisonChart';

// Mock data for initial state or fallback
const MOCK_DATA: PromoDataState = {
  promotions: [],
  sources: [],
  lastUpdated: null
};

const App: React.FC = () => {
  const [data, setData] = useState<PromoDataState>(MOCK_DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPromotions();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch latest promotions. Please try again or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPromotions = activeTab === 'All' 
    ? data.promotions 
    : data.promotions.filter(p => p.platform === activeTab);

  const platforms = ['All', ...Object.values(PlatformName)];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none">Travel Promo Scout</h1>
                <p className="text-xs text-gray-500 mt-0.5">Automated Deal Aggregator</p>
              </div>
            </div>
            <button 
              onClick={loadData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Scanning...' : 'Scan Now'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <ShieldAlert className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Connection Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Section */}
            {!loading && data.promotions.length > 0 && (
                <ComparisonChart promotions={data.promotions} />
            )}

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-2 scrollbar-hide">
              {platforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === platform 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>

            {/* Promotions Grid */}
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                 ))}
               </div>
            ) : filteredPromotions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPromotions.map((promo) => (
                  <PromoCard key={promo.id} promo={promo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No promotions found</h3>
                <p className="text-gray-500">Try clicking "Scan Now" to fetch the latest deals.</p>
              </div>
            )}
          </div>

          {/* Sidebar Area (1/3) */}
          <div className="space-y-8">
            
            {/* Action Timeline */}
            <div className="sticky top-24">
                <div className="mb-4 flex items-center justify-between">
                     <h2 className="text-lg font-bold text-gray-900">Action Plan</h2>
                     {data.lastUpdated && (
                         <span className="text-xs text-gray-500">
                             Updated: {data.lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                     )}
                </div>
                
                {loading ? (
                    <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                ) : (
                    <ActionTimeline promotions={data.promotions} />
                )}

                {/* Sources / Intelligence Info */}
                {!loading && data.sources.length > 0 && (
                    <div className="mt-8 bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                            <RotateCw className="w-4 h-4 mr-2" />
                            Intelligence Sources
                        </h3>
                        <ul className="space-y-2">
                            {data.sources.slice(0, 5).map((source, idx) => (
                                <li key={idx} className="flex items-start">
                                    <ExternalLink className="w-3 h-3 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                                    <a 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-700 hover:text-indigo-900 underline truncate block"
                                    >
                                        {source.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;