import React from 'react';

interface InstagramPostProps {
  imageUrl: string;
  headline: string;
  bodyText: string;
  ctaText: string;
}

export const InstagramPost: React.FC<InstagramPostProps> = ({
  imageUrl,
  headline,
  bodyText,
  ctaText,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">greenreach_ads</div>
          </div>
        </div>
        <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </div>

      {/* Image */}
      <div className="aspect-square">
        <img
          src={imageUrl}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center space-x-4">
          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-slate-900">greenreach_ads</span>
            <span className="text-slate-900 font-medium">{headline}</span>
          </div>
          <p className="text-slate-900 leading-relaxed">{bodyText}</p>
          <div className="mt-2">
            <span className="text-emerald-600 font-semibold">{ctaText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
