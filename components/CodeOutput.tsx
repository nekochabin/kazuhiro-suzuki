
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface CodeOutputProps {
  script: string;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="p-4 bg-gray-800 text-gray-300 text-sm rounded-t-lg">
        <h3 className="font-semibold text-base mb-2 text-white">スクリプトの使い方</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>下の「コピー」ボタンでコードをすべてコピーします。</li>
          <li>Googleスライドを開き、「拡張機能」メニューから「Apps Script」を選択します。</li>
          <li>エディタの内容をすべて削除し、コピーしたコードを貼り付けます。</li>
          <li>上部の「▷ 実行」ボタンを押して、<code>generatePresentation</code>関数を実行します。</li>
        </ol>
      </div>
      <div className="relative bg-gray-900 rounded-b-lg">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon className="w-5 h-5 text-g-green" />
          ) : (
            <CopyIcon className="w-5 h-5" />
          )}
        </button>
        <pre className="p-4 pt-12 overflow-x-auto text-sm text-white rounded-b-lg">
          <code className="language-javascript">{script}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeOutput;
