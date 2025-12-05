// src/utils/poisson.js

// Very simple Poisson-like sampler: repeatedly sample random points and keep
// only those that are at least minDistance from existing points.
export function generatePoissonPoints(
  width,
  height,
  minDistance,
  desiredCount,
  maxAttempts = 40 * desiredCount
) {
  const points = [];
  const minDistSq = minDistance * minDistance;
  let attempts = 0;

  while (points.length < desiredCount && attempts < maxAttempts) {
    attempts++;
    const x = Math.random() * width;
    const y = Math.random() * height;

    let ok = true;
    for (const p of points) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (dx * dx + dy * dy < minDistSq) {
        ok = false;
        break;
      }
    }

    if (ok) {
      points.push({ x, y });
    }
  }

  return points;
}
