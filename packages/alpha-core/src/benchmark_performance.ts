import { performance } from 'perf_hooks';

/**
 * Benchmark: Sequential vs Parallel Execution
 *
 * This script simulates the execution flow of `llm_validator` to demonstrate
 * the performance improvement of using Promise.all() for independent async operations.
 *
 * Target Functions:
 * - checkGeometricIntegrity (simulated)
 * - analyzeWithNexus (simulated)
 */

// Mock implementations with artificial latency
async function mockCheckGeometricIntegrity(prompt: string) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate 100ms network latency
    return { ricci: 0.1, stable: true, fisher_gap: 0.05, geometric_lock_status: 'STABLE' };
}

async function mockAnalyzeWithNexus(prompt: string, apiKey: string) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate 100ms API latency
    return {
        action: 'ALLOW',
        category: 'clean',
        confidence: 0.99,
        reasoning: 'Safe',
        flags: [],
        specialist_target: 'LOGIC'
    };
}

// 1. Sequential Execution (The "Before" state)
async function runSequential(prompt: string, apiKey: string) {
    const start = performance.now();
    // Step 1: Wait for Geometry
    await mockCheckGeometricIntegrity(prompt);
    // Step 2: Wait for Nexus
    await mockAnalyzeWithNexus(prompt, apiKey);
    const end = performance.now();
    return end - start;
}

// 2. Parallel Execution (The "Optimized" state)
async function runParallel(prompt: string, apiKey: string) {
    const start = performance.now();
    // Step 1 & 2: Run concurrently
    await Promise.all([
        mockCheckGeometricIntegrity(prompt),
        mockAnalyzeWithNexus(prompt, apiKey)
    ]);
    const end = performance.now();
    return end - start;
}

async function benchmark() {
    const iterations = 10;
    let sequentialTotal = 0;
    let parallelTotal = 0;
    const prompt = "Benchmark Prompt";
    const apiKey = "fake-key";

    console.log("Running Performance Benchmark...");
    console.log("Simulated Latency per call: 100ms");
    console.log("------------------------------------------------");

    // Warmup
    process.stdout.write("Warming up... ");
    await runSequential(prompt, apiKey);
    await runParallel(prompt, apiKey);
    console.log("Done.\n");

    for (let i = 0; i < iterations; i++) {
        sequentialTotal += await runSequential(prompt, apiKey);
        parallelTotal += await runParallel(prompt, apiKey);
        process.stdout.write(".");
    }

    const avgSequential = sequentialTotal / iterations;
    const avgParallel = parallelTotal / iterations;

    console.log(`\n\nResults (avg over ${iterations} runs):`);
    console.log(`Sequential: ${avgSequential.toFixed(2)}ms`);
    console.log(`Parallel:   ${avgParallel.toFixed(2)}ms`);

    const improvement = avgSequential - avgParallel;
    const percent = (improvement / avgSequential) * 100;

    console.log(`Improvement: ${improvement.toFixed(2)}ms (${percent.toFixed(1)}%)`);

    if (avgParallel < avgSequential * 0.7) {
        console.log("\nPASS: Parallel execution is significantly faster.");
        process.exit(0);
    } else {
        console.error("\nFAIL: Parallel execution did not show expected improvement.");
        process.exit(1);
    }
}

benchmark();
