
import React, { useState, useCallback, useEffect } from 'react';
import { translateText } from './services/geminiService';
import { SUPPORTED_LANGUAGES } from './constants';
import LanguageSelector from './components/LanguageSelector';
import { SwapIcon } from './components/icons/SwapIcon';
import { CopyIcon } from './components/icons/CopyIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import { TranslateIcon } from './components/icons/TranslateIcon';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<string>('English');
  const [targetLang, setTargetLang] = useState<string>('Spanish');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    if (sourceLang === targetLang) {
      setOutputText(inputText);
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText('');

    try {
      const result = await translateText(sourceLang, targetLang, inputText);
      setOutputText(result);
    } catch (e) {
      setError('An error occurred during translation. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang]);

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  }, [sourceLang, targetLang, inputText, outputText]);

  const handleCopy = useCallback(() => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setIsCopied(true);
    }
  }, [outputText]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center p-4">
      <main className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Language Translator
          </h1>
          <p className="text-slate-400 mt-2">Powered by Gemini</p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl shadow-slate-950/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <LanguageSelector
              id="source-lang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              languages={SUPPORTED_LANGUAGES}
            />
            <button
              onClick={handleSwapLanguages}
              className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Swap languages"
            >
              <SwapIcon />
            </button>
            <LanguageSelector
              id="target-lang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              languages={SUPPORTED_LANGUAGES}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-64 p-4 bg-slate-900 border border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {inputText.length} / 5000
              </div>
            </div>
            <div className="relative">
              <textarea
                id="output-text"
                value={outputText}
                readOnly
                placeholder={isLoading ? "Translating..." : "Translation"}
                className="w-full h-64 p-4 bg-slate-900 border border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
              />
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-slate-300"
                  aria-label="Copy to clipboard"
                >
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
              )}
            </div>
          </div>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          
          <div className="flex justify-center">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Translating...
                </>
              ) : (
                <>
                  <TranslateIcon />
                  Translate
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
