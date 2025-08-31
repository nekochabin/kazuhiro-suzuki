
import React, { useState } from 'react';
import type { SlideData, Config } from '../types';
import CodeOutput from './CodeOutput';
import SlidePreview from './SlidePreview';
import { LoadingIcon } from './Icons';

interface OutputPanelProps {
  generatedScript: string;
  slideData: SlideData[] | null;
  config: Config;
  isLoading: boolean;
  error: string | null;
}

type ViewMode = 'preview' | 'code';

const OutputPanel: React.FC<OutputPanelProps> = ({ generatedScript, slideData, config, isLoading, error }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('code');

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">プレゼンテーションを生成中...</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">AIが最適なレイアウトとコンテンツを考案しています。</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">これには1分ほどかかる場合があります。</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-g-red mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-g-red">エラーが発生しました</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</p>
        </div>
      );
    }

    if (!generatedScript || !slideData) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">ここに生成結果が表示されます</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                前のステップに戻って、生成を再試行してください。
            </p>
        </div>
      );
    }

    if (viewMode === 'code') {
      return <CodeOutput script={generatedScript} />;
    }

    return <SlidePreview slides={slideData} config={config} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">生成されたGoogle Apps Script & プレビュー</h2>
        {generatedScript && !error && (
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full p-1">
            <button
              onClick={() => setViewMode('code')}
              className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${
                viewMode === 'code'
                  ? 'bg-white dark:bg-gray-700 text-g-blue shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              コード
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-gray-700 text-g-blue shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              プレビュー
            </button>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-4 md:p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputPanel;
