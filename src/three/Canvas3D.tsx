import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WorldScene, RaycastHit } from './WorldScene';
import { WAYPOINTS, Waypoint } from './camera/waypoints';

interface Canvas3DProps {
  currentSlide: number;
  isExploreMode: boolean;
  qualityMode?: 'high' | 'balanced' | 'perf';
  resetKey?: number;
  onHoverObject?: (hit: RaycastHit | null) => void;
  className?: string;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({
  currentSlide,
  isExploreMode,
  qualityMode = 'balanced',
  resetKey = 0,
  onHoverObject,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<WorldScene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Keep latest explore mode in ref so event listeners & animation loop always read fresh state
  const isExploreRef = useRef(isExploreMode);
  useEffect(() => {
    isExploreRef.current = isExploreMode;
    if (isExploreMode) {
      // Initialize orbit spherical coords smoothly from current camera relative to target
      const offset = new THREE.Vector3().subVectors(currentPos.current, currentLookAt.current);
      orbitRadius.current = Math.max(8, Math.min(60, offset.length()));
      orbitPhi.current = Math.max(0.15, Math.min(Math.PI / 2.05, Math.acos(THREE.MathUtils.clamp(offset.y / (orbitRadius.current || 1), -1, 1))));
      orbitTheta.current = Math.atan2(offset.x, offset.z);
    }
  }, [isExploreMode]);

  // Camera animation interpolation state
  const currentPos = useRef(new THREE.Vector3(0, 17, 36));
  const targetPos = useRef(new THREE.Vector3(0, 17, 36));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.5, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.5, 0));

  // Mouse orbit controls in Explore mode
  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const orbitTheta = useRef(0);
  const orbitPhi = useRef(Math.PI / 3.2);
  const orbitRadius = useRef(36);

  const [hoveredInfo, setHoveredInfo] = useState<RaycastHit | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<RaycastHit | null>(null);

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: qualityMode !== 'perf',
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, qualityMode === 'high' ? 2 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const world = new WorldScene();
    sceneRef.current = world;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
    cameraRef.current = camera;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isExploreRef.current && isDragging.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;
        dragDistance.current += Math.abs(deltaX) + Math.abs(deltaY);

        orbitTheta.current -= deltaX * 0.006;
        orbitPhi.current = Math.max(0.15, Math.min(Math.PI / 2.05, orbitPhi.current - deltaY * 0.006));

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
        return;
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(world.getIntersectables(), true);
      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        if (hitObj.userData && hitObj.userData.name) {
          const hit: RaycastHit = {
            type: hitObj.userData.type || 'task',
            id: hitObj.id,
            name: hitObj.userData.name,
            details: hitObj.userData.details || ''
          };
          setHoveredInfo(hit);
          renderer.domElement.style.cursor = 'pointer';
          if (onHoverObject) onHoverObject(hit);
          return;
        }
      }
      setHoveredInfo(null);
      renderer.domElement.style.cursor = isExploreRef.current ? 'grab' : 'default';
      if (onHoverObject) onHoverObject(null);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && isExploreRef.current) {
        isDragging.current = true;
        dragDistance.current = 0;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isExploreRef.current) {
        e.preventDefault();
        orbitRadius.current = Math.max(8, Math.min(60, orbitRadius.current + e.deltaY * 0.025));
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (dragDistance.current > 6) return;
      if (e.target !== renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(world.getIntersectables(), true);
      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        if (hitObj.userData && hitObj.userData.name) {
          const hit: RaycastHit = {
            type: hitObj.userData.type || 'task',
            id: hitObj.id,
            name: hitObj.userData.name,
            details: hitObj.userData.details || ''
          };
          setSelectedInfo(hit);
          const worldPos = new THREE.Vector3();
          hitObj.getWorldPosition(worldPos);
          targetLookAt.current.copy(worldPos);
          return;
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      world.update(elapsedTime);

      if (isExploreRef.current) {
        currentLookAt.current.lerp(targetLookAt.current, 0.08);
        const x = currentLookAt.current.x + orbitRadius.current * Math.sin(orbitPhi.current) * Math.sin(orbitTheta.current);
        const y = currentLookAt.current.y + orbitRadius.current * Math.cos(orbitPhi.current);
        const z = currentLookAt.current.z + orbitRadius.current * Math.sin(orbitPhi.current) * Math.cos(orbitTheta.current);
        currentPos.current.set(x, y, z);
        camera.position.copy(currentPos.current);
        camera.lookAt(currentLookAt.current);
      } else {
        // Gentle cinematic breathing parallax around waypoint
        const driftX = Math.sin(elapsedTime * 0.25) * 0.35;
        const driftY = Math.cos(elapsedTime * 0.2) * 0.2;
        const desiredPos = new THREE.Vector3(
          targetPos.current.x + driftX,
          targetPos.current.y + driftY,
          targetPos.current.z
        );
        currentPos.current.lerp(desiredPos, 0.055);
        currentLookAt.current.lerp(targetLookAt.current, 0.06);
        camera.position.copy(currentPos.current);
        camera.lookAt(currentLookAt.current);
      }

      renderer.render(world.scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [qualityMode]);

  // Update Waypoint when slide changes
  useEffect(() => {
    const wp: Waypoint = WAYPOINTS[currentSlide] || WAYPOINTS[1];
    targetPos.current.set(wp.position[0], wp.position[1], wp.position[2]);
    targetLookAt.current.set(wp.target[0], wp.target[1], wp.target[2]);

    if (cameraRef.current) {
      cameraRef.current.fov = wp.fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [currentSlide]);

  // Reset Camera trigger
  useEffect(() => {
    if (resetKey === 0) return;
    const wp: Waypoint = WAYPOINTS[currentSlide] || WAYPOINTS[1];
    targetPos.current.set(wp.position[0], wp.position[1], wp.position[2]);
    targetLookAt.current.set(wp.target[0], wp.target[1], wp.target[2]);
    currentPos.current.copy(targetPos.current);
    currentLookAt.current.copy(targetLookAt.current);
    const offset = new THREE.Vector3().subVectors(targetPos.current, targetLookAt.current);
    orbitRadius.current = offset.length();
    orbitPhi.current = Math.acos(THREE.MathUtils.clamp(offset.y / (orbitRadius.current || 1), -1, 1));
    orbitTheta.current = Math.atan2(offset.x, offset.z);
    if (cameraRef.current) {
      cameraRef.current.position.copy(targetPos.current);
      cameraRef.current.lookAt(targetLookAt.current);
      cameraRef.current.fov = wp.fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [resetKey, currentSlide]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* 3D Raycast Hover Tooltip (Bright Frosted ITS Style) */}
      {hoveredInfo && (
        <div className="absolute top-16 left-4 z-30 its-glass-heavy border border-its-blue/40 px-3.5 py-2.5 rounded-xl text-xs font-mono shadow-its-card pointer-events-none fade-in max-w-xs">
          <div className="font-extrabold text-its-blue flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-its-gold" />
            <span>{hoveredInfo.name}</span>
          </div>
          <div className="text-its-navy/80 text-[11px] mt-1 leading-snug">{hoveredInfo.details}</div>
          <div className="text-[10px] text-its-blue font-bold mt-1">Klik objek untuk mengunci fokus kamera</div>
        </div>
      )}

      {/* Selected Entity Inspector Panel */}
      {selectedInfo && (
        <div className="absolute top-16 right-4 z-40 its-glass-heavy border-2 border-its-gold px-4 py-3.5 rounded-2xl text-xs font-mono shadow-its-card max-w-sm fade-in">
          <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-its-blue/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-its-gold animate-pulse" />
              <span className="font-black text-its-navy text-sm">{selectedInfo.name}</span>
            </div>
            <button
              onClick={() => setSelectedInfo(null)}
              className="px-1.5 py-0.5 rounded-lg hover:bg-its-slate text-its-silver hover:text-its-navy cursor-pointer font-bold"
              title="Tutup Inspeksi"
            >
              ✕
            </button>
          </div>
          <div className="text-its-silver text-xs leading-relaxed font-sans">{selectedInfo.details}</div>
          <div className="mt-2.5 pt-2 border-t border-its-blue/15 text-[10px] text-its-blue font-bold flex items-center justify-between">
            <span className="uppercase tracking-wider">Tipe: {selectedInfo.type}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">Kamera Terfokus</span>
          </div>
        </div>
      )}
    </div>
  );
};
