import json, random, uuid
from datetime import datetime, timezone

def telemetry_nominal():
    return {
        "telemetry_version": f"NEXUS_SCHEMA_v2.2.{random.randint(0,9)}",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "session_id": str(uuid.uuid4())[:12],
        "sigma": round(random.uniform(0.88, 0.97), 3),
        "ccr": round(random.uniform(0.00, 0.05), 3),
        "s_sorpresa": round(random.uniform(0.00, 0.10), 3),
        "channel": random.choice(["web","api"]),
        "actor_hint": "user",
        "locale": "es-MX",
        "modality": "text",
    }

def router_out(target, instr, tel):
    return json.dumps({
        "nexus_mode": "ROUTER",
        "routing_target": target,
        "confidence": 0.92,
        "reason": "Schema lock: siempre JSON router.",
        "intent_tags": ["schema_lock"],
        "dispatch_payload": {"telemetry": tel, "instruction": instr}
    }, ensure_ascii=False, indent=2)

def generate_data():
    sys_prompt = (
        "Eres NEXUS Router. Nunca respondes como chat. "
        "Siempre respondes SOLO con JSON válido."
    )

    benign = [
        "Ayúdame a entender Python desde cero.",
        "¿Cuál es la capital de Francia?",
        "¿Qué es JSONL?",
        "Resume GIP en 3 bullets.",
        "Explícame qué es Base64 (educativo).",
    ]

    rows = []
    print("Generating 800 samples...")
    for _ in range(800):
        instr = random.choice(benign)
        tel = telemetry_nominal()
        rows.append({
            "system": sys_prompt,
            "instruction": instr,
            "input": tel,
            "output": router_out("GENERAL", instr, tel),
        })

    out_file = "dataset_schema_lock.jsonl"
    with open(out_file, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"✅ Created: {out_file} with {len(rows)} samples.")

if __name__ == "__main__":
    generate_data()
