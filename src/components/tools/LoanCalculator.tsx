import React, { useState, useCallback, useMemo } from 'react';

// --- Gemini API Constants and Utilities ---
const apiKey = "AIzaSyDoEa5ozUwNrmnrY9W6A3WDp6i-OdB2wKA"; // This will be provided by the environment
const model = 'gemini-2.5-flash-preview-09-2025';

interface AnalysisResult {
  text: string;
  sources: { uri: string; title: string }[];
}

// Add interfaces for Gemini API response structure
interface GeminiAttribution {
  web?: {
    uri: string;
    title: string;
  };
}

interface GeminiGroundingMetadata {
  groundingAttributions?: GeminiAttribution[];
}

interface GeminiCandidate {
  content?: {
    parts?: { text?: string }[];
  };
  groundingMetadata?: GeminiGroundingMetadata;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

/**
 * Executes a function with exponential backoff for API resilience.
 */
const withExponentialBackoff = async <T,>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error("Exponential backoff failed.");
};


// --- Internal Common Components ---
interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, description, className = '' }) => (
  <div className={`bg-white shadow-xl rounded-2xl p-6 md:p-8 ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
    )}
    {description && (
      <p className="text-slate-600 mb-6">{description}</p>
    )}
    {children}
  </div>
);

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, min = 0, max = 100, step = 1, unit }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="mb-6">
      {/* FIXED: Removed conflicting 'block' class (flex already handles display) */}
      <label className="text-sm font-medium text-slate-700 mb-1 flex justify-between">
        <span>{label}</span>
        <span className="font-semibold text-slate-900">{value.toLocaleString()} {unit}</span>
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleTextChange}
          className="w-24 p-2 border border-slate-300 rounded-lg text-right focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>
    </div>
  );
};

// --- Loan Calculator Logic and Component ---

interface LoanParameters {
  principal: number;
  annualRate: number;
  years: number;
}

const calculateMonthlyPayment = (P: number, R: number, T: number): number => {
  if (R === 0) {
    return P / (T * 12);
  }

  const monthlyRate = (R / 100) / 12;
  const totalPayments = T * 12;
  const power = Math.pow(1 + monthlyRate, totalPayments);
  const M = P * (monthlyRate * power) / (power - 1);

  return M;
};

export const LoanCalculator: React.FC = () => {
  const [params, setParams] = useState<LoanParameters>({
    principal: 200000,
    annualRate: 4.5,
    years: 30,
  });
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { monthlyPayment, totalInterest, totalRepayment } = useMemo(() => {
    const P = params.principal;
    const R = params.annualRate;
    const T = params.years;

    if (P <= 0 || T <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalRepayment: 0 };
    }

    const totalMonths = T * 12;
    const M = calculateMonthlyPayment(P, R, T);
    const totalRepayment = M * totalMonths;
    const totalInterest = totalRepayment - P;

    return {
      monthlyPayment: M,
      totalRepayment,
      totalInterest,
    };
  }, [params]);

  const updateParam = useCallback((key: keyof LoanParameters, value: number) => {
    setParams(prev => ({
      ...prev,
      [key]: value,
    }));
    setAnalysisResult(null);
    setError(null);
  }, []);

  const formatCurrency = useCallback((value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const handleLoanAnalysis = useCallback(async () => {
    if (monthlyPayment <= 0) {
      setError("Please ensure Principal, Rate, and Term are valid.");
      setAnalysisResult(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const userQuery = `Analyze a loan with the following parameters and results:
      - Principal: ${formatCurrency(params.principal)}
      - Annual Interest Rate: ${params.annualRate}%
      - Loan Term: ${params.years} years (${params.years * 12} months)
      - Calculated Monthly Payment: ${formatCurrency(monthlyPayment)}
      - Total Interest Paid: ${formatCurrency(totalInterest)}
      - Total Repayment: ${formatCurrency(totalRepayment)}
      
      Provide a concise financial analysis, pros/cons, and comment on the current relevance of this rate/term combination in the market.`;
      
    const systemPrompt = "You are a specialized, world-class financial analyst. Your task is to provide a concise, single-paragraph analysis of the provided loan terms. Mention the current market context if possible, and state the biggest takeaway for the borrower. Start your response directly with the analysis.";

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await withExponentialBackoff(async () => {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`API call failed with status: ${res.status}`);
        }
        return res;
      });

      const result: GeminiResponse = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        const text = candidate.content.parts[0].text;
        
        let sources: AnalysisResult['sources'] = [];
        const groundingMetadata = candidate.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
            // FIXED: Added type annotation for attribution parameter
            sources = groundingMetadata.groundingAttributions
                .map((attribution: GeminiAttribution) => ({
                    uri: attribution.web?.uri || '',
                    title: attribution.web?.title || 'External Source',
                }))
                // FIXED: Added type annotation for source parameter
                .filter((source: { uri: string; title: string }) => source.uri && source.title);
        }

        setAnalysisResult({ text, sources });
      } else {
        setError("Analysis failed: Could not retrieve text from the model.");
      }
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      setError(`Failed to get analysis. Please check your network connection or try again later. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [params, monthlyPayment, totalInterest, totalRepayment, formatCurrency]);


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card
          title="Mortgage & Loan Calculator"
          description="Estimate your monthly payments and total interest paid based on the loan principal, interest rate, and term."
          className="shadow-2xl border border-slate-200"
        >
          {/* Input Fields */}
          <InputField
            label="Loan Principal (P)"
            value={params.principal}
            onChange={(v) => updateParam('principal', Math.max(0, v))}
            min={10000}
            max={500000}
            step={1000}
            unit="USD"
          />

          <InputField
            label="Annual Interest Rate (R)"
            value={params.annualRate}
            onChange={(v) => updateParam('annualRate', Math.max(0, v))}
            min={0.1}
            max={15}
            step={0.1}
            unit="%"
          />

          <InputField
            label="Loan Term (T)"
            value={params.years}
            onChange={(v) => updateParam('years', Math.max(1, v))}
            min={1}
            max={40}
            step={1}
            unit="Years"
          />

          {/* Results Display */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Results</h3>

            {/* Monthly Payment */}
            <div className="flex justify-between items-center py-3 px-4 bg-orange-100 rounded-lg mb-4 shadow-md">
              <span className="text-base font-semibold text-orange-800">Monthly Payment</span>
              <span className="text-3xl font-extrabold text-orange-900">
                {formatCurrency(monthlyPayment)}
              </span>
            </div>

            {/* Amortization Summary */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-600">Total Repayment</p>
                <p className="text-xl font-bold text-slate-700 mt-1">
                  {formatCurrency(totalRepayment)}
                </p>
              </div>

              <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-600">Total Interest Paid</p>
                <p className="text-xl font-bold text-slate-700 mt-1">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-4 text-center">
                This calculation uses the standard amortization formula for fixed-rate loans.
            </p>
          </div>
          
          {/* Gemini API Feature */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleLoanAnalysis}
              disabled={isLoading || monthlyPayment <= 0}
              className={`w-full p-3 font-bold rounded-lg transition duration-200 shadow-lg 
                ${isLoading || monthlyPayment <= 0
                  ? 'bg-gray-400 cursor-not-allowed'  // FIXED: Removed conflicting text-gray-701
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'  // FIXED: Removed conflicting text-white
                } text-white`}  // FIXED: Consolidated text color here
            >
              {isLoading ? 'Analyzing Loan...' : 'Get Financial Analysis ✨'}
            </button>

            {/* Analysis Output */}
            <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-white shadow-inner">
              {error && <p className="text-red-600 font-medium">{error}</p>}
              
              {analysisResult ? (
                <div>
                  <h4 className="text-lg font-bold text-indigo-700 mb-2">Financial Analyst Report</h4>
                  <p className="text-slate-700 whitespace-pre-wrap">{analysisResult.text}</p>
                  
                  {analysisResult.sources.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Sources (Grounding):</p>
                      <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 ml-4">
                        {analysisResult.sources.map((source, index) => (
                          <li key={index} className="truncate">
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-500">
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 italic">Click the button above to get a market-aware analysis of your loan terms.</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Main App component
export default function App() {
  return (
    <LoanCalculator />
  );
}