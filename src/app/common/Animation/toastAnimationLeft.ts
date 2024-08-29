import { trigger, state, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';
 
export const toastAnimationLeft: AnimationTriggerMetadata = trigger('toastRightToLeft',
    [
        state('show', style({
            right: '15px'
        })),
        state('hide', style({
            right: '-150%'
        })),
        transition('hide => show', animate('1s ease')),
        transition('show => hide', animate('1s ease'))
    ]
);