import { Directive, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { cva } from 'class-variance-authority';
import { injectBrnButtonConfig } from './hlm-button.token';
import * as i0 from "@angular/core";
export const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'underline-offset-4 hover:underline text-primary',
        },
        size: {
            default: 'h-10 py-2 px-4',
            sm: 'h-9 px-3 rounded-md',
            lg: 'h-11 px-8 rounded-md',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
export class HlmButtonDirective {
    _config = injectBrnButtonConfig();
    _additionalClasses = signal('');
    userClass = input('', { alias: 'class' });
    _computedClass = computed(() => hlm(buttonVariants({ variant: this.variant(), size: this.size() }), this.userClass(), this._additionalClasses()));
    variant = input(this._config.variant);
    size = input(this._config.size);
    setClass(classes) {
        this._additionalClasses.set(classes);
    }
    static ɵfac = function HlmButtonDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HlmButtonDirective)(); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: HlmButtonDirective, selectors: [["", "hlmBtn", ""]], hostVars: 2, hostBindings: function HlmButtonDirective_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵclassMap(ctx._computedClass());
        } }, inputs: { userClass: [1, "class", "userClass"], variant: [1, "variant"], size: [1, "size"] }, exportAs: ["hlmBtn"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HlmButtonDirective, [{
        type: Directive,
        args: [{
                selector: '[hlmBtn]',
                standalone: true,
                exportAs: 'hlmBtn',
                host: {
                    '[class]': '_computedClass()',
                },
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGxtLWJ1dHRvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGlicy91aS91aS1idXR0b24taGVsbS9zcmMvbGliL2hsbS1idXR0b24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzdDLE9BQU8sRUFBcUIsR0FBRyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFbEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBRTNELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQ2hDLHNRQUFzUSxFQUN0UTtJQUNDLFFBQVEsRUFBRTtRQUNULE9BQU8sRUFBRTtZQUNSLE9BQU8sRUFBRSx3REFBd0Q7WUFDakUsV0FBVyxFQUFFLG9FQUFvRTtZQUNqRixPQUFPLEVBQUUsa0VBQWtFO1lBQzNFLFNBQVMsRUFBRSw4REFBOEQ7WUFDekUsS0FBSyxFQUFFLDhDQUE4QztZQUNyRCxJQUFJLEVBQUUsaURBQWlEO1NBQ3ZEO1FBQ0QsSUFBSSxFQUFFO1lBQ0wsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixFQUFFLEVBQUUscUJBQXFCO1lBQ3pCLEVBQUUsRUFBRSxzQkFBc0I7WUFDMUIsSUFBSSxFQUFFLFdBQVc7U0FDakI7S0FDRDtJQUNELGVBQWUsRUFBRTtRQUNoQixPQUFPLEVBQUUsU0FBUztRQUNsQixJQUFJLEVBQUUsU0FBUztLQUNmO0NBQ0QsQ0FDRCxDQUFDO0FBV0YsTUFBTSxPQUFPLGtCQUFrQjtJQUNiLE9BQU8sR0FBRyxxQkFBcUIsRUFBRSxDQUFDO0lBRWxDLGtCQUFrQixHQUFHLE1BQU0sQ0FBYSxFQUFFLENBQUMsQ0FBQztJQUU3QyxTQUFTLEdBQUcsS0FBSyxDQUFhLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBRW5ELGNBQWMsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQ2pELEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUNoSCxDQUFDO0lBRWMsT0FBTyxHQUFHLEtBQUssQ0FBNEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVqRSxJQUFJLEdBQUcsS0FBSyxDQUF5QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhFLFFBQVEsQ0FBQyxPQUFlO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQzs0R0FqQlcsa0JBQWtCOzZEQUFsQixrQkFBa0I7WUFBbEIsY0FBQSxvQkFBZ0IsQ0FBRTs7O2lGQUFsQixrQkFBa0I7Y0FSOUIsU0FBUztlQUFDO2dCQUNWLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLElBQUksRUFBRTtvQkFDTCxTQUFTLEVBQUUsa0JBQWtCO2lCQUM3QjthQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBjb21wdXRlZCwgaW5wdXQsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBobG0gfSBmcm9tICdAc3BhcnRhbi1uZy9icmFpbi9jb3JlJztcclxuaW1wb3J0IHsgdHlwZSBWYXJpYW50UHJvcHMsIGN2YSB9IGZyb20gJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eSc7XHJcbmltcG9ydCB0eXBlIHsgQ2xhc3NWYWx1ZSB9IGZyb20gJ2Nsc3gnO1xyXG5pbXBvcnQgeyBpbmplY3RCcm5CdXR0b25Db25maWcgfSBmcm9tICcuL2hsbS1idXR0b24udG9rZW4nO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJ1dHRvblZhcmlhbnRzID0gY3ZhKFxyXG5cdCdpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1tZCB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRyYW5zaXRpb24tY29sb3JzIGZvY3VzLXZpc2libGU6b3V0bGluZS1ub25lIGZvY3VzLXZpc2libGU6cmluZy0yIGZvY3VzLXZpc2libGU6cmluZy1yaW5nIGZvY3VzLXZpc2libGU6cmluZy1vZmZzZXQtMiBkaXNhYmxlZDpvcGFjaXR5LTUwIGRpc2FibGVkOnBvaW50ZXItZXZlbnRzLW5vbmUgcmluZy1vZmZzZXQtYmFja2dyb3VuZCcsXHJcblx0e1xyXG5cdFx0dmFyaWFudHM6IHtcclxuXHRcdFx0dmFyaWFudDoge1xyXG5cdFx0XHRcdGRlZmF1bHQ6ICdiZy1wcmltYXJ5IHRleHQtcHJpbWFyeS1mb3JlZ3JvdW5kIGhvdmVyOmJnLXByaW1hcnkvOTAnLFxyXG5cdFx0XHRcdGRlc3RydWN0aXZlOiAnYmctZGVzdHJ1Y3RpdmUgdGV4dC1kZXN0cnVjdGl2ZS1mb3JlZ3JvdW5kIGhvdmVyOmJnLWRlc3RydWN0aXZlLzkwJyxcclxuXHRcdFx0XHRvdXRsaW5lOiAnYm9yZGVyIGJvcmRlci1pbnB1dCBob3ZlcjpiZy1hY2NlbnQgaG92ZXI6dGV4dC1hY2NlbnQtZm9yZWdyb3VuZCcsXHJcblx0XHRcdFx0c2Vjb25kYXJ5OiAnYmctc2Vjb25kYXJ5IHRleHQtc2Vjb25kYXJ5LWZvcmVncm91bmQgaG92ZXI6Ymctc2Vjb25kYXJ5LzgwJyxcclxuXHRcdFx0XHRnaG9zdDogJ2hvdmVyOmJnLWFjY2VudCBob3Zlcjp0ZXh0LWFjY2VudC1mb3JlZ3JvdW5kJyxcclxuXHRcdFx0XHRsaW5rOiAndW5kZXJsaW5lLW9mZnNldC00IGhvdmVyOnVuZGVybGluZSB0ZXh0LXByaW1hcnknLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaXplOiB7XHJcblx0XHRcdFx0ZGVmYXVsdDogJ2gtMTAgcHktMiBweC00JyxcclxuXHRcdFx0XHRzbTogJ2gtOSBweC0zIHJvdW5kZWQtbWQnLFxyXG5cdFx0XHRcdGxnOiAnaC0xMSBweC04IHJvdW5kZWQtbWQnLFxyXG5cdFx0XHRcdGljb246ICdoLTEwIHctMTAnLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHRcdGRlZmF1bHRWYXJpYW50czoge1xyXG5cdFx0XHR2YXJpYW50OiAnZGVmYXVsdCcsXHJcblx0XHRcdHNpemU6ICdkZWZhdWx0JyxcclxuXHRcdH0sXHJcblx0fSxcclxuKTtcclxuZXhwb3J0IHR5cGUgQnV0dG9uVmFyaWFudHMgPSBWYXJpYW50UHJvcHM8dHlwZW9mIGJ1dHRvblZhcmlhbnRzPjtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG5cdHNlbGVjdG9yOiAnW2hsbUJ0bl0nLFxyXG5cdHN0YW5kYWxvbmU6IHRydWUsXHJcblx0ZXhwb3J0QXM6ICdobG1CdG4nLFxyXG5cdGhvc3Q6IHtcclxuXHRcdCdbY2xhc3NdJzogJ19jb21wdXRlZENsYXNzKCknLFxyXG5cdH0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIbG1CdXR0b25EaXJlY3RpdmUge1xyXG5cdHByaXZhdGUgcmVhZG9ubHkgX2NvbmZpZyA9IGluamVjdEJybkJ1dHRvbkNvbmZpZygpO1xyXG5cclxuXHRwcml2YXRlIHJlYWRvbmx5IF9hZGRpdGlvbmFsQ2xhc3NlcyA9IHNpZ25hbDxDbGFzc1ZhbHVlPignJyk7XHJcblxyXG5cdHB1YmxpYyByZWFkb25seSB1c2VyQ2xhc3MgPSBpbnB1dDxDbGFzc1ZhbHVlPignJywgeyBhbGlhczogJ2NsYXNzJyB9KTtcclxuXHJcblx0cHJvdGVjdGVkIHJlYWRvbmx5IF9jb21wdXRlZENsYXNzID0gY29tcHV0ZWQoKCkgPT5cclxuXHRcdGhsbShidXR0b25WYXJpYW50cyh7IHZhcmlhbnQ6IHRoaXMudmFyaWFudCgpLCBzaXplOiB0aGlzLnNpemUoKSB9KSwgdGhpcy51c2VyQ2xhc3MoKSwgdGhpcy5fYWRkaXRpb25hbENsYXNzZXMoKSksXHJcblx0KTtcclxuXHJcblx0cHVibGljIHJlYWRvbmx5IHZhcmlhbnQgPSBpbnB1dDxCdXR0b25WYXJpYW50c1sndmFyaWFudCddPih0aGlzLl9jb25maWcudmFyaWFudCk7XHJcblxyXG5cdHB1YmxpYyByZWFkb25seSBzaXplID0gaW5wdXQ8QnV0dG9uVmFyaWFudHNbJ3NpemUnXT4odGhpcy5fY29uZmlnLnNpemUpO1xyXG5cclxuXHRzZXRDbGFzcyhjbGFzc2VzOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2FkZGl0aW9uYWxDbGFzc2VzLnNldChjbGFzc2VzKTtcclxuXHR9XHJcbn1cclxuIl19