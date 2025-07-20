# CheckMyToothbot - Dental Pain Self-Diagnosis Application

CheckMyToothbot is an Angular-based web application for dental pain self-diagnosis that helps users identify potential causes for their dental problems and receive appropriate recommendations for action.

![CheckMyToothbot Logo](/img/logo.png)

## Features

- Interactive dental chart for selecting the affected tooth
- Specification of pain type/problem category (tooth, gum, TMJ)
- Guided questionnaire for precise diagnosis
- Multi-language interface (English, German, French, Arabic)
- Presentation of diagnosis results with recommendations
- Data collection in Google Sheets for analysis and improvement
- Responsive design for mobile and desktop use

## Installation

1. Ensure [Node.js](https://nodejs.org/) (v16 or later) and npm are installed
2. Clone the repository: `git clone https://github.com/ismailmasmoudi/Check-My-Teeth-app.git`
3. Navigate to the project directory: `cd DentApp`
4. Install dependencies: `npm install`
5. Start the application: `ng serve`
6. Open the application in your browser at `http://localhost:4200`

## Google Sheets Integration

The application stores diagnosis data in Google Sheets for later analysis. This requires a Google Apps Script:

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Insert the following code:

```javascript
function doPost(e) {
  try {
    // Log for debugging
    console.log('POST request received');
    
    if (!e || !e.parameter || !e.parameter.data) {
      console.error('No data received');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'No data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Extract and parse data from parameter
    let data;
    try {
      data = JSON.parse(e.parameter.data);
      console.log('Data successfully parsed');
    } catch (error) {
      console.error('Error parsing data: ' + error);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Error parsing data: ' + error
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the spreadsheet by ID - more reliable than getActiveSpreadsheet()
    var spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your spreadsheet ID
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName('Data') || spreadsheet.insertSheet('Data');
    
    var nextRow = sheet.getLastRow() + 1;
    
    // Create headers if sheet is empty
    if (nextRow === 1) {
      const headers = [
        'Timestamp',
        'Name',
        'Language',
        'Pain Type',
        'Tooth Number',
        'Symptoms',
        'Diagnosis Title',
        'Diagnosis Explanation',
        'Treatment',
        'Diagnosis Title (Original)',
        'Diagnosis Explanation (Original)',
        'Treatment (Original)'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      nextRow = 2;
    }
    
    // Format data for the sheet
    var newRow = [
      data.timestamp || new Date().toISOString(),
      data.name || 'Not provided',
      data.language || 'en',
      data.painType || 'Not specified',
      data.toothNumber || 'N/A',
      data.symptoms || 'None',
      data.diagnosisTitle || 'None',
      data.diagnosisExplanation || 'None',
      data.diagnosisTreatment || 'None',
      data.diagnosisTitle_original || data.diagnosisTitle || 'None',
      data.diagnosisExplanation_original || data.diagnosisExplanation || 'None',
      data.diagnosisTreatment_original || data.diagnosisTreatment || 'None'
    ];
    
    // Append row
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    console.log('Data successfully saved to sheet');
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'success': true, 'message': 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch(error) {
    console.error('Error in doPost: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({ 'success': false, 'message': 'Error processing request: ' + error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to test connection to the spreadsheet
function testConnection() {
  try {
    var spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your spreadsheet ID
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    console.log('Connection to spreadsheet established');
    console.log('Spreadsheet name: ' + spreadsheet.getName());
    
    return { success: true, message: 'Connection established' };
  } catch (error) {
    console.error('Error connecting to spreadsheet: ' + error);
    return { error: error.toString() };
  }
}
```

4. Replace `'YOUR_SPREADSHEET_ID'` with your actual Google Sheet ID (found in the URL)
5. Save the script and select "Deploy > New deployment"
6. Choose "Web App" as the type
7. Set execution to "Me" and access to "Anyone" (for testing purposes)
8. Copy the generated Web App URL
9. Replace the `scriptUrl` variable in `src/app/services/data-logger.service.ts` with your new URL

## Customizing the Application

- Diagnoses can be modified in `src/app/data/diagnoses.json`
- Pain types are defined in `src/app/data/pain-types.json`
- Questions for different issues are stored in the JSON files in the `src/app/data/` directory
- All text content is available in multiple languages within these JSON files

## Project Structure

```
DentApp/
├── src/
│   ├── app/
│   │   ├── components/          # Angular components
│   │   │   ├── diagnosis-result/
│   │   │   ├── info-menu/
│   │   │   ├── pain-type-selector/
│   │   │   ├── question-flow/
│   │   │   ├── tooth-selector/
│   │   │   └── tooth-status-flow/
│   │   ├── data/                # JSON data files
│   │   │   ├── diagnoses.json   # Diagnosis definitions
│   │   │   ├── pain-types.json  # Pain type definitions
│   │   │   ├── questions-gum.json
│   │   │   ├── questions-tmj.json
│   │   │   └── questions-tooth.json
│   │   ├── services/            # Angular services
│   │   │   ├── data-logger.service.ts  # Google Sheets integration
│   │   │   ├── diagnosis.service.ts
│   │   │   └── question-flow.service.ts
│   │   ├── app.component.*      # Main application component
│   │   └── app.routes.ts        # Application routing
│   ├── assets/                  # Static assets
│   └── index.html               # Main HTML file
├── public/                      # Public assets
│   └── img/                     # Images and icons
├── angular.json                 # Angular configuration
├── package.json                 # Project dependencies
└── tsconfig.json                # TypeScript configuration
```

## Angular CLI Help

For more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Reference](https://angular.dev/tools/cli).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Privacy Policy

### Data Collection and Usage

CheckMyToothbot collects the following user data:
- User name (optional)
- Selected language
- Pain type and location
- Answers to diagnostic questions
- Generated diagnosis

This data is collected for the following purposes:
1. To provide personalized dental health recommendations
2. To improve the accuracy of the diagnostic algorithm
3. For statistical analysis to enhance the application's performance

### Data Storage

- All collected data is stored in Google Sheets through Google Apps Script
- Data is transmitted securely over HTTPS
- Personal identifiers (name) are optional and not required to use the application

### User Rights

Users have the right to:
- Choose not to provide their name
- Request deletion of their data by contacting the application administrator

### Data Security

We take appropriate security measures to protect your data:
- Limited access to the Google Sheets database
- Regular security reviews
- No sharing of individual user data with third parties

### Third-Party Services

This application uses:
- Google Apps Script for data processing
- Google Sheets for data storage
- Both services are subject to [Google's Privacy Policy](https://policies.google.com/privacy)

### Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify users of any changes by updating the new Privacy Policy on this page.

### Contact

If you have any questions about this Privacy Policy, please open an issue in the GitHub repository.
