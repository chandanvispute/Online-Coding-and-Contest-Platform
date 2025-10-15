package com.codeplatform.backend.service;

import com.codeplatform.backend.dto.SubmissionResponse;
import com.codeplatform.backend.dto.TestCaseResult;
import com.codeplatform.backend.model.Language;
import com.codeplatform.backend.model.Problem;
import com.codeplatform.backend.util.JsonUtil;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {

    private static final String TEMP_DIR = System.getProperty("java.io.tmpdir") + "/codeplatform/";

    public SubmissionResponse executeCode(String code, Language language, Problem problem) {
        try {
            return executeWithDetailedResults(code, language, problem);
        } catch (Exception e) {
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("Runtime Error");
            errorResponse.setError(e.getMessage());
            return errorResponse;
        }
    }

    public SubmissionResponse executeSampleTestCases(String code, Language language, Problem problem) {
        try {
            return executeWithSampleTestCases(code, language, problem);
        } catch (Exception e) {
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("Runtime Error");
            errorResponse.setError(e.getMessage());
            return errorResponse;
        }
    }

    private SubmissionResponse executeWithDetailedResults(String code, Language language, Problem problem) {
        try {
            // Parse test cases
            List<Map<String, Object>> sampleTestCases = JsonUtil.parseSampleTestCases(problem.getSampleTestCases());
            List<Map<String, String>> hiddenTestCases = JsonUtil.parseTestCases(problem.getTestCases());
            List<String> expectedOutputs = JsonUtil.parseExpectedOutputs(problem.getExpectedOutputs());

            List<TestCaseResult> testCaseResults = new ArrayList<>();
            int passedCount = 0;
            long totalExecutionTime = 0;
            long maxMemoryUsed = 0;

            // Execute sample test cases first (always visible)
            for (int i = 0; i < sampleTestCases.size(); i++) {
                Map<String, Object> testCase = sampleTestCases.get(i);
                String input = (String) testCase.get("input");
                String expectedOutput = (String) testCase.get("output");

                TestCaseResult result = executeTestCase(code, language, input, expectedOutput, i + 1);
                result.setIsSample(true);
                testCaseResults.add(result);

                totalExecutionTime += result.getExecutionTime();
                maxMemoryUsed = Math.max(maxMemoryUsed, result.getMemoryUsed());

                if (result.getPassed()) {
                    passedCount++;
                }
            }

            // Execute hidden test cases
            for (int i = 0; i < hiddenTestCases.size(); i++) {
                Map<String, String> testCase = hiddenTestCases.get(i);
                String input = testCase.get("input");
                String expectedOutput = expectedOutputs.get(i).trim();

                TestCaseResult result = executeTestCase(code, language, input, expectedOutput,
                        sampleTestCases.size() + i + 1);
                result.setIsSample(false);

                // For hidden test cases, don't show input/output details if failed
                if (!result.getPassed()) {
                    result.setInput("Hidden");
                    result.setExpectedOutput("Hidden");
                    result.setActualOutput("Hidden");
                }

                testCaseResults.add(result);
                totalExecutionTime += result.getExecutionTime();
                maxMemoryUsed = Math.max(maxMemoryUsed, result.getMemoryUsed());

                if (result.getPassed()) {
                    passedCount++;
                }
            }

            int totalTestCases = sampleTestCases.size() + hiddenTestCases.size();

            // Create response
            SubmissionResponse response = new SubmissionResponse();
            response.setTotalTestCases(totalTestCases);
            response.setPassedTestCases(passedCount);
            response.setTestCaseResults(testCaseResults);
            response.setExecutionTime(totalExecutionTime / totalTestCases);
            response.setMemoryUsed(maxMemoryUsed);
            response.setSuccessRate((double) passedCount / totalTestCases * 100);

            if (passedCount == totalTestCases) {
                response.setStatus("Accepted");
                response.setOutput("All test cases passed");
            } else {
                response.setStatus("Wrong Answer");
                response.setOutput("Failed " + (totalTestCases - passedCount) + " test case(s)");

                // Find first failed test case
                for (TestCaseResult result : testCaseResults) {
                    if (!result.getPassed()) {
                        String testCaseType = result.getIsSample() ? "Sample test case" : "Test case";
                        response.setTestCaseFailed(testCaseType + " " + result.getTestCaseNumber());
                        if (result.getIsSample()) {
                            response.setError(
                                    "Expected: " + result.getExpectedOutput() + ", Got: " + result.getActualOutput());
                        } else {
                            response.setError("Failed on hidden test case");
                        }
                        break;
                    }
                }
            }

            return response;

        } catch (Exception e) {
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("System Error");
            errorResponse.setError(e.getMessage());
            return errorResponse;
        }
    }

    private SubmissionResponse executeWithSampleTestCases(String code, Language language, Problem problem) {
        try {
            List<Map<String, Object>> sampleTestCases = JsonUtil.parseSampleTestCases(problem.getSampleTestCases());

            List<TestCaseResult> testCaseResults = new ArrayList<>();
            int passedCount = 0;
            long totalExecutionTime = 0;
            long maxMemoryUsed = 0;

            // Execute each sample test case
            for (int i = 0; i < sampleTestCases.size(); i++) {
                Map<String, Object> testCase = sampleTestCases.get(i);
                String input = (String) testCase.get("input");
                String expectedOutput = (String) testCase.get("output");

                TestCaseResult result = executeTestCase(code, language, input, expectedOutput, i + 1);
                result.setIsSample(true);
                testCaseResults.add(result);

                totalExecutionTime += result.getExecutionTime();
                maxMemoryUsed = Math.max(maxMemoryUsed, result.getMemoryUsed());

                if (result.getPassed()) {
                    passedCount++;
                }
            }

            // Create response
            SubmissionResponse response = new SubmissionResponse();
            response.setTotalTestCases(sampleTestCases.size());
            response.setPassedTestCases(passedCount);
            response.setTestCaseResults(testCaseResults);
            response.setExecutionTime(totalExecutionTime / sampleTestCases.size());
            response.setMemoryUsed(maxMemoryUsed);
            response.setSuccessRate((double) passedCount / sampleTestCases.size() * 100);

            if (passedCount == sampleTestCases.size()) {
                response.setStatus("Sample Tests Passed");
                response.setOutput("All sample test cases passed");
            } else {
                response.setStatus("Sample Tests Failed");
                response.setOutput("Failed " + (sampleTestCases.size() - passedCount) + " sample test case(s)");

                // Find first failed test case
                for (TestCaseResult result : testCaseResults) {
                    if (!result.getPassed()) {
                        response.setTestCaseFailed("Sample test case " + result.getTestCaseNumber());
                        response.setError(
                                "Expected: " + result.getExpectedOutput() + ", Got: " + result.getActualOutput());
                        break;
                    }
                }
            }

            return response;

        } catch (Exception e) {
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("System Error");
            errorResponse.setError(e.getMessage());
            return errorResponse;
        }
    }

    /**
     * Execute a single test case by running the user's code with the given input
     * and comparing the actual output with the expected output.
     */
    private TestCaseResult executeTestCase(String code, Language language, String input, String expectedOutput,
            int testCaseNumber) {
        TestCaseResult result = new TestCaseResult();
        result.setTestCaseNumber(testCaseNumber);
        result.setInput(input != null ? input : "No input");
        result.setExpectedOutput(expectedOutput != null ? expectedOutput : "No expected output");

        try {
            long startTime = System.currentTimeMillis();

            // Execute the code and get actual output
            String actualOutput = runCode(code, language, input);

            long executionTime = System.currentTimeMillis() - startTime;
            result.setExecutionTime(Math.max(executionTime, 50)); // Minimum 50ms
            result.setMemoryUsed((long) (Math.random() * 30 + 20)); // Simulated memory usage

            result.setActualOutput(actualOutput != null ? actualOutput.trim() : "");

            // Compare outputs
            boolean passed = compareOutputs(expectedOutput, actualOutput);
            result.setPassed(passed);
            result.setStatus(passed ? "Accepted" : "Wrong Answer");

        } catch (Exception e) {
            result.setPassed(false);
            result.setStatus("Runtime Error");
            result.setError(e.getMessage());
            result.setActualOutput("Error occurred");
            result.setExecutionTime(0L);
            result.setMemoryUsed(0L);
        }

        return result;
    }

    /**
     * Run the user's code with the given input and return the actual output.
     * This is where the actual code execution happens.
     */
    private String runCode(String code, Language language, String input) throws Exception {
        return executeCodeReal(code, language, input);
    }

    private String executeCodeReal(String code, Language language, String input) throws Exception {
        // Create temporary directory
        Files.createDirectories(Paths.get(TEMP_DIR));

        String fileName = "Solution." + language.getExtension();
        String filePath = TEMP_DIR + fileName;

        try {
            // Write code to file
            Files.write(Paths.get(filePath), code.getBytes());

            // Execute based on language
            switch (language.getName()) {
                case "Java":
                    return executeJavaCode(filePath, input);
                case "Python":
                    return executePythonCode(filePath, input);
                case "C++":
                    return executeCppCode(filePath, input);
                default:
                    throw new RuntimeException("Unsupported language: " + language.getName());
            }

        } finally {
            // Clean up temporary files
            try {
                Files.deleteIfExists(Paths.get(filePath));
                if (language.getName().equals("Java")) {
                    Files.deleteIfExists(Paths.get(TEMP_DIR + "Solution.class"));
                }
                if (language.getName().equals("C++")) {
                    Files.deleteIfExists(Paths.get(TEMP_DIR + "solution"));
                }
            } catch (Exception e) {
                // Ignore cleanup errors
            }
        }
    }

    private String executeJavaCode(String filePath, String input) throws Exception {
        try {
            // Compile Java code
            Process compileProcess = new ProcessBuilder("javac", filePath)
                    .directory(new File(TEMP_DIR))
                    .redirectErrorStream(true)
                    .start();

            if (!compileProcess.waitFor(10, TimeUnit.SECONDS)) {
                compileProcess.destroyForcibly();
                throw new RuntimeException("Compilation timeout");
            }

            if (compileProcess.exitValue() != 0) {
                String error = readStream(compileProcess.getInputStream());
                throw new RuntimeException("Compilation Error: " + error);
            }

            // Run Java code
            Process runProcess = new ProcessBuilder("java", "-cp", TEMP_DIR, "Solution")
                    .directory(new File(TEMP_DIR))
                    .start();

            // Provide input
            if (input != null && !input.trim().isEmpty()) {
                try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                    writer.println(input);
                    writer.flush();
                }
            }
            runProcess.getOutputStream().close();

            if (!runProcess.waitFor(5, TimeUnit.SECONDS)) {
                runProcess.destroyForcibly();
                throw new RuntimeException("Execution timeout");
            }

            if (runProcess.exitValue() != 0) {
                String error = readStream(runProcess.getErrorStream());
                throw new RuntimeException("Runtime Error: " + error);
            }

            return readStream(runProcess.getInputStream());

        } catch (IOException e) {
            throw new RuntimeException(
                    "Java compiler not available. Please ensure JDK is installed and javac is in PATH.");
        }
    }

    private String executePythonCode(String filePath, String input) throws Exception {
        try {
            Process runProcess = new ProcessBuilder("python3", filePath)
                    .directory(new File(TEMP_DIR))
                    .start();

            // Provide input
            if (input != null && !input.trim().isEmpty()) {
                try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                    writer.println(input);
                    writer.flush();
                }
            }
            runProcess.getOutputStream().close();

            if (!runProcess.waitFor(5, TimeUnit.SECONDS)) {
                runProcess.destroyForcibly();
                throw new RuntimeException("Execution timeout");
            }

            if (runProcess.exitValue() != 0) {
                String error = readStream(runProcess.getErrorStream());
                throw new RuntimeException("Runtime Error: " + error);
            }

            return readStream(runProcess.getInputStream());

        } catch (IOException e) {
            // Try python instead of python3
            try {
                Process runProcess = new ProcessBuilder("python", filePath)
                        .directory(new File(TEMP_DIR))
                        .start();

                if (input != null && !input.trim().isEmpty()) {
                    try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                        writer.println(input);
                        writer.flush();
                    }
                }
                runProcess.getOutputStream().close();

                if (!runProcess.waitFor(5, TimeUnit.SECONDS)) {
                    runProcess.destroyForcibly();
                    throw new RuntimeException("Execution timeout");
                }

                if (runProcess.exitValue() != 0) {
                    String error = readStream(runProcess.getErrorStream());
                    throw new RuntimeException("Runtime Error: " + error);
                }

                return readStream(runProcess.getInputStream());

            } catch (IOException e2) {
                throw new RuntimeException(
                        "Python interpreter not available. Please ensure Python is installed and in PATH.");
            }
        }
    }

    private String executeCppCode(String filePath, String input) throws Exception {
        String executablePath = TEMP_DIR + "solution";

        try {
            // Compile C++ code
            Process compileProcess = new ProcessBuilder("g++", filePath, "-o", executablePath)
                    .directory(new File(TEMP_DIR))
                    .redirectErrorStream(true)
                    .start();

            if (!compileProcess.waitFor(10, TimeUnit.SECONDS)) {
                compileProcess.destroyForcibly();
                throw new RuntimeException("Compilation timeout");
            }

            if (compileProcess.exitValue() != 0) {
                String error = readStream(compileProcess.getInputStream());
                throw new RuntimeException("Compilation Error: " + error);
            }

            // Run C++ code
            Process runProcess = new ProcessBuilder(executablePath)
                    .directory(new File(TEMP_DIR))
                    .start();

            // Provide input
            if (input != null && !input.trim().isEmpty()) {
                try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                    writer.println(input);
                    writer.flush();
                }
            }
            runProcess.getOutputStream().close();

            if (!runProcess.waitFor(5, TimeUnit.SECONDS)) {
                runProcess.destroyForcibly();
                throw new RuntimeException("Execution timeout");
            }

            if (runProcess.exitValue() != 0) {
                String error = readStream(runProcess.getErrorStream());
                throw new RuntimeException("Runtime Error: " + error);
            }

            return readStream(runProcess.getInputStream());

        } catch (IOException e) {
            throw new RuntimeException("C++ compiler not available. Please ensure g++ is installed and in PATH.");
        }
    }

    private boolean compareOutputs(String expected, String actual) {
        if (expected == null && actual == null)
            return true;
        if (expected == null || actual == null)
            return false;

        // Normalize whitespace and line endings
        String normalizedExpected = expected.trim().replaceAll("\\s+", " ");
        String normalizedActual = actual.trim().replaceAll("\\s+", " ");

        return normalizedExpected.equals(normalizedActual);
    }

    private String readStream(InputStream inputStream) throws IOException {
        StringBuilder result = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append("\n");
            }
        }
        return result.toString().trim();
    }
}