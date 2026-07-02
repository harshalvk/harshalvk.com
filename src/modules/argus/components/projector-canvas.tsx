// src/modules/lab/components/projector-canvas.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { DataPoint, ProjectedPoint } from '@/modules/argus/types/projector';

// ── Circular point sprite texture (canvas-generated, no asset needed) ──────

function createCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.7, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function ProjectorCanvas({
  points,
  projected,
  colorOf,
  selectedId,
  onSelect,
  onHover,
  pointSize = 0.18,
  autoRotate = false,
  showGrid = true,
  backgroundColor,
}: {
  points: DataPoint[];
  projected: ProjectedPoint[];
  colorOf: (p: DataPoint) => string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  pointSize?: number;
  autoRotate?: boolean;
  showGrid?: boolean;
  backgroundColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    points: THREE.Points;
    material: THREE.PointsMaterial;
    grid: THREE.GridHelper;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    idsByIndex: string[];
    flyTarget: THREE.Vector3 | null;
  } | null>(null);

  // Setup scene once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 18, 40);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(12, 10, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 3;
    controls.maxDistance = 40;

    const grid = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    (grid.material as THREE.Material).opacity = 0.12;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    const sprite = createCircleTexture();
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      size: pointSize,
      map: sprite,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      alphaTest: 0.1,
      depthWrite: true,
    });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points!.threshold = 0.25;
    const mouse = new THREE.Vector2();

    sceneRef.current = {
      renderer,
      camera,
      controls,
      points: pointCloud,
      material,
      grid,
      raycaster,
      mouse,
      idsByIndex: [],
      flyTarget: null,
    };

    let frameId: number;
    const animate = () => {
      controls.update();

      // Smoothly ease the camera target toward a selected point, if one is pending.
      const ctx = sceneRef.current;
      if (ctx?.flyTarget) {
        controls.target.lerp(ctx.flyTarget, 0.08);
        if (controls.target.distanceTo(ctx.flyTarget) < 0.02) {
          ctx.flyTarget = null;
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live-update tunables without rebuilding the scene.
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    ctx.material.size = pointSize;
    ctx.controls.autoRotate = autoRotate;
    ctx.controls.autoRotateSpeed = 1.2;
    ctx.grid.visible = showGrid;
  }, [pointSize, autoRotate, showGrid]);

  // Update point positions/colors when data changes.
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;

    const positions = new Float32Array(projected.length * 3);
    const colors = new Float32Array(projected.length * 3);
    const idsByIndex: string[] = [];

    projected.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;

      const point = points.find((pt) => pt.id === p.id);
      const color = new THREE.Color(point ? colorOf(point) : '#6366f1');

      const isSelected = p.id === selectedId;
      const c = isSelected ? color.clone().offsetHSL(0, 0, 0.3) : color;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      idsByIndex.push(p.id);
    });

    ctx.points.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ctx.points.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    ctx.points.geometry.computeBoundingSphere();
    ctx.idsByIndex = idsByIndex;
  }, [projected, points, colorOf, selectedId]);

  // Fly camera toward the selected point.
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx || !selectedId) return;

    const idx = ctx.idsByIndex.indexOf(selectedId);
    if (idx === -1) return;

    const posAttr = ctx.points.geometry.getAttribute('position');
    ctx.flyTarget = new THREE.Vector3(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
  }, [selectedId]);

  // Pointer interactions — throttled via rAF so raycasting doesn't run on every mousemove.
  useEffect(() => {
    const ctx = sceneRef.current;
    const container = containerRef.current;
    if (!ctx || !container) return;

    let pending: PointerEvent | null = null;
    let ticking = false;

    const resolveIntersection = (event: PointerEvent): string | null => {
      const rect = container.getBoundingClientRect();
      ctx.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ctx.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      ctx.raycaster.setFromCamera(ctx.mouse, ctx.camera);
      const intersects = ctx.raycaster.intersectObject(ctx.points);
      if (intersects.length === 0) return null;

      const index = intersects[0].index;
      return index !== undefined ? ctx.idsByIndex[index] : null;
    };

    const handleMove = (e: PointerEvent) => {
      pending = e;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (pending) onHover(resolveIntersection(pending));
        ticking = false;
      });
    };

    const handleClick = (e: PointerEvent) => onSelect(resolveIntersection(e));
    const handleLeave = () => onHover(null);

    container.addEventListener('pointermove', handleMove);
    container.addEventListener('pointerleave', handleLeave);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('pointermove', handleMove);
      container.removeEventListener('pointerleave', handleLeave);
      container.removeEventListener('click', handleClick);
    };
  }, [onHover, onSelect]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
    />
  );
}
