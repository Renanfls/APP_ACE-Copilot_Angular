import { ValueProvider } from '@angular/core';
import type { ButtonVariants } from './hlm-button.directive';
export interface BrnButtonConfig {
    variant: ButtonVariants['variant'];
    size: ButtonVariants['size'];
}
export declare function provideBrnButtonConfig(config: Partial<BrnButtonConfig>): ValueProvider;
export declare function injectBrnButtonConfig(): BrnButtonConfig;
