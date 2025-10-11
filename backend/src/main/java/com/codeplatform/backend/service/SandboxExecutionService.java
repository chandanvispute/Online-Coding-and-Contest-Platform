package com.codeplatform.backend.service;

import com.codeplatform.backend.dto.TestCaseResult;
import com.codeplatform.backend.model.Language;
import com.codeplatform.backend.model.TestCase;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

@Service
public class SandboxExecutionService {

    private static final String SANDBOX_DIR = "/tmp/sandbox";
    private static final int DEFAULT_TIMEOUT_SECONDS = 5;
    private static final long DEFAULT_MEMORY_LIMIT_MB = 256;

    public TestCaseResult executeTestCase(String code, Language language, TestCase testCase) {
        TestCaseResult result = new TestCaseResult();
        result.setTestCaseNumber(testCase.getTestCaseNumber());
        result.setInput(testCase.getInput());
        result.setExpectedOutput(testCase.getExpectedOutput().trim());
        result.setIsSample(testCase.getIsSample());

        try {
            // Create sandbox directory
            String sessionId = UUID.randomUUID().toString();
            Path sandboxPath = createSandboxDirectory(sessionId);

            long startTime = System.currentTimeMillis();
            
            // Execute based on language
            ExecutionResult execResult = switch (language.getName().toLowerCase()) {
                case "java" -> executeJava(code, testCase.getInput(), sandboxPath);
                case "python" -> executePython(code, testCase.getInput(), sandboxPath);
                case "c++" -> executeCpp(code, testCase.getInput(), sandboxPath);
                default -> throw new UnsupportedOperationException("Language not supported: " + language.getName());
            };

            long endTime = System.currentTimeMillis();
            result.setExecutionTime(endTime - startTime);
            result.setMemoryUsed(execResult.memoryUsed);
            result.setActualOutput(execResult.output.trim());
            result.setError(execResult.error);

            // Check if output matches expected
            if (execResult.exitCode == 0 && execResult.error.isEmpty()) {
                boolean passed = compareOutputs(result.getExpectedOutput(), result.getActualOutput());
                result.setPassed(passed);
                result.setStatus(passed ? "Accepted" : "Wrong Answer");
            } else if (execResult.exitCode == 124) { // timeout
                result.setPassed(false);
                result.setStatus("Time Limit Exceeded");
            } else {
                result.setPassed(false);
                result.setStatus("Runtime Error");
            }

            // Cleanup
            cleanupSandbox(sandboxPath);

        } catch (Exception e) {
            result.setPassed(false);
            result.setStatus("System Error");
            result.setError("Execution failed: " + e.getMessage());
        }

        return result;
    }

    private ExecutionResult executeJava(String code, String input, Path sandboxPath) throws Exception {
        // Write Java file
        Path javaFile = sandboxPath.resolve("Solution.java");
        Files.write(javaFile, code.getBytes());

        // Compile
        ProcessBuilder compileBuilder = new ProcessBuilder("javac", "Solution.java");
        compileBuilder.directory(sandboxPath.toFile());
        compileBuilder.redirectErrorStream(true);
        
        Process compileProcess = compileBuilder.start();
        String compileOutput = readProcessOutput(compileProcess);
        
        if (compileProcess.waitFor() != 0) {
            return new ExecutionResult(1, "", compileOutput, 0L);
        }

        // Execute
        ProcessBuilder runBuilder = new ProcessBuilder("timeout", "5s", "java", "Solution");
        runBuilder.directory(sandboxPath.toFile());
        
        Process runProcess = runBuilder.start();
        
        // Provide input
        if (input != null && !input.isEmpty()) {
            try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                writer.println(input);
                writer.flush();
            }
        }

        String output = readProcessOutput(runProcess);
        String error = readProcessError(runProcess);
        int exitCode = runProcess.waitFor();
        
        return new ExecutionResult(exitCode, output, error, estimateMemoryUsage());
    }

    private ExecutionResult executePython(String code, String input, Path sandboxPath) throws Exception {
        // Write Python file
        Path pythonFile = sandboxPath.resolve("solution.py");
        Files.write(pythonFile, code.getBytes());

        // Execute
        ProcessBuilder runBuilder = new ProcessBuilder("timeout", "5s", "python3", "solution.py");
        runBuilder.directory(sandboxPath.toFile());
        
        Process runProcess = runBuilder.start();
        
        // Provide input
        if (input != null && !input.isEmpty()) {
            try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                writer.println(input);
                writer.flush();
            }
        }

        String output = readProcessOutput(runProcess);
        String error = readProcessError(runProcess);
        int exitCode = runProcess.waitFor();
        
        return new ExecutionResult(exitCode, output, error, estimateMemoryUsage());
    }

    private ExecutionResult executeCpp(String code, String input, Path sandboxPath) throws Exception {
        // Write C++ file
        Path cppFile = sandboxPath.resolve("solution.cpp");
        Files.write(cppFile, code.getBytes());

        // Compile
        ProcessBuilder compileBuilder = new ProcessBuilder("g++", "-o", "solution", "solution.cpp");
        compileBuilder.directory(sandboxPath.toFile());
        compileBuilder.redirectErrorStream(true);
        
        Process compileProcess = compileBuilder.start();
        String compileOutput = readProcessOutput(compileProcess);
        
        if (compileProcess.waitFor() != 0) {
            return new ExecutionResult(1, "", compileOutput, 0L);
        }

        // Execute
        ProcessBuilder runBuilder = new ProcessBuilder("timeout", "5s", "./solution");
        runBuilder.directory(sandboxPath.toFile());
        
        Process runProcess = runBuilder.start();
        
        // Provide input
        if (input != null && !input.isEmpty()) {
            try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                writer.println(input);
                writer.flush();
            }
        }

        String output = readProcessOutput(runProcess);
        String error = readProcessError(runProcess);
        int exitCode = runProcess.waitFor();
        
        return new ExecutionResult(exitCode, output, error, estimateMemoryUsage());
    }

    private Path createSandboxDirectory(String sessionId) throws IOException {
        Path sandboxPath = Paths.get(SANDBOX_DIR, sessionId);
        Files.createDirectories(sandboxPath);
        return sandboxPath;
    }

    private void cleanupSandbox(Path sandboxPath) {
        try {
            Files.walk(sandboxPath)
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
        } catch (IOException e) {
            // Log error but don't fail
            System.err.println("Failed to cleanup sandbox: " + e.getMessage());
        }
    }

    private String readProcessOutput(Process process) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            return reader.lines().reduce("", (a, b) -> a + "\n" + b).trim();
        }
    }

    private String readProcessError(Process process) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            return reader.lines().reduce("", (a, b) -> a + "\n" + b).trim();
        }
    }

    private boolean compareOutputs(String expected, String actual) {
        if (expected == null && actual == null) return true;
        if (expected == null || actual == null) return false;
        
        // Normalize whitespace and line endings
        String normalizedExpected = expected.trim().replaceAll("\\s+", " ");
        String normalizedActual = actual.trim().replaceAll("\\s+", " ");
        
        return normalizedExpected.equals(normalizedActual);
    }

    private long estimateMemoryUsage() {
        // Simulate memory usage (in real implementation, you'd measure actual usage)
        return (long) (Math.random() * 50 + 10); // 10-60 MB
    }

    private static class ExecutionResult {
        final int exitCode;
        final String output;
        final String error;
        final long memoryUsed;

        ExecutionResult(int exitCode, String output, String error, long memoryUsed) {
            this.exitCode = exitCode;
            this.output = output;
            this.error = error;
            this.memoryUsed = memoryUsed;
        }
    }
}