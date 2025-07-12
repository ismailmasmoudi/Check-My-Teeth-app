import {
  Component,
  EventEmitter,
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
  @Input() language: Language = 'en';
  @Output() pageContentChanged = new EventEmitter<string | null>();
  isOpen = false;
  private _selectedPageKey: keyof typeof this.pages | null = null;

  // Helper to get keys for the template to iterate over
  get pageKeys() {
    return Object.keys(this.pages) as Array<keyof typeof this.pages>;
  }

  /**
   * Angular lifecycle hook that detects changes to @Input() properties.
   * We use it here to react when the language changes from the parent component.
   * @param changes An object containing the changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Check if the 'language' input has changed and if a page is currently selected.
    if (changes['language'] && this._selectedPageKey) {
      // If so, re-emit the content for the currently selected page in the new language.
      this.pageContentChanged.emit(this.selectedPageContent);
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    // Wenn das Menü geschlossen wird, ohne eine Auswahl zu treffen, wird der Inhalt geleert.
    if (!this.isOpen) {
      this.clearPage();
    }
  }

  openPage(pageKey: string) {
    this._selectedPageKey = pageKey as keyof typeof this.pages;
    this.isOpen = false; // Close the menu after selecting a page
    this.pageContentChanged.emit(this.selectedPageContent);
  }

  private clearPage() {
    this._selectedPageKey = null;
    this.pageContentChanged.emit(null);
  }

  // --- Multilingual Texts ---
  pages = {
    imprint: {
      title: {
        en: 'Imprint',
        fr: 'Mentions légales',
        de: 'Impressum',
        ar: 'بيانات الناشر',
      },
      content: {
        en: `<h2>Imprint</h2><p>Information according to § 5 TMG:</p><p>Ismail Masmoudi<br>Dentist<br>Private person - non-commercial project<br>Moosburger Straße 10A<br>80993 Munich<br>Germany</p><p>Email: contact@checkmytoothbot.com</p><p>Responsible for content according to § 55 para. 2 RStV:<br>Ismail Masmoudi</p><p>This project is a non-commercial, private initiative for health education and does not constitute a dental service.</p>`,
        fr: `<h2>Mentions légales</h2><p>Informations conformément au § 5 TMG :</p><p>Ismail Masmoudi<br>Chirurgien-dentiste<br>Particulier - projet non commercial<br>Moosburger Straße 10A<br>80993 Munich<br>Allemagne</p><p>Email: contact@checkmytoothbot.com</p><p>Responsable du contenu selon § 55 alinéa 2 RStV :<br>Ismail Masmoudi</p><p>Ce projet est une initiative privée et non commerciale à des fins d'éducation à la santé et ne constitue pas un service dentaire.</p>`,
        de: `<h2>Impressum</h2><p>Angaben gemäß § 5 TMG:</p><p>Ismail Masmoudi<br><br>Privatperson – keine gewerbliche Tätigkeit<br>Moosburger Straße 10A<br>80993 München<br>Deutschland</p><p>E-Mail: contact@checkmytoothbot.com</p><p>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br>Ismail Masmoudi</p><p>Dieses Projekt ist eine nicht-kommerzielle, private Initiative zur gesundheitlichen Aufklärung und stellt keine zahnärztliche Dienstleistung dar.</p>`,
        ar: `<h2>بيانات الناشر</h2><p>معلومات وفقًا للمادة 5 من قانون خدمات الإعلام عن بعد (TMG):</p><p>إسماعيل مصمودي<br>طبيب أسنان <br>شخص خاص - مشروع غير تجاري<br>Moosburger Straße 10A<br>80993 ميونيخ<br>ألمانيا</p><p>البريد الإلكتروني: contact@checkmytoothbot.com</p><p>المسؤول عن المحتوى وفقًا للمادة 55 الفقرة 2 من اتفاقية الدولة الإطارية للبث (RStV):<br>إسماعيل مصمودي</p><p>هذا المشروع هو مبادرة خاصة وغير تجارية للتثقيف الصحي ولا يشكل خدمة طب أسنان.</p>`,
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
        en: `<h2>Privacy Policy</h2><p>This app was developed with the protection of your data as a top priority. No personal data is stored on external servers or shared with third parties.</p><p><strong>Data Storage:</strong> The name you enter is stored exclusively locally on your device in the browser's storage (localStorage). This is done to provide you with a personal greeting on your return visit. This data does not leave your device. You can delete this data at any time by using the "Start Over" button or by clearing your browser's cache.</p><p><strong>No Data Collection:</strong> Apart from the locally stored name, no other data about you or your use of the app is collected, processed, or stored. There are no cookies, no tracking, and no analytics tools.</p><p>If you have any questions about data protection, you can contact me via the email address provided in the imprint.</p>`,
        fr: `<h2>Politique de confidentialité</h2><p>Cette application a été développée avec la protection de vos données comme priorité absolue. Aucune donnée personnelle n'est stockée sur des serveurs externes ni partagée avec des tiers.</p><p><strong>Stockage des données :</strong> Le nom que vous saisissez est stocké exclusivement localement sur votre appareil dans le stockage du navigateur (localStorage). Cela permet de vous offrir un accueil personnalisé lors de votre prochaine visite. Ces données ne quittent pas votre appareil. Vous pouvez supprimer ces données à tout moment en utilisant le bouton "Recommencer" ou en vidant le cache de votre navigateur.</p><p><strong>Aucune collecte de données :</strong> Hormis le nom stocké localement, aucune autre donnée vous concernant ou concernant votre utilisation de l'application n'est collectée, traitée ou stockée. Il n'y a pas de cookies, pas de suivi et pas d'outils d'analyse.</p><p>Pour toute question sur la protection des données, vous pouvez me contacter via l'adresse e-mail indiquée dans les mentions légales.</p>`,
        de: `<h2>Datenschutz</h2><p>Diese App wurde mit dem Schutz Ihrer Daten als oberste Priorität entwickelt. Es werden keine persönlichen Daten auf externen Servern gespeichert oder an Dritte weitergegeben.</p><p><strong>Datenspeicherung:</strong> Der von Ihnen eingegebene Name wird ausschließlich lokal auf Ihrem Gerät im Browser-Speicher (localStorage) gespeichert. Dies dient dazu, Ihnen bei einem erneuten Besuch eine persönliche Begrüßung zu ermöglichen. Diese Daten verlassen Ihr Gerät nicht. Sie können diese Daten jederzeit löschen, indem Sie den "Von vorne beginnen"-Button nutzen oder den Cache Ihres Browsers leeren.</p><p><strong>Keine Datenerhebung:</strong> Abgesehen von dem lokal gespeicherten Namen werden keine weiteren Daten über Sie oder Ihre Nutzung der App erhoben, verarbeitet oder gespeichert. Es gibt keine Cookies, kein Tracking und keine Analyse-Tools.</p><p>Bei Fragen zum Datenschutz können Sie sich über die im Impressum genannte E-Mail-Adresse an mich wenden.</p>`,
        ar: `<h2>سياسة الخصوصية</h2><p>تم تطوير هذا التطبيق مع وضع حماية بياناتك كأولوية قصوى. لا يتم تخزين أي بيانات شخصية على خوادم خارجية أو مشاركتها مع أطراف ثالثة.</p><p><strong>تخزين البيانات:</strong> يتم تخزين الاسم الذي تدخله محليًا فقط على جهازك في مساحة تخزين المتصفح (localStorage). يتم ذلك لتوفير تحية شخصية لك عند عودتك. هذه البيانات لا تغادر جهازك. يمكنك حذف هذه البيانات في أي وقت باستخدام زر "البدء من جديد" أو عن طريق مسح ذاكرة التخزين المؤقت للمتصفح.</p><p><strong>لا يوجد جمع للبيانات:</strong> بصرف النظر عن الاسم المخزن محليًا، لا يتم جمع أو معالجة أو تخزين أي بيانات أخرى عنك أو عن استخدامك للتطبيق. لا توجد ملفات تعريف ارتباط (cookies) ولا تتبع ولا أدوات تحليل.</p><p>إذا كان لديك أي أسئلة حول حماية البيانات، يمكنك الاتصال بي عبر عنوان البريد الإلكتروني المذكور في بيانات الناشر.</p>`,
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
        en: `<h2>Disclaimer / Medical Notice</h2><p>This app is for informational and educational purposes only. The information provided and the diagnosis generated are not intended to be a substitute for professional dental advice, diagnosis, or treatment.</p><p>Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this app.</p><p>The diagnosis is based on a simplified question-and-answer system and cannot replace a clinical examination. The developer assumes no liability for any decisions made based on the information provided herein.</p>`,
        fr: `<h2>Avertissement / Avis médical</h2><p>Cette application est uniquement à des fins d'information et d'éducation. Les informations fournies et le diagnostic généré ne sont pas destinés à remplacer un conseil, un diagnostic ou un traitement dentaire professionnel.</p><p>Demandez toujours l'avis de votre dentiste ou d'un autre professionnel de la santé qualifié pour toute question que vous pourriez avoir concernant une condition médicale. Ne négligez jamais un avis médical professionnel ou ne tardez pas à le demander à cause de quelque chose que vous avez lu dans cette application.</p><p>Le diagnostic est basé sur un système de questions-réponses simplifié et ne peut remplacer un examen clinique. Le développeur n'assume aucune responsabilité pour les décisions prises sur la base des informations fournies ici.</p>`,
        de: `<h2>Haftungsausschluss / Medizinischer Hinweis</h2><p>Diese App dient ausschließlich zu Informations- und Bildungszwecken. Die bereitgestellten Informationen und die generierte Diagnose sind nicht als Ersatz für eine professionelle zahnärztliche Beratung, Diagnose oder Behandlung gedacht.</p><p>Suchen Sie bei Fragen zu einer Erkrankung immer den Rat Ihres Zahnarztes oder eines anderen qualifizierten Gesundheitsdienstleisters auf. Ignorieren Sie niemals professionellen medizinischen Rat oder zögern Sie, ihn einzuholen, weil Sie etwas in dieser App gelesen haben.</p><p>Die Diagnose basiert auf einem vereinfachten Frage-Antwort-System und kann keine klinische Untersuchung ersetzen. Der Entwickler übernimmt keine Haftung für Entscheidungen, die auf der Grundlage der hier bereitgestellten Informationen getroffen werden.</p>`,
        ar: `<h2>إخلاء المسؤولية / إشعار طبي</h2><p>هذا التطبيق مخصص للأغراض الإعلامية والتعليمية فقط. المعلومات المقدمة والتشخيص الذي يتم إنشاؤه ليس بديلاً عن الاستشارة الطبية المتخصصة أو التشخيص أو العلاج من قبل طبيب الأسنان.</p><p>اطلب دائمًا مشورة طبيب أسنانك أو أي مقدم رعاية صحية مؤهل آخر بشأن أي أسئلة قد تكون لديك حول حالة طبية. لا تتجاهل أبدًا المشورة الطبية المتخصصة أو تتأخر في طلبها بسبب شيء قرأته في هذا التطبيق.</p><p>يعتمد التشخيص على نظام مبسط للأسئلة والأجوبة ولا يمكن أن يحل محل الفحص السريري. لا يتحمل المطور أي مسؤولية عن أي قرارات يتم اتخاذها بناءً على المعلومات المقدمة هنا.</p>`,
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
        en: `<h2>About CheckMyToothBot</h2><p>CheckMyToothBot is a private, non-commercial project designed to give users an initial orientation for dental pain. It uses a guided dialogue to narrow down possible causes and provide a preliminary diagnosis.</p><p><strong>Important Note:</strong> This app does not replace a visit to the dentist. It is for educational purposes only and is intended to help better assess the urgency of a dental visit.</p><p>Developed by Ismail Masmoudi out of personal motivation to make dental knowledge more accessible.</p>`,
        fr: `<h2>À propos de CheckMyToothBot</h2><p>CheckMyToothBot est un projet privé et non commercial conçu pour donner aux utilisateurs une première orientation en cas de douleur dentaire. Il utilise un dialogue guidé pour cerner les causes possibles et fournir un diagnostic préliminaire.</p><p><strong>Remarque importante :</strong> Cette application ne remplace pas une visite chez le dentiste. Elle est uniquement à des fins éducatives et vise à aider à mieux évaluer l'urgence d'une consultation dentaire.</p><p>Développé par Ismail Masmoudi par motivation personnelle pour rendre les connaissances dentaires plus accessibles.</p>`,
        de: `<h2>Über CheckMyToothBot</h2><p>CheckMyToothBot ist ein privates, nicht-kommerzielles Projekt, das entwickelt wurde, um Nutzern eine erste Orientierung bei Zahnschmerzen zu geben. Es nutzt einen geführten Dialog, um mögliche Ursachen einzugrenzen und eine vorläufige Diagnose zu stellen.</p><p><strong>Wichtiger Hinweis:</strong> Diese App ersetzt keinen Besuch beim Zahnarzt. Sie dient lediglich der Aufklärung und soll helfen, die Dringlichkeit eines Zahnarztbesuches besser einzuschätzen.</p><p>Entwickelt von Ismail Masmoudi aus persönlicher Motivation, zahnmedizinisches Wissen zugänglicher zu machen.</p>`,
        ar: `<h2>حول CheckMyToothBot</h2><p>CheckMyToothBot هو مشروع خاص وغير تجاري تم تصميمه لمنح المستخدمين توجيهًا أوليًا لألم الأسنان. يستخدم حوارًا موجهًا لتضييق نطاق الأسباب المحتملة وتقديم تشخيص أولي.</p><p><strong>ملاحظة هامة:</strong> هذا التطبيق لا يحل محل زيارة طبيب الأسنان. إنه للأغراض التعليمية فقط ويهدف إلى المساعدة في تقييم مدى إلحاح زيارة طبيب الأسنان بشكل أفضل.</p><p>تم تطويره بواسطة إسماعيل مصمودي بدافع شخصي لجعل المعرفة بطب الأسنان في متناول الجميع.</p>`,
      },
    },
  };

  private get selectedPageContent(): string | null {
    if (!this._selectedPageKey) {
      return null;
    }
    return this.pages[this._selectedPageKey].content[this.language];
  }
}
