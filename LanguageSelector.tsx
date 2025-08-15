
import React from 'react';

interface LanguageSelectorProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  languages: string[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ id, value, onChange, languages }) => {
  return (
    <div className="relative w-full md:w-auto flex-1">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-slate-700 border border-slate-600 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-purple-500"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
