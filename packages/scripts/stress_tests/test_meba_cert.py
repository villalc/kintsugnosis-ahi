import time
import os
import concurrent.futures
import statistics
import sys

# Add meba-core to path
sys.path.append(os.path.abspath("packages/meba-core/src"))

from meba_core.certificate import generate_certificate

# Mock environment variable
os.environ["OMEGA_SIGNING_KEY"] = "test-signing-key-12345"

def worker(iterations=100):
    latencies = []
    for i in range(iterations):
        start = time.time()
        try:
            generate_certificate(f"Entity-{i}", 0.85 + (i % 15) / 100.0)
            latencies.append(time.time() - start)
        except Exception as e:
            print(f"Error: {e}")
    return latencies

def run_stress_test(num_threads=10, iterations_per_thread=1000):
    print(f"--- Running MEBA Stress Test (Threads={num_threads}, Iterations/Thread={iterations_per_thread}) ---")

    all_latencies = []
    start_test = time.time()

    with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
        futures = [executor.submit(worker, iterations_per_thread) for _ in range(num_threads)]
        for future in concurrent.futures.as_completed(futures):
            all_latencies.extend(future.result())

    total_duration = time.time() - start_test

    print(f"Total Certificates Generated: {len(all_latencies)}")
    print(f"Total Duration: {total_duration:.2f}s")
    print(f"Throughput: {len(all_latencies)/total_duration:.2f} certs/sec")
    print(f"Avg Latency: {statistics.mean(all_latencies)*1000:.4f}ms")
    print(f"Max Latency: {max(all_latencies)*1000:.4f}ms")
    print(f"Min Latency: {min(all_latencies)*1000:.4f}ms")

if __name__ == "__main__":
    run_stress_test(num_threads=10, iterations_per_thread=1000)
