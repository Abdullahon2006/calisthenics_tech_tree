export interface TreePosition {
  x: number;
  y: number;
}

export const TREE_NODE_WIDTH = 140;
export const TREE_NODE_HEIGHT = 132;
const HORIZONTAL_STEP = 172;
const VERTICAL_STEP = 164;

function overlaps(a: TreePosition, b: TreePosition): boolean {
  return Math.abs(a.x - b.x) < TREE_NODE_WIDTH && Math.abs(a.y - b.y) < TREE_NODE_HEIGHT;
}

/**
 * Returns the closest deterministic grid lane that does not intersect another
 * tree card. Same-tier lanes are preferred, preserving the intended flow.
 */
export function findAvailableNodePosition(
  occupied: TreePosition[],
  desired: TreePosition
): TreePosition {
  if (!occupied.some((position) => overlaps(position, desired))) return desired;

  for (let radius = 1; radius <= 48; radius += 1) {
    const candidates: TreePosition[] = [];
    for (let vertical = -radius; vertical <= radius; vertical += 1) {
      for (let horizontal = -radius; horizontal <= radius; horizontal += 1) {
        if (Math.max(Math.abs(horizontal), Math.abs(vertical)) !== radius) continue;
        candidates.push({
          x: desired.x + horizontal * HORIZONTAL_STEP,
          y: desired.y + vertical * VERTICAL_STEP,
        });
      }
    }
    candidates.sort((a, b) => {
      const aVertical = Math.abs(a.y - desired.y);
      const bVertical = Math.abs(b.y - desired.y);
      if (aVertical !== bVertical) return aVertical - bVertical;
      return Math.abs(a.x - desired.x) - Math.abs(b.x - desired.x);
    });
    const available = candidates.find((candidate) => !occupied.some((position) => overlaps(position, candidate)));
    if (available) return available;
  }

  // This is practically unreachable, but keeps placement total even on very dense imports.
  return { x: desired.x + HORIZONTAL_STEP * 49, y: desired.y };
}
