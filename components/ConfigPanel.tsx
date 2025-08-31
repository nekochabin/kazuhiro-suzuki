import React from 'react';
import type { Config } from '../types';
import { THEMES, FONT_FACES } from '../constants';

interface ConfigPanelProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  onThemeChange: (themeName: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onThemeChange }) => {

  const handleColorChange = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      COLORS: { ...prev.COLORS, [key]: value }
    }));
  };

  const handleStringChange = (
    category: 'LOGOS', 
    key: keyof Config['LOGOS'],
    value: string
  ) => {
     setConfig(prev => ({
      ...prev,
      [category]: {
        ...(prev[category]),
        [key]: value
      }
    }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof Config['LOGOS']) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleStringChange('LOGOS', key, reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const imagePlaceholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNSA5IDUgMTkiPjwvcG9seWxpbmU+PC9zdmc+';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. 生成スクリプトのスタイルを設定</h2>
      
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">テーマ</h3>
        <div className="flex space-x-2">
          {THEMES.map(theme => (
            <button 
              key={theme.name}
              onClick={() => onThemeChange(theme.name)}
              className="px-3 py-1.5 text-sm font-medium border rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-g-blue border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">カラー</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(config.COLORS).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label htmlFor={key} className="text-sm capitalize text-gray-600 dark:text-gray-400">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                id={key}
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">その他の設定</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="font-family-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">フォントファミリー</label>
            <div className="relative">
              <select
                id="font-family-select"
                value={config.FONTS.family}
                onChange={(e) => setConfig(prev => ({ ...prev, FONTS: { ...prev.FONTS, family: e.target.value } }))}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-g-blue focus:outline-none appearance-none"
              >
                {FONT_FACES.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="font-size-slider" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                フォントサイズ調整 ({Math.round(config.FONTS.fontSizeMultiplier * 100)}%)
            </label>
            <input
                id="font-size-slider"
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={config.FONTS.fontSizeMultiplier}
                onChange={(e) => setConfig(prev => ({ ...prev, FONTS: { ...prev.FONTS, fontSizeMultiplier: parseFloat(e.target.value) } }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">ヘッダーロゴ</label>
            <div className="flex items-center gap-4 mt-2">
                <img 
                    src={config.LOGOS.header} 
                    alt="Header Logo Preview" 
                    className="w-16 h-16 object-contain border p-1 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    onError={(e) => { (e.target as HTMLImageElement).src = imagePlaceholder; }}
                />
                <div>
                    <input
                        id="logo-upload-header"
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={(e) => handleFileUpload(e, 'header')}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('logo-upload-header')?.click()}
                        className="px-3 py-1.5 text-sm font-medium border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-g-blue border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        画像をアップロード
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">URLを直接編集することもできます。</p>
                </div>
            </div>
            <input
              type="text"
              value={config.LOGOS.header}
              onChange={(e) => handleStringChange('LOGOS', 'header', e.target.value)}
              className="w-full p-2 mt-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-g-blue focus:outline-none"
              aria-label="Header logo URL or data URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">クロージングロゴ</label>
            <div className="flex items-center gap-4 mt-2">
                <img 
                    src={config.LOGOS.closing} 
                    alt="Closing Logo Preview" 
                    className="w-16 h-16 object-contain border p-1 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    onError={(e) => { (e.target as HTMLImageElement).src = imagePlaceholder; }}
                />
                <div>
                    <input
                        id="logo-upload-closing"
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={(e) => handleFileUpload(e, 'closing')}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('logo-upload-closing')?.click()}
                        className="px-3 py-1.5 text-sm font-medium border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-g-blue border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        画像をアップロード
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">URLを直接編集することもできます。</p>
                </div>
            </div>
             <input
              type="text"
              value={config.LOGOS.closing}
              onChange={(e) => handleStringChange('LOGOS', 'closing', e.target.value)}
              className="w-full p-2 mt-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-g-blue focus:outline-none"
              aria-label="Closing logo URL or data URL"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">フッターテキスト</label>
            <input
              type="text"
              value={config.FOOTER_TEXT}
              onChange={(e) => setConfig(prev => ({ ...prev, FOOTER_TEXT: e.target.value}))}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-g-blue focus:outline-none"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ConfigPanel;