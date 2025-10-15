function TestResults({ results, onClose }) {
  if (!results) return null;

  const testCaseResults = results.testCaseResults || [];
  const passedCount = results.passedTestCases || 0;
  const totalCount = results.totalTestCases || 0;
  const allPassed = results.status === 'Accepted' || passedCount === totalCount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Test Results</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {results.error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <div className="text-red-400 font-semibold mb-2">Error</div>
              <div className="text-red-300 text-sm font-mono">{results.error}</div>
            </div>
          )}

          {results.compilationError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <div className="text-red-400 font-semibold mb-2">Compilation Error</div>
              <div className="text-red-300 text-sm font-mono whitespace-pre-wrap">{results.compilationError}</div>
            </div>
          )}

          <div className="mb-6 flex items-center gap-4">
            <div className={`px-6 py-3 rounded-lg ${
              allPassed
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              <div className="text-2xl font-bold">
                {passedCount}/{totalCount}
              </div>
              <div className="text-sm">Tests Passed</div>
            </div>

            <div className="flex-1">
              <div className="text-lg font-semibold text-white mb-1">
                {allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
              </div>
              <div className="text-slate-400">
                {allPassed
                  ? 'Great job! Your solution is correct.'
                  : 'Review the failed test cases below.'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {testCaseResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.passed
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                      Test Case {result.testCaseNumber || (index + 1)}
                      {result.isSample && <span className="text-blue-400 ml-2">(Sample)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    {result.executionTime && <span>{result.executionTime}ms</span>}
                    {result.memoryUsed && <span>{result.memoryUsed}KB</span>}
                  </div>
                </div>

                {result.error && (
                  <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded">
                    <div className="text-red-400 text-sm font-semibold mb-1">Runtime Error:</div>
                    <div className="text-red-300 text-sm font-mono">{result.error}</div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Input:</div>
                    <div className="bg-slate-900 rounded p-2 text-slate-300 font-mono whitespace-pre-wrap">
                      {result.input || 'No input'}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-1">Expected Output:</div>
                    <div className="bg-slate-900 rounded p-2 text-slate-300 font-mono whitespace-pre-wrap">
                      {result.expectedOutput || 'No expected output'}
                    </div>
                  </div>

                  {!result.passed && result.actualOutput !== undefined && (
                    <div>
                      <div className="text-red-400 mb-1">Your Output:</div>
                      <div className="bg-slate-900 rounded p-2 text-red-300 font-mono whitespace-pre-wrap">
                        {result.actualOutput || 'No output'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestResults;
