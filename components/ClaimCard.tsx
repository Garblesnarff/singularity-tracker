import React from 'react';
import { Claim } from '../types';
import { ExternalLink, TrendingUp, AlertCircle, Brain, Calendar, Search } from 'lucide-react';

interface ClaimCardProps {
  claim: Claim;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  const getSentimentColor = (s: string) => {
    switch (s) {
      case 'positive': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'negative': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'mixed': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getCategoryColor = (c: string) => {
    switch (c.toLowerCase()) {
      case 'ai': return 'text-purple-400';
      case 'space': return 'text-blue-400';
      case 'biotech': return 'text-green-400';
      case 'energy': return 'text-yellow-400';
      case 'robotics': return 'text-orange-400';
      default: return 'text-indigo-400';
    }
  };

  return (
    <div className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-5 transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 gap-4">
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-md border bg-slate-900/50 uppercase tracking-wider ${getCategoryColor(claim.category)} border-current`}>
            {claim.category}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-900/50 text-slate-400 border border-slate-700">
            {claim.subcategory}
          </span>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full border ${getSentimentColor(claim.sentiment)} capitalize`}>
          {claim.sentiment}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-slate-100 mb-2 leading-snug group-hover:text-indigo-200 transition-colors">
        {claim.summary}
      </h3>
      
      <div className="flex-grow">
         <p className="text-sm text-slate-400 italic mb-4 border-l-2 border-slate-600 pl-3 py-1 bg-slate-900/30 rounded-r-lg">
          "{claim.raw_text}"
        </p>

        {/* Entities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(Object.entries(claim.entities) as [string, string[]][]).map(([key, values]) => 
            values && values.length > 0 ? (
              values.map((v, i) => (
                <span key={`${key}-${i}`} className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-300 rounded">
                  {v}
                </span>
              ))
            ) : null
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Significance (1-10)">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-slate-200">{claim.significance}/10</span>
          </div>
          
          {claim.is_prediction && (
            <div className="flex items-center gap-1 text-amber-400" title="Prediction">
               <Calendar className="w-3.5 h-3.5" />
               <span>{claim.prediction_timeframe || 'Future'}</span>
            </div>
          )}
        </div>
        
        {claim.search_queries.length > 0 && (
          <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(claim.search_queries[0])}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Verify
          </a>
        )}
      </div>
      
      {/* Prediction Badge */}
      {claim.is_prediction && (
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ClaimCard;