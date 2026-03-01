import asyncio
import aiohttp
import time
import statistics

URL = "http://127.0.0.1:5001/api_gateway"
API_KEY = "test-key"

async def send_request(session, ip_header=None, api_key=API_KEY):
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
    }
    if ip_header:
        headers["X-Forwarded-For"] = ip_header

    payload = {"prompt": "Stress test prompt"}

    start_time = time.time()
    try:
        async with session.post(URL, json=payload, headers=headers) as response:
            latency = time.time() - start_time
            return response.status, latency
    except Exception as e:
        return 500, time.time() - start_time

async def test_rate_limiter_single_ip():
    print("--- Testing Rate Limiter (Single IP) ---")
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(10):
            tasks.append(send_request(session))

        results = await asyncio.gather(*tasks)

        statuses = [r[0] for r in results]
        latencies = [r[1] for r in results]

        print(f"Statuses: {statuses}")
        print(f"Avg Latency: {statistics.mean(latencies):.4f}s")
        print(f"Success count: {statuses.count(202)}")
        print(f"Rate limited count (429): {statuses.count(429)}")

async def test_auth():
    print("\n--- Testing Auth (Invalid API Key) ---")
    async with aiohttp.ClientSession() as session:
        status, _ = await send_request(session, api_key="wrong-key")
        print(f"Status with wrong key: {status}")

async def test_rate_limiter_multiple_ips():
    print("\n--- Testing Rate Limiter (Multiple IPs) ---")
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(10):
            tasks.append(send_request(session, ip_header=f"1.2.3.{i}"))

        results = await asyncio.gather(*tasks)

        statuses = [r[0] for r in results]
        latencies = [r[1] for r in results]

        print(f"Statuses: {statuses}")
        print(f"Avg Latency: {statistics.mean(latencies):.4f}s")
        print(f"Success count: {statuses.count(202)}")
        print(f"Rate limited count (429): {statuses.count(429)}")

async def main():
    await test_auth()
    await test_rate_limiter_single_ip()
    await test_rate_limiter_multiple_ips()

if __name__ == "__main__":
    asyncio.run(main())
