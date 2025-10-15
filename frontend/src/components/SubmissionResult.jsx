function SubmissionResult({ result, onClose }) {
  if (!result) return null;

  const isAccepted = result.status === 'Accepted';
  const successRate = result.successRate || 0;
  const passedTests = result.passedTestCases || 0;
  const totalTests = result.totalTestCases || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            {isAccepted ? (
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isAccepted ? 'Accepted!' : result.status || 'Wrong Answer'}
              </h2>
              <p className="text-slate-400">
                {isAccepted
                  ? 'Your solution has been accepted and saved.'
                  : 'Your solution did not pass all test cases.'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {result.error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <div className="text-red-400 font-semibold mb-2">Error</div>
              <div className="text-red-300 text-sm font-mono">{result.error}</div>
            </div>
          )}

          {result.compilationError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <div className="text-red-400 font-semibold mb-2">Compilation Error</div>
              <div className="text-red-300 text-sm font-mono whitespace-pre-wrap">{result.compilationError}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Success Rate</div>
              <div className={`text-3xl font-bold ${isAccepted ? 'text-green-400' : 'text-red-400'}`}>
                {Math.round(successRate)}%
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1">Tests Passed</div>
              <div className="text-3xl font-bold text-white">
                {passedTests}/{totalTests}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Execution Time</div>
                <div className="text-xl font-semibold text-white">
                  {result.executionTime ? `${result.executionTime}ms` : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Memory Used</div>
                <div className="text-xl font-semibold text-white">
                  {result.memoryUsed ? `${result.memoryUsed}KB` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {isAccepted && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-green-400 font-semibold mb-1">
                    Congratulations!
                  </div>
                  <div className="text-green-300 text-sm">
                    Your submission has been recorded. Keep solving more problems to improve your ranking!
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isAccepted && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-red-400 font-semibold mb-1">
                    Try Again
                  </div>
                  <div className="text-red-300 text-sm">
                    Review your solution and test it again. Check edge cases and logic errors.
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default SubmissionResult;
