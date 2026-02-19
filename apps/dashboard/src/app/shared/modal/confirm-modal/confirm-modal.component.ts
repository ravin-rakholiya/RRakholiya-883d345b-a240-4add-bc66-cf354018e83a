import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent {
  title = input('Confirm');
  message = input('Are you sure?');
  confirmLabel = input('Confirm');
  titleId = 'confirm-modal-title';

  confirm = output<void>();
  cancel = output<void>();
}
