/**
 * Apple Fluid Interface Motion & Physics Utilities
 * Based on WWDC 2018 "Designing Fluid Interfaces"
 */

/**
 * Momentum projection using Apple's exponential scroll deceleration formula.
 * @param initialVelocity Initial velocity in pixels per second
 * @param decelerationRate Typically ~0.998 for natural scroll, ~0.99 for snappy
 * @returns Projected travel distance in pixels
 */
export function projectMomentum(initialVelocity: number, decelerationRate = 0.998): number {
  if (Math.abs(initialVelocity) < 0.01) return 0;
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

/**
 * Apple Rubber-banding formula for soft progressive boundary resistance.
 * Real objects slow down continuously instead of hitting a hard brick wall.
 * @param overshoot Distance dragged beyond the boundary (signed)
 * @param dimension Dimension (width or height) of the viewport
 * @param constant Apple default is 0.55
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (overshoot === 0) return 0;
  const absOvershoot = Math.abs(overshoot);
  const result = (absOvershoot * dimension * constant) / (dimension + constant * absOvershoot);
  return overshoot < 0 ? -result : result;
}

/**
 * Calculate velocity from a list of recent pointer move timestamps and positions.
 */
export interface PointerSample {
  time: number;
  x: number;
  y: number;
}

export function computeVelocity(samples: PointerSample[]): { vx: number; vy: number } {
  if (samples.length < 2) return { vx: 0, vy: 0 };

  const now = performance.now();
  // Filter samples to last 100ms for responsiveness
  const recent = samples.filter(s => now - s.time <= 120);
  if (recent.length < 2) return { vx: 0, vy: 0 };

  const first = recent[0];
  const last = recent[recent.length - 1];
  const dt = (last.time - first.time) / 1000;

  if (dt <= 0.001) return { vx: 0, vy: 0 };

  return {
    vx: (last.x - first.x) / dt,
    vy: (last.y - first.y) / dt,
  };
}

/**
 * Critically damped spring step (damping = 1.0, response = 0.35s).
 * Apple default: no overshoot, smooth rapid settle.
 */
export function springCriticallyDamped(
  current: number,
  target: number,
  velocity: number,
  response = 0.35,
  dt = 1 / 60
): { position: number; velocity: number; settled: boolean } {
  const omega = (2 * Math.PI) / Math.max(0.01, response);
  const diff = current - target;

  // Critically damped exact analytical formulation: x(t) = (c1 + c2*t) * e^(-omega*t)
  const exp = Math.exp(-omega * dt);
  const newDiff = (diff + (velocity + omega * diff) * dt) * exp;
  const newVelocity = (velocity - omega * (diff * omega + velocity) * dt) * exp;
  const newPosition = target + newDiff;

  const settled = Math.abs(newDiff) < 0.1 && Math.abs(newVelocity) < 0.5;
  return {
    position: settled ? target : newPosition,
    velocity: settled ? 0 : newVelocity,
    settled,
  };
}
