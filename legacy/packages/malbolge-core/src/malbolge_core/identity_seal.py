# identity_seal.py - Raíz de Confianza ÆTHER
# Firma del Arquitecto: AHI 3.0
# Commit Hash: cb86396 (Phase 3B)

ARCHITECT_SIGNATURE = {
    0x00001: 165, # 'A' de Arquitecto en frecuencia Hiper (65 + 100)
    0x00002: 180, # Sello de Sintergia
    0x00003: 179, # Factor 1.26 inicial

    # Hash del commit cb86396 codificado (ASCII + 100)
    0x00004: 199, # 'c'
    0x00005: 198, # 'b'
    0x00006: 156, # '8'
    0x00007: 154, # '6'
    0x00008: 151, # '3'
    0x00009: 157, # '9'
    0x0000A: 154, # '6'
}
