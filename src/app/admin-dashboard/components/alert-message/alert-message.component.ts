import { Component, input, output, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
    selector: 'alert-message',
    standalone: true,
    templateUrl: './alert-message.component.html',
})
export class AlertMessageComponent {
    // Inputs
    message = input.required<string>();
    type = input<AlertType>('info');
    show = input<boolean>(false);
    dismissible = input<boolean>(true);
    autoHide = input<boolean>(true);
    duration = input<number>(5000);

    // Outputs
    onClose = output<void>();

    constructor() {
        // Auto-hide functionality
        this.startAutoHideTimer();
    }

    private startAutoHideTimer() {
        // Usar effect para reaccionar a cambios en show y autoHide
        if (this.show() && this.autoHide()) {
            setTimeout(() => {
                this.close();
            }, this.duration());
        }
    }

    close() {
        this.onClose.emit();
    }

    getAlertClass(): string {
        const baseClass = 'alert';
        switch (this.type()) {
            case 'success':
                return `${baseClass} alert-success`;
            case 'error':
                return `${baseClass} alert-error`;
            case 'warning':
                return `${baseClass} alert-warning`;
            case 'info':
            default:
                return `${baseClass} alert-info`;
        }
    }

    getIcon(): string {
        switch (this.type()) {
            case 'success':
                return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
            case 'error':
                return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
            case 'warning':
                return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z';
            case 'info':
            default:
                return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        }
    }
}
