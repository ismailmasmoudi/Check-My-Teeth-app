import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type Language = 'en' | 'fr' | 'de' | 'ar';

@Component({
  selector: 'app-info-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-menu.component.html',
  styleUrls: ['./info-menu.component.scss'],
})
export class InfoMenuComponent implements OnChanges {
  constructor(private elementRef: ElementRef) {}

  /**
   * Listens for clicks on the entire document.
   * If a click occurs outside of this component's element and the menu is open,
   * it closes the menu overlay.
   * @param event The mouse click event.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  @Input() language: Language = 'en';
  @Output() pageContentChanged = new EventEmitter<string | null>();
  isOpen = false;
  private _selectedPageKey: keyof typeof this.pages | null = null;

  /**
   * Helper function to get page keys for template iteration.
   * @returns Array of page keys that can be used in the template
   */
  get pageKeys() {
    return Object.keys(this.pages) as Array<keyof typeof this.pages>;
  }

  /**
   * Angular lifecycle hook that detects changes to @Input() properties.
   * We use it here to react when the language changes from the parent component.
   * @param changes An object containing the changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['language'] && this._selectedPageKey) {
      this.pageContentChanged.emit(this.selectedPageContent);
    }
  }

  /**
   * Toggles the menu open/close state.
   */
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Opens a specific page and closes the menu.
   * @param pageKey The key of the page to open
   */
  openPage(pageKey: string) {
    this._selectedPageKey = pageKey as keyof typeof this.pages;
    this.isOpen = false;
    this.pageContentChanged.emit(this.selectedPageContent);
  }

  /**
   * Clears the current selection.
   */
  clearSelection() {
    this._selectedPageKey = null;
  }

  /**
   * Gets the content for the currently selected page in the current language.
   * @returns The page content string or null if no page is selected
   */
  private get selectedPageContent(): string | null {
    if (!this._selectedPageKey) {
      return null;
    }
    return this.pages[this._selectedPageKey].content[this.language];
  }

  pages = {
    imprint: {
      title: {
        en: 'Imprint',
        fr: 'Mentions légales',
        de: 'Impressum',
        ar: 'بيانات الناشر',
      },
      content: {
        de: `<h2>Impressum</h2>
<p><strong>Angaben gemäß § 5 TMG:</strong><br>
Ismail Mohamed Masmoudi<br>
Moosburgerstr 10A<br>
80993 München<br>
Deutschland</p>
<p><strong>Kontakt:</strong><br>
E-Mail: contact@checkmytoothbot.com</p>
<h3>Haftungsausschluss</h3>
<p>Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Ich übernehme jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte...</p>
<h3>Haftung für Links</h3>
<p>Meine Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe...</p>
<h3>Urheberrecht</h3>
<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht...</p>
<h3>Haftung</h3>
<p>Wir haften nicht für Verluste oder Schäden, die sich aus der Nutzung dieser Website ergeben...</p>
<h3>Geltendes Recht</h3>
<p>Dieser rechtliche Hinweis unterliegt den Gesetzen Deutschlands...</p>
<h3>Änderungen</h3>
<p>Wir behalten uns das Recht vor, diesen rechtlichen Hinweis jederzeit zu ändern.</p>
<h3>Datenschutz</h3>
<p>Ausführliche Informationen entnehmen Sie bitte unserer Datenschutzerklärung.</p>`,

        en: `<h2>Imprint</h2>
<p><strong>According to § 5 TMG:</strong><br>
Ismail Mohamed Masmoudi<br>
Moosburgerstr 10A<br>
80993 Munich<br>
Germany</p>
<p><strong>Contact:</strong><br>
E-Mail: contact@checkmytoothbot.com</p>
<h3>Disclaimer</h3>
<p>The contents of this website have been created with the greatest care. However, we do not guarantee the accuracy, completeness or timeliness of the contents...</p>
<h3>Liability for Links</h3>
<p>This website contains links to third-party websites. We have no influence on their content...</p>
<h3>Copyright</h3>
<p>The contents and works created by the website operator are subject to German copyright law...</p>
<h3>Liability</h3>
<p>We shall not be liable for any damages arising from the use of this website...</p>
<h3>Governing Law</h3>
<p>This legal notice shall be governed by German law...</p>
<h3>Changes</h3>
<p>We reserve the right to change this legal notice at any time.</p>
<h3>Data Protection</h3>
<p>Please refer to our privacy policy for details.</p>`,

        fr: `<h2>Mentions légales</h2>
<p><strong>Conformément à l'article 5 de la loi TMG:</strong><br>
Ismail Mohamed Masmoudi<br>
Moosburgerstr 10A<br>
80993 Munich<br>
Allemagne</p>
<p><strong>Contact :</strong><br>
E-Mail : contact@checkmytoothbot.com</p>
<h3>Avertissement</h3>
<p>Le contenu de ce site a été préparé avec le plus grand soin. Toutefois, nous ne garantissons pas l'exactitude, l'exhaustivité ou l'actualité des informations...</p>
<h3>Responsabilité pour les liens</h3>
<p>Ce site contient des liens vers des sites Web de tiers sur lesquels nous n'avons aucun contrôle...</p>
<h3>Droit d'auteur</h3>
<p>Le contenu et les œuvres de ce site sont soumis au droit d'auteur allemand...</p>
<h3>Responsabilité</h3>
<p>Nous ne sommes pas responsables des pertes ou dommages résultant de l'utilisation de ce site Web...</p>
<h3>Droit applicable</h3>
<p>Les présentes mentions légales sont régies par le droit allemand...</p>
<h3>Modifications</h3>
<p>Nous nous réservons le droit de modifier ces mentions légales à tout moment.</p>
<h3>Protection des données</h3>
<p>Veuillez consulter notre politique de confidentialité.</p>`,

        ar: `<h2>بيانات الناشر</h2>
<p><strong>وفقًا للمادة § 5 من قانون TMG:</strong><br>
إسماعيل محمد مصمودي<br>
Moosburgerstr 10A<br>
80993 Munich<br>
ألمانيا</p>
<p><strong>جهة الاتصال:</strong><br>
البريد الإلكتروني: contact@checkmytoothbot.com</p>
<h3>إخلاء المسؤولية</h3>
<p>تم إعداد محتوى هذا الموقع بعناية فائقة. ومع ذلك، لا نضمن دقة أو اكتمال أو حداثة المحتوى...</p>
<h3>روابط خارجية</h3>
<p>يحتوي هذا الموقع على روابط لمواقع خارجية لا نتحكم في محتواها...</p>
<h3>حقوق النشر</h3>
<p>المحتوى والأعمال الموجودة في هذا الموقع تخضع لحقوق النشر الألمانية...</p>
<h3>المسؤولية</h3>
<p>نحن غير مسؤولين عن أي خسائر أو أضرار ناتجة عن استخدام هذا الموقع...</p>
<h3>القانون المعمول به</h3>
<p>يخضع هذا الإشعار القانوني لقوانين ألمانيا...</p>
<h3>التعديلات</h3>
<p>نحتفظ بالحق في تعديل هذا الإشعار القانوني في أي وقت.</p>
<h3>حماية البيانات</h3>
<p>يرجى الرجوع إلى سياسة الخصوصية الخاصة بنا لمزيد من التفاصيل.</p>`,
      },
    },
    privacy: {
      title: {
        en: 'Privacy Policy',
        fr: 'Politique de confidentialité',
        de: 'Datenschutz',
        ar: 'سياسة الخصوصية',
      },
      content: {
        en: `
<h2>Privacy Policy</h2>

<h3>1. Information about the collection of personal data</h3>
<p>
This privacy notice informs you about the collection of personal data when using our website or mobile application <strong>“CheckMyToothBot”</strong>. 
Personal data is any information that can be related to you personally (e.g., name, address, email address).
</p>
<p>
<b>Controller according to Art. 4(7) GDPR:</b><br>
Ismail Mohamed Masmoudi<br>
Moosburger Straße 10A<br>
80993 Munich, Germany<br>
Email: contact@checkmytoothbot.com
</p>
<p>
This app is non-commercial and serves purely informational purposes for dental self-assessment.
</p>

<h3>2. Your rights</h3>
<p>You have the following rights regarding your personal data:</p>
<ul>
  <li>Right of access (Art. 15 GDPR)</li>
  <li>Right to rectification (Art. 16 GDPR)</li>
  <li>Right to erasure (Art. 17 GDPR)</li>
  <li>Right to restriction of processing (Art. 18 GDPR)</li>
  <li>Right to object (Art. 21 GDPR)</li>
  <li>Right to data portability (Art. 20 GDPR)</li>
  <li>Right to lodge a complaint with a supervisory authority (Art. 77 GDPR)</li>
</ul>

<h3>3. Data collection when using the app</h3>
<p>
No personal data such as IP addresses or device data is collected when simply using the website.
</p>
<p>The app only stores voluntarily entered, non-verified information such as:</p>
<ul>
  <li>A freely chosen (anonymous) name</li>
  <li>Selected language</li>
  <li>Symptoms, tooth number, and user answers</li>
  <li>Automatically generated diagnosis and treatment suggestion</li>
</ul>
<p>
This data is stored anonymously in a Google Sheet. No connection to IP addresses, location data, or devices takes place. 
The app uses <strong>no cookies</strong>, <strong>no tracking</strong>, and <strong>no advertising</strong>.
</p>
<p>
<b>Legal basis:</b> Art. 6(1)(f) GDPR (legitimate interest in app improvement). Data is used exclusively for statistical purposes.
</p>

<h3>4. Contact by email</h3>
<p>
If you contact us by email, we store your message only to respond to your request. 
This data is not shared and will be deleted once no longer necessary.
</p>

<h3>5. Hosting</h3>
<p>
This website is hosted by:<br>
<b>ALL-INKL.COM  Neue Medien Münnich</b><br>
Hauptstraße 68, 02742 Friedersdorf, Germany
</p>
<p>
Privacy policy: 
<a href="https://all-inkl.com/datenschutzinformationen/" target="_blank" rel="noopener">https://all-inkl.com/datenschutzinformationen/</a>
</p>

<h3>6. Google Fonts (local hosting)</h3>
<p>
This app uses Google Fonts stored locally. No connection is made to Google servers.
</p>

<h3>7. Google Sheets (anonymous data storage)</h3>
<p>
Anonymous diagnosis data is stored in Google Sheets, provided by:<br>
<b>Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Ireland</b>
</p>
<p>
No personal identifiers are stored. The data is used only for statistical and improvement purposes.
</p>

<h3>8. Changes to this privacy policy</h3>
<p>
We reserve the right to update this privacy policy at any time. The current version is available in the app and on our website.
</p>
`,
        fr: `
<h2>Politique de confidentialité</h2>

<h3>1. Informations sur la collecte des données personnelles</h3>
<p>
Cette politique de confidentialité vous informe sur la collecte de données personnelles lors de l'utilisation de notre site web ou application mobile <strong>« CheckMyToothBot »</strong>. 
Les données personnelles sont toutes les informations pouvant être liées à votre personne (ex. : nom, adresse, adresse e-mail).
</p>
<p>
<b>Responsable selon l'article 4, paragraphe 7 du RGPD :</b><br>
Ismail Mohamed Masmoudi<br>
Moosburger Straße 10A<br>
80993 Munich, Allemagne<br>
E-mail : contact@checkmytoothbot.com
</p>
<p>
L'application est non commerciale et vise uniquement à fournir des informations sur les douleurs dentaires.
</p>

<h3>2. Vos droits</h3>
<p>Vous avez les droits suivants concernant vos données personnelles :</p>
<ul>
  <li>Droit d'accès (art. 15 RGPD)</li>
  <li>Droit de rectification (art. 16 RGPD)</li>
  <li>Droit à l'effacement (art. 17 RGPD)</li>
  <li>Droit à la limitation du traitement (art. 18 RGPD)</li>
  <li>Droit d'opposition (art. 21 RGPD)</li>
  <li>Droit à la portabilité des données (art. 20 RGPD)</li>
  <li>Droit d’introduire une réclamation auprès d’une autorité de contrôle (art. 77 RGPD)</li>
</ul>

<h3>3. Collecte de données lors de l'utilisation de l'application</h3>
<p>
Aucune donnée personnelle telle que l'adresse IP ou les informations sur l'appareil ne sont collectées lors d'une simple utilisation.
</p>
<p>L'application enregistre uniquement des informations saisies volontairement et non vérifiées telles que :</p>
<ul>
  <li>Un nom choisi librement (anonyme)</li>
  <li>Langue sélectionnée</li>
  <li>Symptômes, numéro de dent et réponses de l'utilisateur</li>
  <li>Diagnostic et traitement générés automatiquement</li>
</ul>
<p>
Ces données sont enregistrées de manière anonyme dans une feuille Google Sheets. 
Aucun lien n’est fait avec l’adresse IP, la géolocalisation ou l’appareil. 
Aucun cookie, traçage ou publicité n'est utilisé.
</p>
<p>
<b>Base juridique :</b> Article 6, paragraphe 1, point f) du RGPD (intérêt légitime à l'amélioration de l'application).
</p>

<h3>4. Contact par e-mail</h3>
<p>
Si vous nous contactez par e-mail, nous stockons votre message uniquement pour répondre à votre demande. 
Les données ne sont pas transmises à des tiers et seront supprimées dès qu'elles ne seront plus nécessaires.
</p>

<h3>5. Hébergement</h3>
<p>
Le site est hébergé par :<br>
<b>ALL-INKL.COM – Neue Medien Münnich</b><br>
Hauptstraße 68, 02742 Friedersdorf, Allemagne
</p>
<p>
Politique de confidentialité : 
<a href="https://all-inkl.com/datenschutzinformationen/" target="_blank" rel="noopener">https://all-inkl.com/datenschutzinformationen/</a>
</p>

<h3>6. Google Fonts (hébergement local)</h3>
<p>
Cette application utilise des polices Google hébergées localement. Aucune connexion avec les serveurs de Google n’a lieu.
</p>

<h3>7. Google Sheets (stockage anonyme)</h3>
<p>
Les données anonymes sont stockées dans Google Sheets, fourni par :<br>
<b>Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irlande</b>
</p>
<p>
Aucune donnée personnelle identifiable n'est collectée. Les données sont utilisées uniquement à des fins statistiques.
</p>

<h3>8. Modifications de cette politique</h3>
<p>
Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
La version actuelle est disponible dans l'application et sur notre site.
</p>
`,
        de: `
<h2>Datenschutz</h2>

<h3>1. Informationen zur Erhebung personenbezogener Daten</h3>
<p>
Im Folgenden informieren wir Sie über die Erhebung personenbezogener Daten bei Nutzung unserer Website bzw. mobilen Anwendung <strong>„CheckMyToothBot“</strong>. 
Personenbezogene Daten sind alle Daten, die auf Sie persönlich beziehbar sind (z. B. Name, Adresse, E-Mail-Adresse).
</p>
<p>
<b>Verantwortlich gemäß Art. 4 Abs. 7 DSGVO:</b><br>
Ismail Mohamed Masmoudi<br>
Moosburger Straße 10A<br>
80993 München, Deutschland<br>
E-Mail: contact@checkmytoothbot.com
</p>
<p>
Die App dient ausschließlich nicht-kommerziellen, privaten Zwecken zur Information über mögliche zahnmedizinische Beschwerden.
</p>

<h3>2. Ihre Rechte</h3>
<p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
<ul>
  <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
  <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
  <li>Recht auf Löschung (Art. 17 DSGVO)</li>
  <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
  <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
  <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
  <li>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
</ul>

<h3>3. Erhebung personenbezogener Daten bei Nutzung der App</h3>
<p>Beim bloßen Besuch der Website erfassen wir keine personenbezogenen Daten wie IP-Adresse oder Gerätedaten.</p>
<p>Die App speichert ausschließlich freiwillig eingegebene, nicht verifizierte Informationen wie:</p>
<ul>
  <li>Frei gewählter (anonymer) Name</li>
  <li>Gewählte Sprache</li>
  <li>Symptome, Zahnposition und Nutzerantworten</li>
  <li>Automatisch generierte Diagnose und Empfehlung</li>
</ul>
<p>
Diese Daten werden anonymisiert in einem Google Sheet gespeichert. Es erfolgt keine Verknüpfung mit IP-Adressen, Standortdaten oder Geräten. 
Die App verwendet <strong>keine Cookies</strong>, <strong>kein Tracking</strong> und <strong>keine Werbung</strong>.
</p>
<p>
<b>Rechtsgrundlage:</b> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an App-Optimierung). Die Daten werden ausschließlich zu statistischen Zwecken verwendet.
</p>

<h3>4. Kontaktaufnahme per E-Mail</h3>
<p>
Wenn Sie uns per E-Mail kontaktieren, speichern wir Ihre übermittelten Daten ausschließlich zur Bearbeitung Ihrer Anfrage. 
Diese Daten werden nicht an Dritte weitergegeben und nach Bearbeitung gelöscht.
</p>

<h3>5. Hosting</h3>
<p>
Unsere Website wird gehostet bei:<br>
<b>ALL-INKL.COM - Neue Medien Münnich</b><br>
Hauptstraße 68, 02742 Friedersdorf, Deutschland
</p>
<p>
Datenschutzerklärung des Anbieters: 
<a href="https://all-inkl.com/datenschutzinformationen/" target="_blank" rel="noopener">https://all-inkl.com/datenschutzinformationen/</a>
</p>
<p>
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Hosting). Ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO besteht.
</p>

<h3>6. Google Fonts (lokales Hosting)</h3>
<p>
Diese Website nutzt lokal gespeicherte Google Fonts zur einheitlichen Darstellung von Schriftarten. 
Dabei erfolgt keine Verbindung zu Google-Servern.
</p>
<p>
Weitere Informationen: 
<a href="https://developers.google.com/fonts/faq" target="_blank" rel="noopener">https://developers.google.com/fonts/faq</a>
</p>

<h3>7. Google Sheets (anonyme Datenspeicherung)</h3>
<p>
Die App speichert Ihre anonymen Diagnose-Daten in Google Sheets, bereitgestellt von:<br>
<b>Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland</b>
</p>
<p>
Es werden keine personenbezogenen Daten übermittelt. Die Daten werden ausschließlich für statistische Zwecke verwendet und nicht weitergegeben.
</p>

<h3>8. Änderungen dieser Datenschutzerklärung</h3>
<p>
Wir behalten uns das Recht vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. 
Die jeweils aktuelle Version finden Sie in der App oder auf unserer Website.
</p>`,
        ar: `
<h2 dir="rtl" style="text-align: right;">سياسة الخصوصية</h2>

<h3 dir="rtl" style="text-align: right;">1. معلومات حول جمع البيانات الشخصية</h3>
<p dir="rtl" style="text-align: right;">
تشرح لك هذه السياسة كيفية التعامل مع بياناتك عند استخدام تطبيق <strong>CheckMyToothBot</strong>. البيانات الشخصية هي كل ما يمكن ربطه بهويتك.
</p>
<p dir="rtl" style="text-align: right;">
<b>المسؤول حسب المادة 4 (7) من اللائحة العامة لحماية البيانات (GDPR):</b><br>
إسماعيل محمد مصمودي<br>
Moosburger Straße 10A<br>
80993 München, Deutschland<br>
البريد الإلكتروني: contact@checkmytoothbot.com
</p>

<h3 dir="rtl" style="text-align: right;">2. حقوقك</h3>
<p dir="rtl" style="text-align: right;">لديك الحقوق التالية بخصوص بياناتك:</p>
<ul dir="rtl" style="text-align: right;">
  <li>الحق في الوصول</li>
  <li>الحق في التصحيح</li>
  <li>الحق في الحذف</li>
  <li>الحق في تقييد المعالجة</li>
  <li>الحق في الاعتراض</li>
  <li>الحق في نقل البيانات</li>
  <li>الحق في تقديم شكوى لهيئة رقابية</li>
</ul>

<h3 dir="rtl" style="text-align: right;">3. البيانات المخزنة أثناء الاستخدام</h3>
<p dir="rtl" style="text-align: right;">
لا يتم جمع عناوين IP أو بيانات الجهاز عند الاستخدام العادي.
</p>
<p dir="rtl" style="text-align: right;">يتم تخزين فقط المعلومات التالية بشكل مجهول:</p>
<ul dir="rtl" style="text-align: right;">
  <li>اسم اختياري ومجهول</li>
  <li>اللغة المختارة</li>
  <li>الأعراض، رقم السن، إجابات المستخدم</li>
  <li>تشخيص واقتراح علاج تلقائي</li>
</ul>
<p dir="rtl" style="text-align: right;">
يتم حفظ هذه البيانات في Google Sheets بشكل مجهول. لا يتم استخدام ملفات تعريف الارتباط أو التتبع أو الإعلانات.
</p>

<h3 dir="rtl" style="text-align: right;">4. التواصل عبر البريد الإلكتروني</h3>
<p dir="rtl" style="text-align: right;">
نحفظ رسالتك فقط للرد على استفسارك ثم نحذفها. لا تتم مشاركة البيانات مع أي طرف ثالث.
</p>

<h3 dir="rtl" style="text-align: right;">5. الاستضافة</h3>
<p dir="rtl" style="text-align: right;">
يتم استضافة الموقع لدى:<br>
<b>ALL-INKL.COM  Neue Medien Münnich</b><br>
ألمانيا
</p>

<h3 dir="rtl" style="text-align: right;">6. خطوط Google (محلية)</h3>
<p dir="rtl" style="text-align: right;">
يتم استخدام خطوط Google المستضافة محليًا فقط دون اتصال بخوادم Google.
</p>

<h3 dir="rtl" style="text-align: right;">7. Google Sheets (تخزين مجهول)</h3>
<p dir="rtl" style="text-align: right;">
يتم تخزين البيانات بشكل مجهول في Google Sheets فقط لأغراض التحليل الإحصائي.
</p>

<h3 dir="rtl" style="text-align: right;">8. تغييرات سياسة الخصوصية</h3>
<p dir="rtl" style="text-align: right;">
نحتفظ بحق تعديل سياسة الخصوصية في أي وقت. النسخة المحدثة متوفرة داخل التطبيق.
</p>
`,
      },
    },
    disclaimer: {
      title: {
        en: 'Disclaimer',
        fr: 'Avertissement',
        de: 'Haftungsausschluss',
        ar: 'إخلاء المسؤولية',
      },
      content: {
        de: `<h2>Haftungsausschluss</h2>
<p>Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Ich übernehme jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte.</p>
<p>Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
<p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.</p>
<p>Meine Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend entfernen.</p>
<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet.</p>
<p>Wir haften nicht für Verluste oder Schäden, die sich aus oder im Zusammenhang mit der Nutzung dieser Website ergeben, einschließlich, aber nicht beschränkt auf direkte, indirekte, zufällige, Folgeschäden oder Strafschadenersatz.</p>
<p>Dieser rechtliche Hinweis und Ihre Nutzung dieser Website unterliegen den Gesetzen Deutschlands und werden in Übereinstimmung mit diesen ausgelegt. Alle Streitigkeiten im Zusammenhang mit diesen Geschäftsbedingungen unterliegen der ausschließlichen Zuständigkeit der Gerichte Deutschlands.</p>
<p>Wir behalten uns das Recht vor, diesen rechtlichen Hinweis jederzeit zu ändern. Die aktuelle Version ist immer auf dieser Seite abrufbar.</p>`,
        en: `<h2>Disclaimer</h2>
<p>The contents of this website have been created with the greatest possible care. However, I do not guarantee the accuracy, completeness, or timeliness of the provided information.</p>
<p>As a service provider, I am responsible for my own content on these pages in accordance with general laws (§ 7 (1) TMG). However, according to §§ 8 to 10 TMG, I am not obligated to monitor transmitted or stored third-party information or to investigate circumstances indicating illegal activity.</p>
<p>Obligations to remove or block the use of information under general laws remain unaffected. Liability in this regard is only possible from the time of knowledge of a specific legal violation. Upon notification of such violations, I will remove the content immediately.</p>
<p>My website contains links to external third-party websites over which I have no control. Therefore, I cannot assume any liability for these external contents. The respective provider or operator of the linked sites is always responsible for their content.</p>
<p>The linked sites were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. A permanent content control of the linked sites is not reasonable without concrete evidence of a legal violation. If I become aware of any infringements, such links will be removed immediately.</p>
<p>The content and works created by the site operator on these pages are subject to German copyright law. Downloads and copies of this site are only permitted for private, non-commercial use. As far as the content on this site was not created by the operator, the copyrights of third parties are respected.</p>
<p>We are not liable for any losses or damages arising from or related to the use of this website, including but not limited to direct, indirect, incidental, consequential, or punitive damages.</p>
<p>This legal notice and your use of this website are governed by the laws of Germany. All disputes related to these terms are subject to the exclusive jurisdiction of the courts of Germany.</p>
<p>We reserve the right to change this legal notice at any time. The current version is always available on this page.</p>`,
        fr: `<h2>Avertissement</h2>
<p>Le contenu de ce site web a été créé avec le plus grand soin. Cependant, je ne garantis pas l'exactitude, l'exhaustivité ou l'actualité des informations fournies.</p>
<p>En tant que fournisseur de services, je suis responsable de mes propres contenus sur ces pages conformément aux lois générales (§ 7 (1) TMG). Toutefois, selon les §§ 8 à 10 TMG, je ne suis pas obligé de surveiller les informations de tiers transmises ou stockées ou de rechercher des circonstances indiquant une activité illégale.</p>
<p>Les obligations de suppression ou de blocage de l'utilisation des informations conformément aux lois générales restent inchangées. Une responsabilité à cet égard n'est possible qu'à partir du moment où une violation concrète de la loi est connue. Dès la connaissance de telles violations, je supprimerai immédiatement les contenus concernés.</p>
<p>Mon site web contient des liens vers des sites web externes de tiers sur lesquels je n'ai aucun contrôle. Par conséquent, je ne peux assumer aucune responsabilité pour ces contenus externes. Le fournisseur ou l'exploitant respectif des sites liés est toujours responsable de leur contenu.</p>
<p>Les contenus créés par l'opérateur du site sur ces pages sont soumis au droit d'auteur allemand. Les téléchargements et copies de ce site ne sont autorisés que pour un usage privé et non commercial. Dans la mesure où le contenu de ce site n'a pas été créé par l'opérateur, les droits d'auteur des tiers sont respectés.</p>
<p>Nous ne sommes pas responsables des pertes ou dommages résultant de ou liés à l'utilisation de ce site web, y compris, mais sans s'y limiter, les dommages directs, indirects, accessoires, consécutifs ou punitifs.</p>
<p>Le présent avis juridique et votre utilisation de ce site web sont régis par le droit allemand. Tous les litiges liés à ces conditions sont soumis à la compétence exclusive des tribunaux allemands.</p>
<p>Nous nous réservons le droit de modifier cet avis juridique à tout moment. La version actuelle est toujours disponible sur cette page.</p>`,
        ar: `<h2>إخلاء المسؤولية</h2>
<p>تم إعداد محتوى هذا الموقع بأقصى درجات العناية. ومع ذلك، لا أتحمل أي مسؤولية عن دقة أو اكتمال أو حداثة المعلومات المقدمة.</p>
<p>بصفتي مقدم خدمة، فأنا مسؤول عن المحتوى الخاص بي في هذه الصفحات وفقًا للقوانين العامة (§ 7 (1) TMG). ومع ذلك، وفقًا للمواد §§ 8 إلى 10 من قانون TMG، لست ملزمًا بمراقبة المعلومات من أطراف ثالثة التي يتم إرسالها أو تخزينها أو بالتحقيق في الظروف التي تشير إلى نشاط غير قانوني.</p>
<p>تظل الالتزامات بإزالة أو حظر استخدام المعلومات وفقًا للقوانين العامة غير متأثرة. لا تنشأ المسؤولية في هذا الصدد إلا من وقت معرفة انتهاك قانوني محدد. عند الإبلاغ عن مثل هذه الانتهاكات، سأقوم بإزالة المحتوى على الفور.</p>
<p>يحتوي موقعي الإلكتروني على روابط لمواقع خارجية لا أملك أي سيطرة على محتواها. لذلك، لا يمكنني تحمل أي مسؤولية عن هذه المحتويات الخارجية. يكون مقدم الخدمة أو مشغل الموقع المرتبط هو المسؤول دائمًا عن محتواه.</p>
<p>المحتوى والأعمال التي أنشأها مشغل الموقع على هذه الصفحات تخضع لقانون حقوق النشر الألماني. يُسمح بتنزيلات ونسخ من هذا الموقع للاستخدام الشخصي وغير التجاري فقط. إذا لم يتم إنشاء المحتوى على هذا الموقع من قبل المشغل، يتم احترام حقوق النشر الخاصة بالأطراف الثالثة.</p>
<p>نحن لا نتحمل أي مسؤولية عن أي خسائر أو أضرار ناتجة عن أو مرتبطة باستخدام هذا الموقع، بما في ذلك، على سبيل المثال لا الحصر، الأضرار المباشرة أو غير المباشرة أو العرضية أو التبعية أو العقابية.</p>
<p>يخضع هذا الإشعار القانوني واستخدامك لهذا الموقع لقوانين جمهورية ألمانيا، ويتم تفسيره وفقًا لها. تخضع جميع النزاعات المتعلقة بهذه الشروط للاختصاص القضائي الحصري للمحاكم الألمانية.</p>
<p>نحتفظ بالحق في تعديل هذا الإشعار القانوني في أي وقت. النسخة الحالية متاحة دائمًا على هذه الصفحة.</p>`,
      },
    },
    about: {
      title: {
        en: 'About the App',
        fr: "À propos de l'application",
        de: 'Über die App',
        ar: 'عن التطبيق',
      },
      content: {
        de: `<h2>Über die App</h2>
<p>Willkommen bei <strong>CheckMyToothBot</strong>  Ihrer innovativen digitalen Hilfe für zahnmedizinische Beschwerden!</p>
<p>Diese App wurde mit viel Sorgfalt von einem erfahrenen Zahnarzt entwickelt, um Ihnen einen einfachen und schnellen Zugang zu ersten Einschätzungen Ihrer Zahnsymptome zu ermöglichen  ganz ohne Termin oder Wartezeit.</p>
<p>Durch eine intuitive Benutzeroberfläche, ein interaktives Zahnschema und gezielte Fragen analysiert die App Ihre Angaben und liefert Ihnen eine mögliche Diagnose sowie empfohlene Maßnahmen  stets mit dem Hinweis, dass ein Zahnarztbesuch unerlässlich bleibt.</p>
<p><strong>Warum diese App?</strong><br>Weil gute Zahngesundheit bei der Aufklärung beginnt! Die App soll Orientierung bieten, Ängste abbauen und Patienten helfen, informierte Entscheidungen zu treffen.</p>
<p>CheckMyToothBot ist komplett kostenlos.</p>
<p>Diese App ist kein Ersatz für eine zahnärztliche Behandlung  aber ein erster, sicherer Schritt auf dem Weg zur richtigen Diagnose.</p>`,

        en: `<h2>About the App</h2>
<p>Welcome to <strong>CheckMyToothBot</strong>  your innovative digital companion for dental symptom assessment!</p>
<p>This app was carefully developed by a dentist to help users better understand their dental problems quickly and conveniently anytime, anywhere.</p>
<p>Using an interactive tooth chart and targeted questions, the app guides you through your symptoms and provides a possible diagnosis with treatment suggestions  always reminding you to consult a dentist for confirmation.</p>
<p><strong>Why use this app?</strong><br>Because informed patients make better decisions! CheckMyToothBot empowers you with helpful insights and reassurance, especially in uncertain moments.</p>
<p>It is completely free, privacy-friendly.</p>
<p>This tool is not a substitute for professional dental care, but a valuable first step toward it.</p>`,

        fr: `<h2>À propos de l'application</h2>
<p>Bienvenue sur <strong>CheckMyToothBot</strong>  votre assistant numérique innovant pour comprendre vos symptômes dentaires !</p>
<p>Développée par un dentiste, cette application vous aide à analyser vos douleurs dentaires de manière simple et rapide, sans rendez-vous.</p>
<p>Grâce à un schéma dentaire interactif et des questions ciblées, l'application vous fournit une première évaluation et des recommandations  tout en rappelant qu'une consultation chez le dentiste reste essentielle.</p>
<p><strong>Pourquoi cette application ?</strong><br>Parce que mieux comprendre, c’est mieux décider. CheckMyToothBot vous guide avec des informations utiles, sans stress ni publicité.</p>
<p>L'application est gratuite, respecte votre vie privée .</p>
<p>Ce service ne remplace pas une consultation médicale, mais constitue un premier pas rassurant vers un bon diagnostic.</p>`,

        ar: `<h2>عن التطبيق</h2>
<p>مرحبًا بك في <strong>CheckMyToothBot</strong> مساعدك الرقمي المبتكر لفهم مشكلات الأسنان!</p>
<p>تم تطوير هذا التطبيق بعناية من قبل طبيب أسنان لمساعدتك في تحليل أعراضك بسرعة وسهولة في أي وقت ومن أي مكان.</p>
<p>من خلال رسم تخطيطي تفاعلي للفم وأسئلة دقيقة، يساعدك التطبيق على فهم حالتك واقتراح تشخيص محتمل مع توصيات  مع التذكير دائمًا بأهمية زيارة طبيب الأسنان.</p>
<p><strong>لماذا هذا التطبيق؟</strong><br>لأن المعرفة الجيدة تقود إلى قرارات صحية أفضل. هذا التطبيق يمنحك الثقة والوضوح في لحظات القلق.</p>
<p>التطبيق مجاني بالكامل .</p>
<p>التطبيق ليس بديلاً عن زيارة الطبيب، بل خطوة أولى مفيدة على الطريق الصحيح.</p>`,
      },
    },
  };
}
