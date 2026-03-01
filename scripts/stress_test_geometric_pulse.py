import requests
import time
import numpy as np
import argparse

def run_stress_test(endpoint, num_requests=10):
    """
    Mide la latencia y robustez del endpoint de Auditoría Geométrica.
    """
    print(f"🚀 Iniciando Prueba de Carga contra: {endpoint}")
    print(f"📦 Volumen: {num_requests} peticiones secuenciales (DAILY_PULSE mode)")
    print("-" * 50)
    
    latencies = []
    success_count = 0
    gaps = []
    
    payload = {
        "action": "DAILY_PULSE"
    }
    
    # Headers para simular el pulso interno (omite App Check para el test interno)
    headers = {
        "Content-Type": "application/json",
        "X-Jules-Internal": "Sovereign-Pulse"
    }

    for i in range(num_requests):
        start_time = time.perf_counter()
        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=5)
            end_time = time.perf_counter()
            
            latency = (end_time - start_time) * 1000 # ms
            latencies.append(latency)
            
            if response.status_code == 200:
                success_count += 1
                data = response.json()
                gap = data.get("fisher_gap", 0)
                gaps.append(gap)
                print(f"[{i+1}/{num_requests}] OK - Latencia: {latency:.2f}ms | Gap: {gap:.6f}")
            else:
                print(f"[{i+1}/{num_requests}] ERROR {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"[{i+1}/{num_requests}] EXCEPTION: {e}")
            
    print("-" * 50)
    if latencies:
        print(f"📊 RESULTADOS:")
        print(f"   - Éxito: {success_count}/{num_requests}")
        print(f"   - Latencia Media: {np.mean(latencies):.2f}ms")
        print(f"   - Latencia P95: {np.percentile(latencies, 95):.2f}ms")
        print(f"   - Gap Medio: {np.mean(gaps) if gaps else 0:.6f}")
        
    if any(g == 0.1234 for g in gaps):
        print("\n⚠️ ALERTA: Se detectaron valores mock (0.1234). El despliegue no está usando el core actualizado.")
    else:
        print("\n✅ VERIFICADO: El sistema está reportando mediciones de curvatura reales.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Stress Test para Geometric Pulse")
    parser.add_argument("url", help="URL del endpoint /audit-ricci")
    parser.add_argument("--n", type=int, default=10, help="Número de peticiones")
    
    args = parser.parse_args()
    run_stress_test(args.url, args.n)
