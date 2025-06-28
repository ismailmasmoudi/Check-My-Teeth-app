import { Component, Input } from '@angular/core';
import { Diagnosis } from '../../services/diagnosis.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-diagnosis-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagnosis-result.component.html',
  styleUrl: './diagnosis-result.component.scss'
})
export class DiagnosisResultComponent {
  @Input() diagnosis!: Diagnosis;
  @Input() language: 'en' | 'fr' | 'ar' | 'de' = 'en';
}
