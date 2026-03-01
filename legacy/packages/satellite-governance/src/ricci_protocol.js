/**
 * Protocolo P-II-RICCI: Auditoría de Integridad Geométrica
 * Conecta con el "Hub" (App Hosting) para verificar la estabilidad
 * estructural de los modelos.
 */

function getHubEndpoint_() {
  return PropertiesService.getScriptProperties().getProperty('HUB_ENDPOINT') || '';
}

function getHubApiKey_() {
  return PropertiesService.getScriptProperties().getProperty('HUB_API_KEY') || '';
}

function runRicciProtocol() {
  const sheet = getOrCreateLogSheet();
  const timestamp = new Date();
  
  try {
    const hubEndpoint = getHubEndpoint_();
    const hubApiKey = getHubApiKey_();

    if (!hubEndpoint) {
      sheet.appendRow([timestamp, "CONFIG_MISSING", 0, "N/A", "Missing HUB_ENDPOINT"]);
      return { error: "Missing HUB_ENDPOINT" };
    }

    const payload = {
      action: "DAILY_PULSE",
      source: "SATELLITE_GAS",
      timestamp: timestamp.toISOString()
    };

    const options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(payload),
      'muteHttpExceptions': true,
      'headers': hubApiKey ? { 'X-API-Key': hubApiKey } : {}
    };

    const response = UrlFetchApp.fetch(hubEndpoint, options);
    const statusCode = response.getResponseCode();
    const raw = response.getContentText();

    if (statusCode < 200 || statusCode >= 300) {
      sheet.appendRow([timestamp, "HUB_ERROR", 0, "N/A", `HTTP ${statusCode}: ${raw}`]);
      return { error: `HTTP ${statusCode}`, raw };
    }

    const data = JSON.parse(raw);
    const curvature = Number(data.ricci_curvature ?? data.ricciCurvature ?? data.curvature ?? 0);
    const status = String(data.status ?? data.state ?? "UNKNOWN");
    const integrityHash = String(data.integrity_hash ?? data.integrityHash ?? "N/A");

    // Registrar en Bitácora (Memoria Ancestral)
    sheet.appendRow([
      timestamp,
      status,
      curvature,
      integrityHash,
      "AUDIT_OK"
    ]);

    return { status, ricci_curvature: curvature, integrity_hash: integrityHash, raw: data };

  } catch (e) {
    console.error("Fallo en Protocolo RICCI:", e);
    sheet.appendRow([timestamp, "ERROR", 0, "N/A", e.toString()]);
    return { error: e.toString() };
  }
}

function getOrCreateLogSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Bitácora_RICCI");
  if (!sheet) {
    sheet = ss.insertSheet("Bitácora_RICCI");
    sheet.appendRow(["Timestamp", "Estatus", "Curvatura Ricci", "Hash Integridad", "Notas"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
