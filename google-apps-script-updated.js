// Aktualisiertes Google Apps Script
// Kopiere diesen Code in deinen Google Apps Script Editor

function doGet() {
  return HtmlService.createHtmlOutput('Die Google Apps Script Web App ist aktiv. Verwende POST für Datenübermittlung.');
}

// Diese Funktion behandelt POST-Anfragen von deiner Angular-App
function doPost(e) {
  try {
    // Log für Debugging
    console.log('Eingegangene POST-Anfrage');
    
    if (!e || !e.parameter || !e.parameter.data) {
      console.error('Keine Daten empfangen');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Keine Daten empfangen'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Daten aus dem Parameter extrahieren und parsen
    let data;
    try {
      data = JSON.parse(e.parameter.data);
      console.log('Daten erfolgreich geparst');
    } catch (error) {
      console.error('Fehler beim Parsen der Daten: ' + error);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Fehler beim Parsen der Daten: ' + error
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Prüfen, ob wichtige Datenfelder vorhanden sind
    if (!data.timestamp || !data.diagnosisTitle) {
      console.warn('Unvollständige Daten empfangen');
    }
    
    // Log der empfangenen Daten (gekürzt)
    console.log('Empfangene Daten: ' + JSON.stringify({
      timestamp: data.timestamp,
      name: data.name,
      language: data.language,
      painType: data.painType,
      toothNumber: data.toothNumber,
      diagnosisTitle: data.diagnosisTitle ? data.diagnosisTitle.substring(0, 50) : null
    }));
    
    // Zum Spreadsheet hinzufügen
    var result = appendToSheet(data);
    
    // Erfolgsantwort senden
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Daten erfolgreich gespeichert',
      result: result
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Fehler in doPost: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Fehler beim Verarbeiten der Anfrage: ' + error
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Diese Funktion fügt die Daten zu deinem Google Sheet hinzu
function appendToSheet(data) {
  try {
    // WICHTIG: Ersetze diese ID mit der ID deines Google Sheets
    var spreadsheetId = '1PX-eVkJeenSuxSEw_0quiXp0b97mfe4IOxov_BbwoP0';
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName('Sheet1'); // Ersetze mit deinem Sheet-Namen, falls anders
    
    if (!sheet) {
      console.error('Sheet nicht gefunden');
      return { error: 'Sheet nicht gefunden' };
    }
    
    // Prüfe, ob das Sheet leer ist und füge Überschriften hinzu, falls notwendig
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Zeitstempel',
        'Name',
        'Sprache',
        'Schmerzart',
        'Zahnnummer',
        'Symptome',
        'Diagnose Titel',
        'Diagnose Erklärung',
        'Behandlung',
        'Diagnose Titel (Original)',
        'Diagnose Erklärung (Original)',
        'Behandlung (Original)'
      ]);
    }
    
    // Daten in das Sheet schreiben
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || 'Nicht angegeben',
      data.language || 'Unbekannt',
      data.painType || 'Nicht angegeben',
      data.toothNumber || 'Nicht angegeben',
      data.symptoms || 'Keine',
      data.diagnosisTitle || 'Keine',
      data.diagnosisExplanation || 'Keine',
      data.diagnosisTreatment || 'Keine',
      data.diagnosisTitle_original || data.diagnosisTitle || 'Keine',
      data.diagnosisExplanation_original || data.diagnosisExplanation || 'Keine',
      data.diagnosisTreatment_original || data.diagnosisTreatment || 'Keine'
    ]);
    
    console.log('Daten erfolgreich in Sheet gespeichert');
    return { success: true };
  } catch (error) {
    console.error('Fehler beim Hinzufügen zum Sheet: ' + error);
    return { error: error.toString() };
  }
}

// Testfunktion zum Überprüfen der Verbindung zum Spreadsheet
function testConnection() {
  try {
    // WICHTIG: Ersetze diese ID mit der ID deines Google Sheets
    var spreadsheetId = '1PX-eVkJeenSuxSEw_0quiXp0b97mfe4IOxov_BbwoP0';
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    console.log('Verbindung zum Spreadsheet hergestellt');
    console.log('Spreadsheet-Name: ' + spreadsheet.getName());
    console.log('Anzahl der Blätter: ' + spreadsheet.getSheets().length);
    
    var sheets = spreadsheet.getSheets();
    for(var i = 0; i < sheets.length; i++) {
      console.log('Blatt ' + (i+1) + ': ' + sheets[i].getName());
    }
    
    return { success: true, message: 'Verbindung hergestellt' };
  } catch (error) {
    console.error('Fehler beim Verbinden mit dem Spreadsheet: ' + error);
    return { error: error.toString() };
  }
}

// Funktion zum Testen des doPost-Handlers ohne externe Anfrage
function testPost() {
  // Simuliere eine POST-Anfrage
  var testData = {
    parameter: {
      data: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: "Test Patient",
        language: "fr",
        painType: "Douleur dentaire",
        toothNumber: 32,
        symptoms: "Test-Symptome",
        diagnosisTitle: "Trouble de l'articulation temporo-mandibulaire",
        diagnosisExplanation: "Vos symptômes, comme la douleur et les cliquetis, sont caractéristiques d'un trouble de l'articulation temporo-mandibulaire (ATM).",
        diagnosisTreatment: "La physiothérapie et les massages peuvent aider à soulager les symptômes. Évitez de mâcher du chewing-gum et de croquer des aliments durs.",
        diagnosisTitle_original: "Trouble de l'articulation temporo-mandibulaire",
        diagnosisExplanation_original: "Vos symptômes, comme la douleur et les cliquetis, sont caractéristiques d'un trouble de l'articulation temporo-mandibulaire (ATM).",
        diagnosisTreatment_original: "La physiothérapie et les massages peuvent aider à soulager les symptômes. Évitez de mâcher du chewing-gum et de croquer des aliments durs."
      })
    }
  };
  
  console.log('Starte Test-POST');
  
  // Rufe doPost mit simulierten Daten auf
  var response = doPost(testData);
  
  console.log('Antwort vom doPost-Handler: ' + response.getContent());
  
  return "Test abgeschlossen - Überprüfe die Logs und das Spreadsheet";
}
