/**
 * Motor principal del juego: "Kinti: una aventura por el Perú"
 * Controla movimiento 2D, cámara suave, proximidad, diálogos, actividades y persistencia.
 */

import { STAGES, Stage, Discovery, HISTORICAL_SOURCES } from './stages';
import { loadProgress, saveProgress, resetProgress, hasSavedProgress, GameProgress } from './storage';
import { sound } from './audio';

export type GameState = 'TITLE' | 'PLAYING' | 'DIALOG' | 'ACTIVITY' | 'PAUSED' | 'VICTORY';

export class KintiGame {
  private container: HTMLElement;
  private progress: GameProgress;
  private currentStage: Stage;
  private state: GameState = 'TITLE';

  // Físicas y movimiento de Kinti
  private kinti = {
    x: 120,
    y: 280,
    baseY: 280,
    vx: 0,
    speed: 340, // píxeles por segundo
    facing: 1,  // 1 = derecha, -1 = izquierda
    tilt: 0,
  };

  // Cámara
  private cameraX = 0;
  private viewportWidth = 800;

  // Estado de controles activos
  private input = {
    left: false,
    right: false,
    explore: false,
  };

  // Descubrimientos de la etapa actual
  private discoveredIds: Set<string> = new Set();
  private activityCompleted: boolean = false;
  private portalUnlocked: boolean = false;
  private activeDiscoveryNear: Discovery | null = null;
  private nearPortal: boolean = false;

  // Ciclo de animación
  private lastTime = 0;
  private animFrameId: number | null = null;
  private gameTime = 0;

  // Elementos DOM cacheados
  private worldLayer!: HTMLElement;
  private kintiEl!: HTMLElement;
  private kintiPromptBadge!: HTMLElement;
  private btnExplore!: HTMLButtonElement;
  private missionTextEl!: HTMLElement;
  private hudStagePill!: HTMLElement;
  private hudFragmentsSlots: HTMLElement[] = [];
  private modalContainer!: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.progress = loadProgress();
    sound.setEnabled(this.progress.soundEnabled);
    this.currentStage = STAGES[this.progress.currentStageIndex] || STAGES[0];
  }

  public init(): void {
    this.renderTitleScreen();
    this.attachGlobalEvents();
  }

  // ==========================================================================
  // EVENTOS GLOBALES
  // ==========================================================================

  private attachGlobalEvents(): void {
    // Teclado
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.state === 'PAUSED') {
          this.resumeGame();
        } else if (this.state === 'PLAYING') {
          this.pauseGame();
        }
        return;
      }

      if (this.state !== 'PLAYING') return;

      if (e.key === 'ArrowLeft' || e.key === 'KeyA' || e.key === 'a' || e.key === 'A') {
        this.input.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'KeyD' || e.key === 'd' || e.key === 'D') {
        this.input.right = true;
      } else if (e.key === 'KeyE' || e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.triggerContextAction();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'KeyA' || e.key === 'a' || e.key === 'A') {
        this.input.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'KeyD' || e.key === 'd' || e.key === 'D') {
        this.input.right = false;
      }
    });

    // Liberar controles al perder foco o cancelar toque
    window.addEventListener('blur', () => this.releaseAllInputs());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.releaseAllInputs();
    });
    window.addEventListener('resize', () => {
      this.updateViewportSize();
    });
  }

  private releaseAllInputs(): void {
    this.input.left = false;
    this.input.right = false;
    this.input.explore = false;
  }

  private updateViewportSize(): void {
    const stageVp = this.container.querySelector('.stage-viewport');
    if (stageVp) {
      this.viewportWidth = stageVp.clientWidth || window.innerWidth;
      const vpHeight = stageVp.clientHeight || 480;
      this.kinti.baseY = Math.max(160, Math.round(vpHeight * 0.65));
    } else {
      this.viewportWidth = window.innerWidth;
    }
  }

  // ==========================================================================
  // PANTALLA DE INICIO / TÍTULO
  // ==========================================================================

  public renderTitleScreen(): void {
    this.state = 'TITLE';
    this.stopLoop();

    const hasSaved = hasSavedProgress();

    this.container.innerHTML = `
      <div class="title-screen">
        <header class="title-header">
          <div class="title-badge">
            <span>🇵🇪</span>
            <span>Aventura Educativa 2D</span>
          </div>
          <button id="btn-sound-toggle" class="btn-ghost" title="Sonido">
            ${this.progress.soundEnabled ? '🔊 Sonido: On' : '🔇 Sonido: Off'}
          </button>
        </header>

        <main class="title-hero">
          <div class="title-portal-container">
            <div class="title-portal-ring"></div>
            <img src="assets/portal_inicio.png" alt="Kinti y el portal temporal" class="title-portal-img" />
          </div>

          <h1 class="title-heading">
            <span class="kinti-name">Kinti:</span> una aventura por el Perú
          </h1>
          <p class="title-subtitle">Un pequeño vuelo por nuestra historia</p>
          <p class="title-tagline">
            Acompaña al colibrí Kinti a través de Caral, el Tahuantinsuyo y la Independencia para recuperar los fragmentos de la Medalla del Tiempo.
          </p>

          <div class="title-actions">
            <button id="btn-start" class="btn-primary title-btn-start">
              <span>Comenzar aventura</span>
              <span>➔</span>
            </button>
            ${
              hasSaved
                ? `<button id="btn-continue" class="btn-secondary title-btn-continue">
                     <span>Continuar (${this.currentStage.name})</span>
                     <span>➔</span>
                   </button>`
                : ''
            }
          </div>
        </main>

        <footer class="title-footer">
          <button id="btn-sources" class="btn-ghost" style="font-size: 0.85rem; text-decoration: underline;">
            📖 Sobre el contenido (Fuentes históricas)
          </button>
        </footer>
      </div>
      <div id="modal-container"></div>
    `;

    this.modalContainer = this.container.querySelector('#modal-container') as HTMLElement;

    // Listeners
    const btnStart = this.container.querySelector('#btn-start');
    btnStart?.addEventListener('click', () => {
      sound.playTap();
      resetProgress();
      this.progress = loadProgress();
      this.startStage(0);
    });

    const btnContinue = this.container.querySelector('#btn-continue');
    btnContinue?.addEventListener('click', () => {
      sound.playTap();
      this.progress = loadProgress();
      const stageIdx = Math.min(2, this.progress.currentStageIndex);
      this.startStage(stageIdx);
    });

    const btnSound = this.container.querySelector('#btn-sound-toggle');
    btnSound?.addEventListener('click', () => {
      const updated = !this.progress.soundEnabled;
      sound.setEnabled(updated);
      this.progress = saveProgress({ soundEnabled: updated });
      sound.playTap();
      if (btnSound) {
        btnSound.textContent = updated ? '🔊 Sonido: On' : '🔇 Sonido: Off';
      }
    });

    const btnSources = this.container.querySelector('#btn-sources');
    btnSources?.addEventListener('click', () => {
      sound.playTap();
      this.showSourcesModal();
    });
  }

  // ==========================================================================
  // INICIAR UNA ETAPA
  // ==========================================================================

  public startStage(stageIndex: number): void {
    if (stageIndex >= STAGES.length) {
      this.renderVictoryScreen();
      return;
    }

    this.currentStage = STAGES[stageIndex];
    this.progress = saveProgress({ currentStageIndex: stageIndex });
    this.discoveredIds = new Set();
    this.activityCompleted = false;
    this.portalUnlocked = false;
    this.activeDiscoveryNear = null;
    this.nearPortal = false;

    // Reset Kinti
    this.kinti.x = this.currentStage.kintiStartX;
    this.kinti.y = 260;
    this.kinti.baseY = 260;
    this.kinti.vx = 0;
    this.kinti.facing = 1;
    this.kinti.tilt = 0;
    this.cameraX = 0;

    this.renderGameLayout();
    this.updateViewportSize();
    this.kinti.y = this.kinti.baseY;
    this.state = 'PLAYING';
    this.startLoop();
  }

  // ==========================================================================
  // RENDERIZADO DEL ENTORNO DE JUEGO
  // ==========================================================================

  private renderGameLayout(): void {
    this.container.innerHTML = `
      <!-- HUD Superior -->
      <header class="game-hud">
        <div class="hud-top-bar">
          <button id="btn-pause" class="btn-icon" aria-label="Pausa" title="Pausa">
            ⏸
          </button>

          <div class="hud-pill">
            <span style="font-size: 1rem;">🧭</span>
            <span class="hud-stage-name">${this.currentStage.periodBadge}</span>
          </div>

          <div class="hud-fragments" title="Fragmentos de la Medalla del Tiempo">
            <div class="hud-fragment-slot ${this.progress.fragments[0] ? 'unlocked' : ''}" title="Caral">
              ${this.progress.fragments[0] ? '★' : '🔒'}
            </div>
            <div class="hud-fragment-slot ${this.progress.fragments[1] ? 'unlocked inca' : ''}" title="Mundo Inca">
              ${this.progress.fragments[1] ? '★' : '🔒'}
            </div>
            <div class="hud-fragment-slot ${this.progress.fragments[2] ? 'unlocked indep' : ''}" title="Independencia">
              ${this.progress.fragments[2] ? '★' : '🔒'}
            </div>
          </div>
        </div>

        <div class="hud-mission-bar">
          <span class="mission-indicator-dot"></span>
          <span id="mission-text">${this.currentStage.mission}</span>
        </div>
      </header>

      <!-- Escenario 2D Viewport -->
      <main class="stage-viewport">
        <div class="world-layer" style="width: ${this.currentStage.worldWidth}px;">
          <!-- Fondo escénico -->
          <img src="${this.currentStage.sceneryImage}" alt="${this.currentStage.name}" class="scenery-background" />

          <!-- Efectos escénicos ambientales -->
          ${this.currentStage.discoveries
            .map(
              (d) => `<div id="effect-${d.id}" class="scenery-effect ${d.visualEffectClass}"></div>`
            )
            .join('')}

          <!-- Hotspots de Descubrimiento -->
          ${this.currentStage.discoveries
            .map(
              (d) => `
              <div id="hotspot-${d.id}" class="hotspot-node" style="left: ${d.x}px; bottom: ${d.bottomPercent}%;">
                <div class="hotspot-ring"></div>
                <div class="hotspot-beacon">✦</div>
                <div class="hotspot-label">${d.shortLabel}</div>
              </div>
            `
            )
            .join('')}

          <!-- Portal Temporal -->
          <div id="portal-temporal" class="portal-node locked" style="left: ${this.currentStage.portalX}px; bottom: 25%;">
            <div class="portal-ring-outer"></div>
            <div class="portal-ring-inner"></div>
            <div class="portal-core">
              <span style="font-size: 1.8rem;">🌀</span>
            </div>
            <div class="portal-label">Portal Temporal</div>
          </div>

          <!-- Kinti Protagonista -->
          <div id="kinti-actor" class="kinti-container">
            <div id="kinti-prompt" class="kinti-prompt-badge">
              <span>✦</span>
              <span id="kinti-prompt-text">Explorar</span>
            </div>
            <img src="assets/kinti.png" alt="Kinti el colibrí" class="kinti-sprite" />
          </div>
        </div>
      </main>

      <!-- Controles Inferiores -->
      <footer class="game-controls">
        <div class="controls-dpad">
          <button id="ctrl-left" class="ctrl-btn" aria-label="Mover a la izquierda">
            ◀
          </button>
          <button id="ctrl-right" class="ctrl-btn" aria-label="Mover a la derecha">
            ▶
          </button>
        </div>

        <div class="controls-action">
          <button id="btn-explore" class="btn-explore" disabled>
            <span>✦ Explorar</span>
            <span style="font-size: 0.75rem; opacity: 0.8;">[E]</span>
          </button>
        </div>
      </footer>

      <div id="modal-container"></div>
    `;

    // Cachear referencias DOM
    this.worldLayer = this.container.querySelector('.world-layer') as HTMLElement;
    this.kintiEl = this.container.querySelector('#kinti-actor') as HTMLElement;
    this.kintiPromptBadge = this.container.querySelector('#kinti-prompt') as HTMLElement;
    this.btnExplore = this.container.querySelector('#btn-explore') as HTMLButtonElement;
    this.missionTextEl = this.container.querySelector('#mission-text') as HTMLElement;
    this.hudStagePill = this.container.querySelector('.hud-stage-name') as HTMLElement;
    this.hudFragmentsSlots = Array.from(this.container.querySelectorAll('.hud-fragment-slot')) as HTMLElement[];
    this.modalContainer = this.container.querySelector('#modal-container') as HTMLElement;

    // Attach control listeners
    this.attachIngameListeners();
  }

  private attachIngameListeners(): void {
    const btnPause = this.container.querySelector('#btn-pause');
    btnPause?.addEventListener('click', () => {
      sound.playTap();
      this.pauseGame();
    });

    const ctrlLeft = this.container.querySelector('#ctrl-left');
    const ctrlRight = this.container.querySelector('#ctrl-right');

    const handlePointerDown = (dir: 'left' | 'right') => {
      sound.playTap();
      if (dir === 'left') this.input.left = true;
      if (dir === 'right') this.input.right = true;
    };

    const handlePointerUp = (dir: 'left' | 'right') => {
      if (dir === 'left') this.input.left = false;
      if (dir === 'right') this.input.right = false;
    };

    ctrlLeft?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handlePointerDown('left');
    });
    ctrlLeft?.addEventListener('pointerup', () => handlePointerUp('left'));
    ctrlLeft?.addEventListener('pointercancel', () => handlePointerUp('left'));
    ctrlLeft?.addEventListener('pointerleave', () => handlePointerUp('left'));

    ctrlRight?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handlePointerDown('right');
    });
    ctrlRight?.addEventListener('pointerup', () => handlePointerUp('right'));
    ctrlRight?.addEventListener('pointercancel', () => handlePointerUp('right'));
    ctrlRight?.addEventListener('pointerleave', () => handlePointerUp('right'));

    // Botón Explorar
    this.btnExplore.addEventListener('click', () => {
      this.triggerContextAction();
    });

    // Clic directo en hotspots si se toca la pantalla
    this.currentStage.discoveries.forEach((d) => {
      const el = this.container.querySelector(`#hotspot-${d.id}`);
      el?.addEventListener('click', () => {
        if (Math.abs(this.kinti.x - d.x) < 140) {
          this.triggerContextAction();
        }
      });
    });

    // Clic directo en portal
    const portalEl = this.container.querySelector('#portal-temporal');
    portalEl?.addEventListener('click', () => {
      if (this.portalUnlocked && Math.abs(this.kinti.x - this.currentStage.portalX) < 160) {
        this.enterPortal();
      }
    });
  }

  // ==========================================================================
  // CICLO PRINCIPAL (LOOP INDEPENDIENTE DE FRAMERATE)
  // ==========================================================================

  private startLoop(): void {
    this.lastTime = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;
      this.gameTime += dt;

      if (this.state === 'PLAYING') {
        this.update(dt);
      }

      this.animFrameId = requestAnimationFrame(frame);
    };
    this.animFrameId = requestAnimationFrame(frame);
  }

  private stopLoop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private update(dt: number): void {
    // 1. Aceleración horizontal
    const accel = 1200;
    const friction = 900;

    if (this.input.left) {
      this.kinti.vx -= accel * dt;
      this.kinti.facing = -1;
    } else if (this.input.right) {
      this.kinti.vx += accel * dt;
      this.kinti.facing = 1;
    } else {
      if (this.kinti.vx > 0) {
        this.kinti.vx = Math.max(0, this.kinti.vx - friction * dt);
      } else if (this.kinti.vx < 0) {
        this.kinti.vx = Math.min(0, this.kinti.vx + friction * dt);
      }
    }

    // Clamp velocidad
    this.kinti.vx = Math.max(-this.kinti.speed, Math.min(this.kinti.speed, this.kinti.vx));

    // 2. Posición X con límites del mundo
    this.kinti.x += this.kinti.vx * dt;
    const minX = 40;
    const maxX = this.currentStage.worldWidth - 60;
    if (this.kinti.x < minX) {
      this.kinti.x = minX;
      this.kinti.vx = 0;
    } else if (this.kinti.x > maxX) {
      this.kinti.x = maxX;
      this.kinti.vx = 0;
    }

    // 3. Flotación suave en Y
    this.kinti.y = this.kinti.baseY + Math.sin(this.gameTime * 3.5) * 8;

    // 4. Inclinación sutil según movimiento
    this.kinti.tilt = (this.kinti.vx / this.kinti.speed) * 12;

    // 5. Aplicar transform a Kinti
    if (this.kintiEl) {
      this.kintiEl.style.transform = `translate3d(${this.kinti.x}px, ${this.kinti.y}px, 0) scaleX(${this.kinti.facing}) rotate(${this.kinti.tilt * this.kinti.facing}deg)`;
    }

    // 6. Cámara suave que sigue a Kinti
    const targetCameraX = Math.max(
      0,
      Math.min(this.kinti.x - this.viewportWidth * 0.42, this.currentStage.worldWidth - this.viewportWidth)
    );
    this.cameraX += (targetCameraX - this.cameraX) * 0.12;

    if (this.worldLayer) {
      this.worldLayer.style.transform = `translate3d(${-this.cameraX}px, 0, 0)`;
    }

    // 7. Detección de proximidad
    this.checkProximity();
  }

  // ==========================================================================
  // DETECCIÓN DE PROXIMIDAD E INTERACCIÓN
  // ==========================================================================

  private checkProximity(): void {
    const PROXIMITY_RADIUS = 110;

    // Verificar portal
    if (this.portalUnlocked) {
      const distPortal = Math.abs(this.kinti.x - this.currentStage.portalX);
      if (distPortal < PROXIMITY_RADIUS + 30) {
        this.nearPortal = true;
        this.activeDiscoveryNear = null;
        this.updateContextButton(true, '✦ Entrar al Portal');
        return;
      } else {
        this.nearPortal = false;
      }
    }

    // Verificar descubrimientos no completados
    let nearest: Discovery | null = null;
    let minDist = Infinity;

    for (const d of this.currentStage.discoveries) {
      if (!this.discoveredIds.has(d.id)) {
        const dist = Math.abs(this.kinti.x - d.x);
        if (dist < PROXIMITY_RADIUS && dist < minDist) {
          minDist = dist;
          nearest = d;
        }
      }
    }

    this.activeDiscoveryNear = nearest;

    if (nearest) {
      this.updateContextButton(true, `✦ Explorar ${nearest.shortLabel}`);
    } else {
      this.updateContextButton(false, '✦ Explorar');
    }
  }

  private updateContextButton(active: boolean, label: string): void {
    if (!this.btnExplore) return;

    if (active) {
      this.btnExplore.disabled = false;
      this.btnExplore.classList.add('active-highlight');
      this.btnExplore.innerHTML = `<span>${label}</span> <span style="font-size: 0.75rem; opacity: 0.85;">[E]</span>`;

      if (this.kintiPromptBadge) {
        this.kintiPromptBadge.classList.add('visible');
        const txt = this.kintiPromptBadge.querySelector('#kinti-prompt-text');
        if (txt) txt.textContent = label.replace('✦ ', '');
      }
    } else {
      this.btnExplore.disabled = true;
      this.btnExplore.classList.remove('active-highlight');
      this.btnExplore.innerHTML = `<span>✦ Explorar</span> <span style="font-size: 0.75rem; opacity: 0.8;">[E]</span>`;

      if (this.kintiPromptBadge) {
        this.kintiPromptBadge.classList.remove('visible');
      }
    }
  }

  private triggerContextAction(): void {
    if (this.nearPortal && this.portalUnlocked) {
      this.enterPortal();
      return;
    }

    if (!this.activeDiscoveryNear) return;

    const disc = this.activeDiscoveryNear;
    this.openDiscoveryDialog(disc);
  }

  // ==========================================================================
  // DIÁLOGO DE DESCUBRIMIENTO
  // ==========================================================================

  private openDiscoveryDialog(discovery: Discovery): void {
    this.state = 'DIALOG';
    this.releaseAllInputs();
    sound.playDiscovery();

    // Activar efecto visual en escenario
    const fxEl = this.container.querySelector(`#effect-${discovery.id}`);
    fxEl?.classList.add('active');

    // Marcar hotspot como completado
    this.discoveredIds.add(discovery.id);
    const hotspotEl = this.container.querySelector(`#hotspot-${discovery.id}`);
    hotspotEl?.classList.add('completed');

    // Actualizar indicador de misión
    const total = this.currentStage.discoveries.length;
    const current = this.discoveredIds.size;
    if (this.missionTextEl) {
      this.missionTextEl.textContent = `Descubrimientos: ${current} de ${total}`;
    }

    this.modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="dialog-card">
          <div class="dialog-header">
            <span style="font-size: 1.4rem;">💡</span>
            <span class="dialog-speaker-tag">${discovery.dialogueSpeaker}</span>
          </div>

          <p class="dialog-body-text">${discovery.dialogueText}</p>

          <div class="dialog-didactic-box">
            <strong style="color: var(--color-noche); display: block; margin-bottom: 2px;">Dato clave:</strong>
            ${discovery.didacticDetail}
          </div>

          <div class="dialog-actions">
            <button id="btn-dialog-close" class="btn-primary">
              <span>Entendido</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const btnClose = this.modalContainer.querySelector('#btn-dialog-close');
    btnClose?.addEventListener('click', () => {
      sound.playTap();
      this.closeModal();

      // Si se completaron los 3 descubrimientos, abrir actividad educativa
      if (this.discoveredIds.size >= total) {
        setTimeout(() => {
          this.openActivityModal();
        }, 300);
      } else {
        this.state = 'PLAYING';
      }
    });
  }

  private closeModal(): void {
    this.modalContainer.innerHTML = '';
  }

  // ==========================================================================
  // MODAL DE ACTIVIDAD EDUCATIVA
  // ==========================================================================

  private openActivityModal(): void {
    this.state = 'ACTIVITY';
    this.releaseAllInputs();
    sound.playTap();

    const activity = this.currentStage.activity;

    if (activity.type === 'matching') {
      this.renderMatchingActivity();
    } else if (activity.type === 'destination_choice') {
      this.renderDestinationChoiceActivity();
    } else if (activity.type === 'sentence_completion') {
      this.renderSentenceCompletionActivity();
    }
  }

  // --- 1. Actividad de Caral: Relacionar Elementos y Funciones ---
  private renderMatchingActivity(): void {
    const activity = this.currentStage.activity;
    const pairs = activity.matchPairs || [];

    // Shuffle para la columna derecha para no dar la respuesta en la misma fila
    const shuffledFunctions = [...pairs].sort(() => Math.random() - 0.5);

    this.modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="activity-card">
          <div class="activity-header">
            <span class="activity-tag">Misión Final de Caral</span>
            <h2 class="activity-title">${activity.title}</h2>
            <p class="activity-instruction">${activity.instruction}</p>
          </div>

          <div class="matching-grid">
            <div class="matching-column" id="col-elements">
              <span class="column-label">Elemento</span>
              ${pairs
                .map(
                  (p) => `
                <button class="match-item match-elem" data-id="${p.elementId}" data-target="${p.functionId}">
                  <span>🏛</span>
                  <span>${p.elementLabel}</span>
                </button>
              `
                )
                .join('')}
            </div>

            <div class="matching-column" id="col-functions">
              <span class="column-label">Función Histórica</span>
              ${shuffledFunctions
                .map(
                  (f) => `
                <button class="match-item match-func" data-id="${f.functionId}">
                  <span>✔</span>
                  <span>${f.functionLabel}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div id="matching-feedback" class="activity-feedback" style="display: none;"></div>

          <div class="dialog-actions" style="justify-content: space-between; align-items: center;">
            <span id="match-counter" style="font-size: 0.85rem; font-weight: 700; color: var(--color-noche-muted);">
              Asociaciones: 0 de 3
            </span>
            <button id="btn-finish-activity" class="btn-primary" style="display: none;">
              <span>Obtener Fragmento</span>
              <span>★</span>
            </button>
          </div>
        </div>
      </div>
    `;

    let selectedElem: HTMLButtonElement | null = null;
    let selectedFunc: HTMLButtonElement | null = null;
    let matchedCount = 0;

    const feedbackEl = this.modalContainer.querySelector('#matching-feedback') as HTMLElement;
    const counterEl = this.modalContainer.querySelector('#match-counter') as HTMLElement;
    const btnFinish = this.modalContainer.querySelector('#btn-finish-activity') as HTMLElement;

    const elemBtns = this.modalContainer.querySelectorAll('.match-elem') as NodeListOf<HTMLButtonElement>;
    const funcBtns = this.modalContainer.querySelectorAll('.match-func') as NodeListOf<HTMLButtonElement>;

    const checkMatch = () => {
      if (!selectedElem || !selectedFunc) return;

      const targetFuncId = selectedElem.getAttribute('data-target');
      const funcId = selectedFunc.getAttribute('data-id');

      if (targetFuncId === funcId) {
        // Correcto!
        sound.playActivitySuccess();
        selectedElem.classList.add('matched');
        selectedFunc.classList.add('matched');
        selectedElem.disabled = true;
        selectedFunc.disabled = true;

        matchedCount++;
        counterEl.textContent = `Asociaciones: ${matchedCount} de 3`;

        feedbackEl.className = 'activity-feedback success';
        feedbackEl.style.display = 'flex';
        feedbackEl.innerHTML = `<span>✔</span> <span><strong>¡Correcto!</strong> Asociaste con éxito ${selectedElem.textContent?.trim()} con su función.</span>`;

        selectedElem.classList.remove('selected');
        selectedFunc.classList.remove('selected');
        selectedElem = null;
        selectedFunc = null;

        if (matchedCount >= 3) {
          btnFinish.style.display = 'inline-flex';
          feedbackEl.innerHTML = `<span>★</span> <span><strong>¡Excelente trabajo colectivo!</strong> ${activity.successExplanation}</span>`;
        }
      } else {
        // Error con pista específica
        sound.playActivityHint();
        selectedElem.classList.add('error-shake');
        selectedFunc.classList.add('error-shake');

        const pairData = pairs.find((p) => p.elementId === selectedElem?.getAttribute('data-id'));
        const hintText = pairData ? pairData.hint : 'Observa bien las funciones de la civilización.';

        feedbackEl.className = 'activity-feedback error';
        feedbackEl.style.display = 'flex';
        feedbackEl.innerHTML = `<span>💡</span> <span><strong>Pista:</strong> ${hintText}</span>`;

        setTimeout(() => {
          selectedElem?.classList.remove('error-shake', 'selected');
          selectedFunc?.classList.remove('error-shake', 'selected');
          selectedElem = null;
          selectedFunc = null;
        }, 500);
      }
    };

    elemBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playActivitySelect();
        elemBtns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedElem = btn;
        checkMatch();
      });
    });

    funcBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playActivitySelect();
        funcBtns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedFunc = btn;
        checkMatch();
      });
    });

    btnFinish?.addEventListener('click', () => {
      this.completeStageActivity();
    });
  }

  // --- 2. Actividad de Mundo Inca: Elegir el destino del mensaje ---
  private renderDestinationChoiceActivity(): void {
    const activity = this.currentStage.activity;
    const options = activity.destinationOptions || [];

    this.modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="activity-card">
          <div class="activity-header">
            <span class="activity-tag">Misión del Chasqui</span>
            <h2 class="activity-title">${activity.title}</h2>
            <p class="activity-instruction">${activity.instruction}</p>
          </div>

          <div class="choice-list">
            ${options
              .map(
                (opt) => `
              <div class="choice-card" data-id="${opt.id}" data-correct="${opt.isCorrect}">
                <div class="choice-icon">
                  ${opt.isCorrect ? '🏃' : opt.id.includes('terraza') ? '🌱' : '🪨'}
                </div>
                <div class="choice-content">
                  <div class="choice-title">${opt.title}</div>
                  <div class="choice-desc">${opt.description}</div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>

          <div id="choice-feedback" class="activity-feedback" style="display: none;"></div>

          <div class="dialog-actions">
            <button id="btn-finish-activity" class="btn-primary" style="display: none;">
              <span>Obtener Fragmento</span>
              <span>★</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const cards = this.modalContainer.querySelectorAll('.choice-card') as NodeListOf<HTMLElement>;
    const feedbackEl = this.modalContainer.querySelector('#choice-feedback') as HTMLElement;
    const btnFinish = this.modalContainer.querySelector('#btn-finish-activity') as HTMLElement;

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const isCorrect = card.getAttribute('data-correct') === 'true';
        const optId = card.getAttribute('data-id');
        const optData = options.find((o) => o.id === optId);

        if (isCorrect) {
          sound.playActivitySuccess();
          cards.forEach((c) => {
            c.classList.remove('correct', 'wrong');
            (c as HTMLElement).style.pointerEvents = 'none';
          });
          card.classList.add('correct');

          feedbackEl.className = 'activity-feedback success';
          feedbackEl.style.display = 'flex';
          feedbackEl.innerHTML = `<span>✔</span> <span><strong>${optData?.feedback}</strong><br/>${activity.successExplanation}</span>`;

          btnFinish.style.display = 'inline-flex';
        } else {
          sound.playActivityHint();
          card.classList.add('wrong');
          feedbackEl.className = 'activity-feedback error';
          feedbackEl.style.display = 'flex';
          feedbackEl.innerHTML = `<span>💡</span> <span><strong>Pista:</strong> ${optData?.feedback} Intenta con otro destino.</span>`;

          setTimeout(() => {
            card.classList.remove('wrong');
          }, 800);
        }
      });
    });

    btnFinish?.addEventListener('click', () => {
      this.completeStageActivity();
    });
  }

  // --- 3. Actividad de Independencia: Completar la frase histórica ---
  private renderSentenceCompletionActivity(): void {
    const activity = this.currentStage.activity;
    const slots = activity.slots || [];

    this.modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="activity-card">
          <div class="activity-header">
            <span class="activity-tag">Memoria Histórica</span>
            <h2 class="activity-title">${activity.title}</h2>
            <p class="activity-instruction">${activity.instruction}</p>
          </div>

          <div class="sentence-container">
            “<span id="slot1-display" class="slot-pill">[Selecciona personaje]</span>
            proclamó la independencia del Perú en Lima el
            <span id="slot2-display" class="slot-pill">[Selecciona fecha]</span>.”
          </div>

          <div class="slot-options-group">
            <span class="slot-group-label">1. ¿Quién proclamó la independencia?</span>
            <div class="options-row" id="row-slot1">
              ${slots[0]?.options
                .map(
                  (opt) => `
                <button class="slot-option-btn" data-slot="slot1" data-id="${opt.id}" data-correct="${opt.isCorrect}">
                  ${opt.text}
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="slot-options-group">
            <span class="slot-group-label">2. ¿En qué fecha se realizó?</span>
            <div class="options-row" id="row-slot2">
              ${slots[1]?.options
                .map(
                  (opt) => `
                <button class="slot-option-btn" data-slot="slot2" data-id="${opt.id}" data-correct="${opt.isCorrect}">
                  ${opt.text}
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div id="sentence-feedback" class="activity-feedback" style="display: none;"></div>

          <div class="dialog-actions">
            <button id="btn-finish-activity" class="btn-primary" style="display: none;">
              <span>Ensamblar Medalla del Tiempo</span>
              <span>★</span>
            </button>
          </div>
        </div>
      </div>
    `;

    let selectedSlot1: { text: string; isCorrect: boolean } | null = null;
    let selectedSlot2: { text: string; isCorrect: boolean } | null = null;

    const slot1Display = this.modalContainer.querySelector('#slot1-display') as HTMLElement;
    const slot2Display = this.modalContainer.querySelector('#slot2-display') as HTMLElement;
    const feedbackEl = this.modalContainer.querySelector('#sentence-feedback') as HTMLElement;
    const btnFinish = this.modalContainer.querySelector('#btn-finish-activity') as HTMLElement;

    const checkSentence = () => {
      if (!selectedSlot1 || !selectedSlot2) return;

      if (selectedSlot1.isCorrect && selectedSlot2.isCorrect) {
        sound.playActivitySuccess();
        feedbackEl.className = 'activity-feedback success';
        feedbackEl.style.display = 'flex';
        feedbackEl.innerHTML = `
          <span>✔</span>
          <div>
            <strong>¡Frase correcta!</strong><br/>
            “José de San Martín proclamó la independencia del Perú en Lima el 28 de julio de 1821.”<br/>
            <em style="margin-top: 4px; display: block; color: var(--color-noche);">${activity.postSuccessNote}</em>
          </div>
        `;
        btnFinish.style.display = 'inline-flex';
      } else {
        sound.playActivityHint();
        feedbackEl.className = 'activity-feedback error';
        feedbackEl.style.display = 'flex';

        let hint = '';
        if (!selectedSlot1.isCorrect) {
          hint = 'Recuerda quién lideró la Expedición Libertadora y proclamó la libertad en 1821.';
        } else if (!selectedSlot2.isCorrect) {
          hint = 'Revisa el día patrio de julio de 1821 en el que se conmemora la proclama limeña.';
        }
        feedbackEl.innerHTML = `<span>💡</span> <span><strong>Pista:</strong> ${hint} Puedes volver a elegir.</span>`;
      }
    };

    const slot1Btns = this.modalContainer.querySelectorAll('button[data-slot="slot1"]');
    slot1Btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playActivitySelect();
        slot1Btns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        const text = btn.textContent?.trim() || '';
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        selectedSlot1 = { text, isCorrect };
        slot1Display.textContent = text;
        slot1Display.classList.add('filled');
        checkSentence();
      });
    });

    const slot2Btns = this.modalContainer.querySelectorAll('button[data-slot="slot2"]');
    slot2Btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playActivitySelect();
        slot2Btns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        const text = btn.textContent?.trim() || '';
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        selectedSlot2 = { text, isCorrect };
        slot2Display.textContent = text;
        slot2Display.classList.add('filled');
        checkSentence();
      });
    });

    btnFinish?.addEventListener('click', () => {
      this.completeStageActivity();
    });
  }

  // ==========================================================================
  // FINALIZACIÓN DE ACTIVIDAD Y PREMIO DE FRAGMENTO
  // ==========================================================================

  private completeStageActivity(): void {
    sound.playFragmentAwarded();
    this.closeModal();

    const stageId = this.currentStage.id;
    const newFragments = [...this.progress.fragments];
    newFragments[stageId] = true;

    const newStagesCompleted = [...this.progress.stagesCompleted];
    newStagesCompleted[stageId] = true;

    this.progress = saveProgress({
      fragments: newFragments,
      stagesCompleted: newStagesCompleted,
    });

    // Animar indicador superior de fragmentos
    const slotEl = this.hudFragmentsSlots[stageId];
    if (slotEl) {
      slotEl.classList.add('unlocked', 'pulse-gain');
      slotEl.textContent = '★';
    }

    // Desbloquear portal temporal
    this.portalUnlocked = true;
    const portalEl = this.container.querySelector('#portal-temporal');
    portalEl?.classList.remove('locked');

    // Mensaje de misión actualizado
    if (this.missionTextEl) {
      this.missionTextEl.textContent = '¡Fragmento recuperado! Cruza el Portal Temporal.';
    }

    this.state = 'PLAYING';
  }

  // ==========================================================================
  // ENTRAR AL PORTAL TEMPORAL
  // ==========================================================================

  private enterPortal(): void {
    sound.playPortal();
    this.state = 'PAUSED';

    // Animación de transición hacia el portal
    const stageVp = this.container.querySelector('.stage-viewport') as HTMLElement;
    if (stageVp) {
      stageVp.style.transition = 'filter 0.6s ease, transform 0.6s ease';
      stageVp.style.filter = 'brightness(2) contrast(1.2)';
    }

    setTimeout(() => {
      const nextStageIndex = this.currentStage.id + 1;
      if (nextStageIndex < STAGES.length) {
        this.startStage(nextStageIndex);
      } else {
        this.renderVictoryScreen();
      }
    }, 600);
  }

  // ==========================================================================
  // PANTALLA FINAL: CELEBRACIÓN Y MEDALLA COMPLETA
  // ==========================================================================

  public renderVictoryScreen(): void {
    this.state = 'VICTORY';
    this.stopLoop();
    sound.playFragmentAwarded();

    this.container.innerHTML = `
      <div class="victory-screen">
        <header class="title-header">
          <div class="title-badge" style="background: var(--color-amarillo-light); border-color: var(--color-amarillo-dark);">
            <span>★</span>
            <span>Misión Cumplida</span>
          </div>
          <button id="btn-sound-toggle-victory" class="btn-ghost">
            ${this.progress.soundEnabled ? '🔊 Sonido' : '🔇 Silencio'}
          </button>
        </header>

        <main class="victory-card">
          <div class="victory-medal-wrapper">
            <div class="victory-halo"></div>
            <img src="assets/medalla_completa.png" alt="Medalla del Tiempo Completa" class="victory-medal-img" />
          </div>

          <h1 class="victory-title">¡Completaste el viaje!</h1>
          <p style="font-size: 0.95rem; color: var(--color-noche-muted); max-width: 440px;">
            ¡Has recuperado los tres fragmentos y restaurado la Medalla del Tiempo junto a Kinti!
          </p>

          <div class="memories-container">
            <div class="memory-item">
              <span class="memory-bullet caral"></span>
              <div>
                <strong style="color: var(--color-noche);">Caral (3000 a.C.):</strong>
                ${STAGES[0].summaryMemory}
              </div>
            </div>
            <div class="memory-item">
              <span class="memory-bullet inca"></span>
              <div>
                <strong style="color: var(--color-noche);">Mundo Inca (S. XV):</strong>
                ${STAGES[1].summaryMemory}
              </div>
            </div>
            <div class="memory-item">
              <span class="memory-bullet indep"></span>
              <div>
                <strong style="color: var(--color-noche);">Independencia (1821):</strong>
                ${STAGES[2].summaryMemory}
              </div>
            </div>
          </div>

          <div class="title-actions" style="margin-top: 6px;">
            <button id="btn-replay" class="btn-primary" style="height: 50px;">
              <span>Volver a jugar</span>
              <span>↺</span>
            </button>
          </div>
        </main>

        <footer class="title-footer">
          <button id="btn-sources-victory" class="btn-ghost" style="font-size: 0.85rem; text-decoration: underline;">
            📖 Sobre el contenido (Fuentes históricas consultadas)
          </button>
        </footer>
      </div>
      <div id="modal-container"></div>
    `;

    this.modalContainer = this.container.querySelector('#modal-container') as HTMLElement;

    const btnReplay = this.container.querySelector('#btn-replay');
    btnReplay?.addEventListener('click', () => {
      sound.playTap();
      resetProgress();
      this.progress = loadProgress();
      this.startStage(0);
    });

    const btnSources = this.container.querySelector('#btn-sources-victory');
    btnSources?.addEventListener('click', () => {
      sound.playTap();
      this.showSourcesModal();
    });

    const btnSound = this.container.querySelector('#btn-sound-toggle-victory');
    btnSound?.addEventListener('click', () => {
      const updated = !this.progress.soundEnabled;
      sound.setEnabled(updated);
      this.progress = saveProgress({ soundEnabled: updated });
      sound.playTap();
      if (btnSound) {
        btnSound.textContent = updated ? '🔊 Sonido' : '🔇 Silencio';
      }
    });
  }

  // ==========================================================================
  // MENÚ DE PAUSA
  // ==========================================================================

  public pauseGame(): void {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.releaseAllInputs();

    this.modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="dialog-card" style="max-width: 400px; text-align: center;">
          <h2 style="font-size: 1.4rem;">Pausa</h2>
          <p style="font-size: 0.9rem; color: var(--color-noche-muted);">
            Etapa actual: <strong>${this.currentStage.name}</strong>
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
            <button id="btn-resume" class="btn-primary">
              <span>Continuar</span>
              <span>▶</span>
            </button>

            <button id="btn-toggle-sound-pause" class="btn-secondary">
              ${this.progress.soundEnabled ? '🔊 Sonido: Activado' : '🔇 Sonido: Desactivado'}
            </button>

            <button id="btn-sources-pause" class="btn-tertiary">
              <span>Sobre el contenido</span>
            </button>

            <button id="btn-to-title" class="btn-ghost" style="color: var(--color-noche);">
              <span>Volver al inicio</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const btnResume = this.modalContainer.querySelector('#btn-resume');
    btnResume?.addEventListener('click', () => this.resumeGame());

    const btnSound = this.modalContainer.querySelector('#btn-toggle-sound-pause');
    btnSound?.addEventListener('click', () => {
      const updated = !this.progress.soundEnabled;
      sound.setEnabled(updated);
      this.progress = saveProgress({ soundEnabled: updated });
      sound.playTap();
      if (btnSound) {
        btnSound.textContent = updated ? '🔊 Sonido: Activado' : '🔇 Sonido: Desactivado';
      }
    });

    const btnSources = this.modalContainer.querySelector('#btn-sources-pause');
    btnSources?.addEventListener('click', () => {
      sound.playTap();
      this.showSourcesModal();
    });

    const btnToTitle = this.modalContainer.querySelector('#btn-to-title');
    btnToTitle?.addEventListener('click', () => {
      sound.playTap();
      this.renderTitleScreen();
    });
  }

  public resumeGame(): void {
    sound.playTap();
    this.closeModal();
    this.state = 'PLAYING';
    this.lastTime = performance.now();
  }

  // ==========================================================================
  // MODAL DE FUENTES HISTÓRICAS ("Sobre el contenido")
  // ==========================================================================

  public showSourcesModal(): void {
    const prevState = this.state;
    this.modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="dialog-card" style="max-width: 540px;">
          <div class="dialog-header">
            <span style="font-size: 1.4rem;">🏛</span>
            <span class="dialog-speaker-tag">Fuentes Históricas</span>
          </div>

          <h2 style="font-size: 1.25rem;">Sobre el contenido educativo</h2>
          <p style="font-size: 0.88rem; color: var(--color-noche-muted);">
            Los contenidos de <strong>Kinti: una aventura por el Perú</strong> fueron formulados con rigor pedagógico para estudiantes de secundaria, tomando como base las fuentes e investigaciones de las instituciones culturales oficiales del Perú:
          </p>

          <div class="sources-list">
            ${HISTORICAL_SOURCES.map(
              (s) => `
              <div class="source-item">
                <span class="source-topic">${s.topic}</span>
                <span class="source-entity">${s.entity}</span>
                <p class="source-detail">${s.detail}</p>
                <span class="source-url">${s.referenceUrlText}</span>
              </div>
            `
            ).join('')}
          </div>

          <div class="dialog-actions">
            <button id="btn-close-sources" class="btn-primary">
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const btnClose = this.modalContainer.querySelector('#btn-close-sources');
    btnClose?.addEventListener('click', () => {
      sound.playTap();
      this.closeModal();
      if (prevState === 'PAUSED') {
        this.pauseGame();
      } else if (prevState === 'PLAYING') {
        this.state = 'PLAYING';
      }
    });
  }
}
