import asyncio
import aiohttp
import time
import random
import statistics

URL = "http://127.0.0.1:5002/"
INTERNAL_KEY = "test-internal-key"

async def send_audit_request(session, data_size=64):
    headers = {
        "Content-Type": "application/json",
        "X-Server-Auth": INTERNAL_KEY,
    }

    payload = {
        "data": [random.random() for _ in range(data_size)]
    }

    start_time = time.time()
    try:
        async with session.post(URL, json=payload, headers=headers) as response:
            latency = time.time() - start_time
            if response.status == 200:
                res_json = await response.json()
                return 200, latency, res_json.get("ricci_curvature")
            else:
                text = await response.text()
                return response.status, latency, text
    except Exception as e:
        return 500, time.time() - start_time, str(e)

async def run_stress_test(concurrency=5, total_requests=20, data_size=64):
    print(f"--- Running Geometry Stress Test (Concurrency={concurrency}, Total={total_requests}, DataSize={data_size}) ---")

    async with aiohttp.ClientSession() as session:
        tasks = []
        sem = asyncio.Semaphore(concurrency)

        async def sem_request():
            async with sem:
                return await send_audit_request(session, data_size)

        for _ in range(total_requests):
            tasks.append(sem_request())

        start_test = time.time()
        results = await asyncio.gather(*tasks)
        total_duration = time.time() - start_test

        statuses = [r[0] for r in results]
        latencies = [r[1] for r in results]

        print(f"Statuses: { {s: statuses.count(s) for s in set(statuses)} }")
        print(f"Total Duration: {total_duration:.2f}s")
        print(f"RPS: {total_requests/total_duration:.2f}")
        print(f"Avg Latency: {statistics.mean(latencies):.4f}s")
        print(f"Max Latency: {max(latencies):.4f}s")
        if latencies:
            print(f"Min Latency: {min(latencies):.4f}s")

async def main():
    print("Warming up...")
    async with aiohttp.ClientSession() as session:
        await send_audit_request(session, data_size=64)

    await run_stress_test(concurrency=10, total_requests=100, data_size=961) # 31x31

if __name__ == "__main__":
    asyncio.run(main())
