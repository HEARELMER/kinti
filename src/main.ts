/**
 * Punto de entrada de la aplicación "Kinti: una aventura por el Perú"
 */

import './styles.css';
import { KintiGame } from './game';

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    throw new Error('No se encontró el contenedor #app en index.html');
  }

  const game = new KintiGame(appContainer);
  game.init();
});
