'use client';

/**
 * The interaction manager.
 *
 * ## The constraint this file exists to respect
 *
 * `three/ThreeCanvas.tsx` renders the canvas `aria-hidden="true"` and
 * `pointer-events-none`, with the rule stated in its own doc comment: "Spec
 * §8.6: all meaning is in the DOM beside it." That is a genuinely good
 * decision and this module does not weaken it. A full-screen fixed canvas that
 * accepts pointer events would swallow clicks meant for the links and buttons
 * underneath it across the entire page — a catastrophic, easy-to-miss
 * regression.
 *
 * So pointer events are **opt-in, per scene, and off by default**. A scene
 * that wants them calls `useInteractive()`, which flips a flag the canvas
 * subscribes to and flips it back on unmount. Nothing else in the codebase can
 * turn them on.
 *
 * ## Where interaction is allowed at all
 *
 * `LuxeAxis_Cinematic_Direction.md` §8 is explicit that interactivity is
 * earned in exactly five places and "nowhere else": the portfolio object
 * (orbit), the Space OS device (hotspots), the fee calculator (DOM), the Vastu
 * toggle, and the before/after slider (DOM). Two of those five are WebGL, and
 * they are the only two this module serves.
 *
 * ## The `<Html>` problem, and what replaces it
 *
 * Spec §8.2 requires every interactive object to carry "a keyboard-operable
 * DOM equivalent layered via `<Html>`". `<Html>` is a drei component, and drei
 * is deliberately not a dependency — `eslint.config.mjs` blocks `@react-three/*`
 * wholesale outside this directory, and the seam's whole argument is that
 * nothing in `components/` should be able to reach WebGL.
 *
 * The replacement is strictly better than what the spec asked for. `<Html>`
 * portals DOM into an overlay at runtime: invisible to a crawler, absent from
 * the server-rendered markup, and gone entirely for the T0/T1/reduced-motion
 * visitors who never mount a canvas. Instead, the keyboard equivalent is real
 * DOM passed as `children` to `SceneSlot` — server-rendered, indexable,
 * focusable in document order, and present whether or not WebGL ever loads.
 * `useOrbit` accepts that DOM's state rather than creating its own.
 *
 * This is a deviation from the written spec and should be recorded as one.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useAppStore } from '@/lib/store';

/* ------------------------------------------------------------------------ *
 * Pointer-event arbitration
 *
 * A module-local external store rather than a field on `lib/store.ts`. The
 * canvas and the scenes are both inside `three/`, so this concern never needs
 * to cross the seam — and keeping it out of the app store means the DOM side
 * has no API for enabling pointer events on the WebGL layer at all, which is
 * the property worth having.
 * ------------------------------------------------------------------------ */

let interactiveCount = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Read by `ThreeCanvas` to decide `pointer-events`. Counted rather than
 *  boolean so an overlapping mount/unmount during a cross-fade transition
 *  cannot strand the canvas in the wrong state. */
export function useCanvasInteractive(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => interactiveCount > 0,
    // The server never has an interactive canvas; returning `true` here would
    // produce a hydration mismatch on the class list.
    () => false,
  );
}

/**
 * Declare that this scene needs pointer events.
 *
 * Only ever call this from a scene the Cinematic Direction doc lists as
 * interactive. The canvas also drops `aria-hidden` while active, because a
 * region that responds to a mouse but is hidden from assistive technology is a
 * WCAG failure rather than a clever optimisation.
 */
export function useInteractive(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    interactiveCount += 1;
    emit();
    return () => {
      interactiveCount -= 1;
      emit();
    };
  }, [enabled]);
}

/* ------------------------------------------------------------------------ *
 * Drag to orbit
 * ------------------------------------------------------------------------ */

export type OrbitOptions = {
  /** Half-width of the permitted arc, radians. The spec calls for a
   *  "constrained arc", never a free tumble — an object the visitor can spin
   *  to its unlit back face is a worse advert than one they cannot spin. */
  limit?: number;
  /** Radians per pixel of drag. */
  sensitivity?: number;
  /** Seconds of stillness before the object returns to its resting pose. */
  restDelay?: number;
  /** External yaw, in radians, from the DOM keyboard equivalent. Added to the
   *  dragged value so mouse and keyboard drive the same single state. */
  keyboardYaw?: number;
};

export type OrbitState = {
  /** Feed straight into `<CameraSystem orbitYaw={...} />`. */
  yaw: number;
  dragging: boolean;
  /** Bind to the interactive mesh: `<mesh {...orbit.bind}>`. */
  bind: {
    onPointerDown: (event: {
      clientX: number;
      nativeEvent: PointerEvent;
    }) => void;
    onPointerOver: () => void;
    onPointerOut: () => void;
  };
};

/**
 * Constrained drag-to-orbit with snap-back.
 *
 * Snap-back is spec §8 rule (3): "a snap-back to a good resting pose on
 * release so the composition never ends up broken". Without it, every visitor
 * who nudges the object leaves it abandoned at whatever angle they let go of,
 * and the next scroll-driven shot is composed around an object that is no
 * longer where the director put it.
 *
 * Under reduced motion the snap is instant rather than eased — the object
 * still returns, because a broken composition is not an accessibility feature,
 * but it does so without an animation.
 */
export function useOrbit({
  limit = Math.PI * 0.28,
  sensitivity = 0.005,
  restDelay = 1.4,
  keyboardYaw = 0,
}: OrbitOptions = {}): OrbitState {
  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);
  const reducedMotion = useAppStore((state) => state.reducedMotion);

  const [dragging, setDragging] = useState(false);
  const [yaw, setYaw] = useState(0);

  const dragYaw = useRef(0);
  const startX = useRef(0);
  const startYaw = useRef(0);
  const idleFor = useRef(0);

  useInteractive();

  const onPointerDown = useCallback(
    (event: { clientX: number; nativeEvent: PointerEvent }) => {
      setDragging(true);
      startX.current = event.clientX;
      startYaw.current = dragYaw.current;
      idleFor.current = 0;
      invalidate();

      const move = (moveEvent: PointerEvent) => {
        const delta = (moveEvent.clientX - startX.current) * sensitivity;
        dragYaw.current = MathUtils.clamp(
          startYaw.current + delta,
          -limit,
          limit,
        );
        setYaw(dragYaw.current);
        invalidate();
      };

      const up = () => {
        setDragging(false);
        idleFor.current = 0;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        invalidate();
      };

      // Listeners go on the window, not the mesh: a drag that leaves the
      // object — or the canvas — must keep tracking, and must always release.
      // A pointerup missed outside the element is a stuck drag state, which is
      // the classic failure of hand-rolled orbit controls.
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [invalidate, limit, sensitivity],
  );

  // The affordance. Spec §8 rule (1) requires a visible one; a grab cursor is
  // the minimum, and the scene is expected to render a "drag to explore" label
  // in its DOM children alongside it.
  const onPointerOver = useCallback(() => {
    gl.domElement.style.cursor = 'grab';
  }, [gl]);

  const onPointerOut = useCallback(() => {
    gl.domElement.style.cursor = '';
  }, [gl]);

  useEffect(() => {
    gl.domElement.style.cursor = dragging ? 'grabbing' : '';
  }, [dragging, gl]);

  useFrame((_, delta) => {
    if (dragging) return;
    if (dragYaw.current === 0) return;

    idleFor.current += delta;
    if (idleFor.current < restDelay) {
      invalidate();
      return;
    }

    if (reducedMotion) {
      dragYaw.current = 0;
    } else {
      dragYaw.current = MathUtils.damp(dragYaw.current, 0, 2.5, delta);
      if (Math.abs(dragYaw.current) < 1e-4) dragYaw.current = 0;
    }

    setYaw(dragYaw.current);
    invalidate();
  });

  return {
    yaw: yaw + keyboardYaw,
    dragging,
    bind: { onPointerDown, onPointerOver, onPointerOut },
  };
}

/* ------------------------------------------------------------------------ *
 * Hotspots
 * ------------------------------------------------------------------------ */

export type Hotspot = {
  id: string;
  /** Must match the `id` of the real DOM control in `SceneSlot`'s children.
   *  That pairing is the accessibility contract: the mesh is a pointer
   *  affordance for a button that already exists and already works. */
  controlId: string;
};

/**
 * Binds a mesh to a DOM control.
 *
 * The DOM button is authoritative — it is what a keyboard or screen-reader
 * user operates, it is server-rendered, and it works with WebGL switched off
 * entirely. Clicking the mesh dispatches a click to that button rather than
 * running its own handler, so there is exactly one code path for "this hotspot
 * was activated" and no possibility of the two drifting apart.
 */
export function useHotspot(controlId: string): {
  active: boolean;
  bind: {
    onClick: () => void;
    onPointerOver: () => void;
    onPointerOut: () => void;
  };
} {
  const [active, setActive] = useState(false);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useInteractive();

  const onClick = useCallback(() => {
    const control = document.getElementById(controlId);
    if (!control) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[interaction] hotspot "${controlId}" has no DOM control. The mesh is unreachable by keyboard — add the button to SceneSlot's children.`,
        );
      }
      return;
    }
    control.click();
    // Move focus with the activation so a keyboard user's focus ring follows
    // what the pointer user just did, rather than being left behind at the top
    // of the document.
    control.focus({ preventScroll: true });
  }, [controlId]);

  const onPointerOver = useCallback(() => {
    setActive(true);
    gl.domElement.style.cursor = 'pointer';
    invalidate();
  }, [gl, invalidate]);

  const onPointerOut = useCallback(() => {
    setActive(false);
    gl.domElement.style.cursor = '';
    invalidate();
  }, [gl, invalidate]);

  return { active, bind: { onClick, onPointerOver, onPointerOut } };
}
