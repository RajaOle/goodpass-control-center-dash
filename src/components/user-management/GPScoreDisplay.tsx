
import React from 'react';

interface GPScoreDisplayProps {
  score: number;
}

export const GPScoreDisplay: React.FC<GPScoreDisplayProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
        {score}
      </div>
      <span className="text-xs text-slate-500">{getScoreLabel(score)}</span>
    </div>
  );
};
