import { Directive, ElementRef, HostListener } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Directive({
  selector: '[appButtonAnim]'  // Selector que se aplica a todos los botones que usan esta directiva
})
export class ButtonAnimDirective {

  constructor(private el: ElementRef, private animationCtrl: AnimationController) {}

  // Escucha del evento pointerdown en lugar de solo click para los tabs
  @HostListener('pointerdown', ['$event']) onPointerDown() {
    const button = this.el.nativeElement;

    // Crear la animación con Ionic Animation API
    const animation = this.animationCtrl.create()
      .addElement(button)
      .duration(200)  // Duración de la animación en milisegundos
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, transform: 'scale(1)' },   // Estado inicial
        { offset: 0.5, transform: 'scale(1.1)' }, // Aumenta de tamaño al 110%
        { offset: 1, transform: 'scale(1)' }    // Vuelve a su tamaño original
      ]);

    // Ejecutar la animación
    animation.play();
  }
}
