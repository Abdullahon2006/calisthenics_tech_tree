import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExerciseNode, ExerciseStatus, BranchId } from '../types/techTree';
import { ExerciseNodeCard } from './ExerciseNodeCard';
import { computeVelocity, projectMomentum, rubberband, springCriticallyDamped, PointerSample } from '../utils/springPhysics';
import { Minus, Plus, LocateFixed } from 'lucide-react';
import { playTapSound, playTickSound } from '../utils/audio';
import { TREE_NODE_HEIGHT, TREE_NODE_WIDTH } from '../utils/treeLayout';

interface TechTreeCanvasProps {
  exercises: ExerciseNode[];
  statusMap: Map<string, ExerciseStatus>;
  selectedExercise: ExerciseNode | null;
  activeBranchFilter: BranchId | 'all';
  onSelectExercise: (exercise: ExerciseNode) => void;
}

type Transform = { x: number; y: number; scale: number };

const CARD_WIDTH = TREE_NODE_WIDTH;
const CARD_HEIGHT = TREE_NODE_HEIGHT;
const INITIAL_TRANSFORM: Transform = { x: 40, y: -420, scale: 0.78 };
const BASE_BOUNDS = { minX: -100, maxX: 3250, minY: -50, maxY: 1500 };
const TIER_GUIDES = [
  { y: 100, label: 'Mastery', detail: 'Tier V' },
  { y: 360, label: 'Elite', detail: 'Tier IV' },
  { y: 640, label: 'Advanced', detail: 'Tier III' },
  { y: 920, label: 'Build', detail: 'Tier II' },
  { y: 1200, label: 'Foundations', detail: 'Tier I' },
];

const isMotionReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const TechTreeCanvas: React.FC<TechTreeCanvasProps> = ({
  exercises,
  statusMap,
  selectedExercise,
  activeBranchFilter,
  onSelectExercise,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const transformRef = useRef<Transform>(INITIAL_TRANSFORM);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startTransform = useRef<Transform>(INITIAL_TRANSFORM);
  const samples = useRef<PointerSample[]>([]);

  const displayedExercises = useMemo(
    () => exercises.filter((exercise) => activeBranchFilter === 'all' || exercise.branch === activeBranchFilter),
    [activeBranchFilter, exercises]
  );
  const displayedIds = useMemo(() => new Set(displayedExercises.map((exercise) => exercise.id)), [displayedExercises]);
  const exerciseMap = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), [exercises]);
  const worldBounds = useMemo(() => exercises.reduce((bounds, exercise) => ({
    minX: Math.min(bounds.minX, exercise.x - 120),
    maxX: Math.max(bounds.maxX, exercise.x + 120),
    minY: Math.min(bounds.minY, exercise.y - 120),
    maxY: Math.max(bounds.maxY, exercise.y + 120),
  }), BASE_BOUNDS), [exercises]);

  const commitTransform = useCallback((next: Transform) => {
    transformRef.current = next;
    setTransform(next);
  }, []);

  const cameraBounds = useCallback((scale: number) => {
    const viewport = containerRef.current;
    const width = viewport?.clientWidth ?? window.innerWidth;
    const height = viewport?.clientHeight ?? window.innerHeight;
    const inset = 72;
    return {
      minX: width - (worldBounds.maxX + CARD_WIDTH) * scale - inset,
      maxX: -worldBounds.minX * scale + inset,
      minY: height - (worldBounds.maxY + CARD_HEIGHT) * scale - inset,
      maxY: -worldBounds.minY * scale + inset,
    };
  }, [worldBounds]);

  const constrainTransform = useCallback((candidate: Transform, soften = false): Transform => {
    const bounds = cameraBounds(candidate.scale);
    const viewport = containerRef.current;
    const width = viewport?.clientWidth ?? window.innerWidth;
    const height = viewport?.clientHeight ?? window.innerHeight;
    const constrainAxis = (value: number, min: number, max: number, dimension: number) => {
      if (value < min) return soften ? min + rubberband(value - min, dimension) : min;
      if (value > max) return soften ? max + rubberband(value - max, dimension) : max;
      return value;
    };
    return {
      ...candidate,
      x: constrainAxis(candidate.x, bounds.minX, bounds.maxX, width),
      y: constrainAxis(candidate.y, bounds.minY, bounds.maxY, height),
    };
  }, [cameraBounds]);

  const cancelCameraAnimation = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, []);

  const settleCamera = useCallback((target: Transform, velocity = { x: 0, y: 0 }) => {
    cancelCameraAnimation();
    const constrainedTarget = constrainTransform(target);
    if (isMotionReduced()) {
      commitTransform(constrainedTarget);
      return;
    }

    let current = transformRef.current;
    let velocityX = velocity.x;
    let velocityY = velocity.y;
    let lastTime = performance.now();
    const step = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const x = springCriticallyDamped(current.x, constrainedTarget.x, velocityX, 0.32, delta);
      const y = springCriticallyDamped(current.y, constrainedTarget.y, velocityY, 0.32, delta);
      current = { x: x.position, y: y.position, scale: constrainedTarget.scale };
      velocityX = x.velocity;
      velocityY = y.velocity;
      commitTransform(current);
      if (x.settled && y.settled) {
        animationFrameId.current = null;
        return;
      }
      animationFrameId.current = requestAnimationFrame(step);
    };
    animationFrameId.current = requestAnimationFrame(step);
  }, [cancelCameraAnimation, commitTransform, constrainTransform]);

  useEffect(() => () => cancelCameraAnimation(), [cancelCameraAnimation]);

  useEffect(() => {
    if (!selectedExercise || !containerRef.current) return;
    const viewport = containerRef.current;
    const current = transformRef.current;
    settleCamera({
      x: viewport.clientWidth / 2 - (selectedExercise.x + CARD_WIDTH / 2) * current.scale,
      y: viewport.clientHeight / 2 - (selectedExercise.y + CARD_HEIGHT / 2) * current.scale,
      scale: current.scale,
    });
  }, [selectedExercise?.id, settleCamera]);

  const zoomAt = useCallback((factor: number, clientX?: number, clientY?: number) => {
    const viewport = containerRef.current;
    if (!viewport) return;
    const current = transformRef.current;
    const rect = viewport.getBoundingClientRect();
    const focalX = clientX === undefined ? rect.width / 2 : clientX - rect.left;
    const focalY = clientY === undefined ? rect.height / 2 : clientY - rect.top;
    const scale = Math.min(1.55, Math.max(0.48, current.scale * factor));
    commitTransform(constrainTransform({
      scale,
      x: focalX - (focalX - current.x) * (scale / current.scale),
      y: focalY - (focalY - current.y) * (scale / current.scale),
    }));
  }, [commitTransform, constrainTransform]);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    cancelCameraAnimation();
    zoomAt(event.deltaY < 0 ? 1.1 : 0.91, event.clientX, event.clientY);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    cancelCameraAnimation();
    isDragging.current = true;
    dragStart.current = { x: event.clientX, y: event.clientY };
    startTransform.current = transformRef.current;
    samples.current = [{ time: performance.now(), x: event.clientX, y: event.clientY }];
    containerRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDragging.current) return;
    const next = constrainTransform({
      ...startTransform.current,
      x: startTransform.current.x + event.clientX - dragStart.current.x,
      y: startTransform.current.y + event.clientY - dragStart.current.y,
    }, true);
    samples.current.push({ time: performance.now(), x: event.clientX, y: event.clientY });
    if (samples.current.length > 8) samples.current.shift();
    commitTransform(next);
  };

  const endPointerInteraction = (event: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try { containerRef.current?.releasePointerCapture(event.pointerId); } catch { /* browser released capture */ }
    const { vx, vy } = computeVelocity(samples.current);
    const current = transformRef.current;
    settleCamera({
      ...current,
      x: current.x + projectMomentum(vx, 0.994),
      y: current.y + projectMomentum(vy, 0.994),
    }, { x: vx, y: vy });
  };

  const resetView = () => {
    playTapSound();
    settleCamera(INITIAL_TRANSFORM);
  };

  const handleCanvasKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = transformRef.current;
    const step = 80;
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomAt(1.12); return; }
    if (event.key === '-') { event.preventDefault(); zoomAt(0.89); return; }
    if (event.key === '0') { event.preventDefault(); resetView(); return; }
    const moves: Record<string, Partial<Transform>> = {
      ArrowLeft: { x: current.x + step }, ArrowRight: { x: current.x - step },
      ArrowUp: { y: current.y + step }, ArrowDown: { y: current.y - step },
    };
    if (moves[event.key]) {
      event.preventDefault();
      settleCamera({ ...current, ...moves[event.key] });
    }
  };

  const connectionLines = useMemo(() => displayedExercises.flatMap((target) => target.prerequisites.flatMap((sourceId) => {
    if (!displayedIds.has(sourceId)) return [];
    const source = exerciseMap.get(sourceId);
    if (!source) return [];
    const sourceStatus = statusMap.get(sourceId) || 'locked';
    const complete = sourceStatus === 'mastered';
    const available = sourceStatus === 'unlocked' || complete;
    const x1 = source.x + CARD_WIDTH / 2;
    const y1 = source.y;
    const x2 = target.x + CARD_WIDTH / 2;
    const y2 = target.y + CARD_HEIGHT;
    const control = Math.max(44, (y1 - y2) * 0.42);
    return [<path key={`${sourceId}-${target.id}`} d={`M ${x1} ${y1} C ${x1} ${y1 - control}, ${x2} ${y2 + control}, ${x2} ${y2}`} fill="none" stroke={complete ? '#F5C542' : available ? 'rgba(226, 232, 240, 0.48)' : 'rgba(148, 163, 184, 0.16)'} strokeWidth={complete ? 2.25 : 1.25} strokeDasharray={available ? undefined : '5 7'} strokeLinecap="round" />];
  })), [displayedExercises, displayedIds, exerciseMap, statusMap]);

  return (
    <div ref={containerRef} role="application" tabIndex={0} aria-label="Calisthenics movement map. Drag to pan. Use arrow keys to pan, plus and minus to zoom, and zero to reset the view." onKeyDown={handleCanvasKeyDown} onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={endPointerInteraction} onPointerCancel={endPointerInteraction} className="tech-tree-canvas relative h-full w-full select-none overflow-hidden cursor-grab active:cursor-grabbing focus:outline-none">
      <div className="pointer-events-none absolute left-5 top-5 z-20 hidden sm:block">
        <p className="text-sm font-semibold text-slate-100">Movement map</p>
        <p className="mt-0.5 text-xs text-slate-500">Drag to explore · {displayedExercises.length} skills</p>
      </div>
      <div className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})` }}>
        {TIER_GUIDES.map((tier) => <div key={tier.label} className="tier-guide absolute left-0 flex items-center" style={{ top: `${tier.y + 64}px`, width: '3260px' }}><div className="w-44 pl-5"><p className="text-[13px] font-semibold text-slate-400">{tier.label}</p><p className="mt-0.5 text-[10px] text-slate-600">{tier.detail}</p></div><div className="h-px flex-1 bg-slate-700/35" /></div>)}
        <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width="3500" height="1600" aria-hidden="true">{connectionLines}</svg>
        {displayedExercises.map((exercise) => <div key={exercise.id} className="absolute" style={{ left: `${exercise.x}px`, top: `${exercise.y}px`, width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}><ExerciseNodeCard exercise={exercise} status={statusMap.get(exercise.id) || 'locked'} isSelected={selectedExercise?.id === exercise.id} onClick={onSelectExercise} /></div>)}
      </div>
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1 rounded-xl border border-white/10 bg-(--surface)/95 p-1 shadow-lg">
        <button type="button" aria-label="Zoom out" onClick={() => { playTickSound(380); zoomAt(0.82); }} className="canvas-control"><Minus className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" aria-label="Reset map view" onClick={resetView} className="canvas-control"><LocateFixed className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" aria-label="Zoom in" onClick={() => { playTickSound(520); zoomAt(1.22); }} className="canvas-control"><Plus className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </div>
  );
};
