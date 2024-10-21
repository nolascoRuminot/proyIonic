import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Usar el método inject() para obtener el Router
  const router = inject(Router);

  // Verificar si el usuario ha iniciado sesión (puedes cambiar la lógica según tu implementación)
  const isAuthenticated = !!localStorage.getItem('usuario');  // Suponemos que guardas el usuario en localStorage

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login con un mensaje
    router.navigate(['/login'], { queryParams: { mensaje: 'Debes iniciar sesión para acceder a esta página.' } });
    return false;  // Bloquear el acceso
  }

  return true;  // Permitir el acceso si el usuario está autenticado
};
