# CheckMyToothBot - Dental Pain Self-Diagnosis Application

CheckMyToothBot is a modern Angular-based web application that helps users identify potential causes of dental problems and provides appropriate treatment recommendations through an interactive diagnostic process.

![CheckMyToothBot Logo](/img/logo.png)

## 🚀 Features

- **Interactive Dental Chart** - Visual tooth selection with precise numbering
- **Multi-Category Diagnosis** - Tooth pain, gum issues, and TMJ disorders
- **Smart Questionnaire** - Guided questions for accurate diagnosis
- **Multilingual Support** - English, German, French, and Arabic
- **Professional Results** - Evidence-based diagnosis with treatment recommendations
- **Data Analytics** - Anonymous data collection for continuous improvement
- **Responsive Design** - Optimized for mobile and desktop devices
- **Privacy-Focused** - No tracking, cookies, or advertising

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- npm (comes with Node.js)
- Angular CLI: `npm install -g @angular/cli`

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ismailmasmoudi/Check-My-Teeth-app.git
   cd DentApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

4. **Open in browser**
   Navigate to `http://localhost:4200`

## 🔧 Google Sheets Integration

The app stores anonymous diagnostic data for analysis and improvement.

### Setup Steps:

1. **Create Google Sheet**
   - Create a new Google Sheet
   - Note the Spreadsheet ID from the URL

2. **Setup Apps Script**
   - Go to `Extensions > Apps Script`
   - Replace default code with:

```javascript
function doPost(e) {
  try {
    console.log('POST request received');
    
    if (!e?.parameter?.data) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false, message: 'No data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = JSON.parse(e.parameter.data);
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your ID
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName('Data') || spreadsheet.insertSheet('Data');
    
    const nextRow = sheet.getLastRow() + 1;
    
    // Create headers if needed
    if (nextRow === 1) {
      const headers = [
        'Timestamp', 'Name', 'Language', 'Pain Type', 'Tooth Number',
        'Symptoms', 'Diagnosis Title', 'Diagnosis Explanation', 'Treatment'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      nextRow = 2;
    }
    
    // Add data row
    const newRow = [
      data.timestamp || new Date().toISOString(),
      data.name || 'Anonymous',
      data.language || 'en',
      data.painType || 'Not specified',
      data.toothNumber || 'N/A',
      data.symptoms || 'None',
      data.diagnosisTitle || 'None',
      data.diagnosisExplanation || 'None',
      data.diagnosisTreatment || 'None'
    ];
    
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true, message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    console.error('Error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false, message: 'Error: ' + error
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy Script**
   - Save and deploy as Web App
   - Set execution to "Me" and access to "Anyone"
   - Copy the generated Web App URL

4. **Update Service**
   - Replace `scriptUrl` in `src/app/services/data-logger.service.ts` with your URL

## 🎨 Customization

### Diagnoses
Edit `src/app/data/diagnoses.json` to modify or add new diagnoses:

```json
{
  "title": {
    "en": "Tooth Cavity",
    "de": "Zahnkaries",
    "fr": "Carie dentaire",
    "ar": "تسوس الأسنان"
  },
  "explanation": {
    "en": "Bacterial damage to tooth structure...",
    // ... other languages
  }
}
```

### Questions
Modify diagnostic questions in:
- `src/app/data/questions-tooth.json`
- `src/app/data/questions-gum.json`
- `src/app/data/questions-tmj.json`

### Translations
Update translations in `src/app/data/translations.json`

## 📁 Project Structure

```
DentApp/
├── src/
│   ├── app/
│   │   ├── components/              # UI Components
│   │   │   ├── diagnosis-result/    # Result display
│   │   │   ├── info-menu/          # Info/legal pages
│   │   │   ├── language-selector/   # Language switcher
│   │   │   ├── question-flow/       # Diagnostic questions
│   │   │   ├── tooth-selector/      # Interactive tooth chart
│   │   │   └── tooth-status-flow/   # Main diagnostic flow
│   │   ├── data/                    # JSON data files
│   │   │   ├── diagnoses.json       # All diagnoses
│   │   │   ├── translations.json    # UI translations
│   │   │   ├── questions-*.json     # Diagnostic questions
│   │   │   └── pain-types.json      # Pain categories
│   │   ├── services/                # Business logic
│   │   │   ├── data-logger.service.ts    # Google Sheets integration
│   │   │   ├── diagnosis.service.ts      # Diagnosis logic
│   │   │   └── question-flow.service.ts  # Question handling
│   │   ├── app.component.*          # Main app component
│   │   └── app.config.ts           # App configuration
│   ├── assets/                      # Static files
│   └── styles.scss                  # Global styles
├── public/
│   └── img/                         # Images and logos
├── angular.json                     # Angular config
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🛠️ Development

### Build for Production
```bash
ng build --prod
```

### Run Tests
```bash
ng test
```

### Code Quality
```bash
ng lint
```

## 🌐 Deployment

The app can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `ng deploy --base-href=/repo-name/`
- **Firebase Hosting**: `ng add @angular/fire` then `ng deploy`

## 🔒 Privacy & Security

### Data Collection
- **Minimal Data**: Only diagnostic-relevant information
- **Anonymous**: Names are optional and not required
- **Secure**: HTTPS encryption for all data transmission
- **No Tracking**: No cookies, analytics, or advertising

### User Rights
- ✅ Anonymous usage
- ✅ Data deletion requests
- ✅ Transparent data usage
- ✅ GDPR compliant

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

- 📧 **Email**: contact@checkmytoothbot.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/ismailmasmoudi/Check-My-Teeth-app/issues)
- 📖 **Documentation**: This README

## ⚠️ Medical Disclaimer

**Important**: This application is for informational purposes only and does not replace professional dental care. Always consult a qualified dentist for proper diagnosis and treatment.

---

**CheckMyToothBot** - Making dental health information accessible to everyone 🦷✨
