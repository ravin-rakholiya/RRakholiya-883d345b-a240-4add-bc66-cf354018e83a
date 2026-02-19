import { Injectable, signal, computed } from '@angular/core';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly itemsSignal = signal<ToastItem[]>([]);
  private nextId = 0;
  readonly items = this.itemsSignal.asReadonly();
  readonly hasToasts = computed(() => this.itemsSignal().length > 0);

  show(message: string, type: ToastItem['type'] = 'info'): void {
    const id = ++this.nextId;
    this.itemsSignal.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }

  dismiss(id: number): void {
    this.itemsSignal.update((list) => list.filter((t) => t.id !== id));
  }
}
