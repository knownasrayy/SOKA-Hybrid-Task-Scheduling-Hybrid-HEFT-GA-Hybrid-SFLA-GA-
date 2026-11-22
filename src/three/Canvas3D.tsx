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

  // Camera animation interpolation state
  const currentPos = useRef(new THREE.Vector3(0, 14, 26));
  const targetPos = useRef(new THREE.Vector3(0, 14, 26));
  const currentLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));

  // Mouse orbit controls in Explore mode
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const orbitTheta = useRef(0);
  const orbitPhi = useRef(Math.PI / 4);
  const orbitRadius = useRef(25);

  const [hoveredInfo, setHoveredInfo] = useState<RaycastHit | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<RaycastHit | null>(null);

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: qualityMode === 'high',
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, qualityMode === 'high' ? 2 : 1.5));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const world = new WorldScene();
    sceneRef.current = world;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 14, 26);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Raycaster for mouse picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle Explore mode orbit dragging
      if (isExploreMode && isDragging.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        orbitTheta.current -= deltaX * 0.006;
        orbitPhi.current = Math.max(0.1, Math.min(Math.PI / 2.1, orbitPhi.current + deltaY * 0.006));

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }

      // Raycast objects
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
          if (onHoverObject) onHoverObject(hit);
          return;
        }
      }
      setHoveredInfo(null);
      if (onHoverObject) onHoverObject(null);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && isExploreMode) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isExploreMode) {
        orbitRadius.current = Math.max(8, Math.min(60, orbitRadius.current + e.deltaY * 0.02));
      }
    };

    const handleClick = (e: MouseEvent) => {
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
    container.addEventListener('wheel', handleWheel);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update scene entities
      world.update(elapsedTime);

      if (isExploreMode) {
        // Orbit camera calculations
        const x = targetLookAt.current.x + orbitRadius.current * Math.sin(orbitPhi.current) * Math.sin(orbitTheta.current);
        const y = targetLookAt.current.y + orbitRadius.current * Math.cos(orbitPhi.current);
        const z = targetLookAt.current.z + orbitRadius.current * Math.sin(orbitPhi.current) * Math.cos(orbitTheta.current);
        camera.position.set(x, y, z);
        camera.lookAt(targetLookAt.current);
      } else {
        // Smooth Waypoint Interpolation (lerp)
        currentPos.current.lerp(targetPos.current, 0.05);
        currentLookAt.current.lerp(targetLookAt.current, 0.05);
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
    orbitTheta.current = 0;
    orbitPhi.current = Math.PI / 4;
    orbitRadius.current = 25;
    targetPos.current.set(wp.position[0], wp.position[1], wp.position[2]);
    targetLookAt.current.set(wp.target[0], wp.target[1], wp.target[2]);
    currentPos.current.copy(targetPos.current);
    currentLookAt.current.copy(targetLookAt.current);
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

      {/* 3D Raycast Tooltip */}
      {hoveredInfo && (
        <div className="absolute top-4 left-4 z-30 its-glass border border-its-blue-light/50 px-3.5 py-2 rounded-xl text-xs font-mono shadow-its-glow pointer-events-none fade-in">
          <div className="font-bold text-its-gold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-its-gold animate-ping" />
            <span>{hoveredInfo.name}</span>
          </div>
          <div className="text-its-silver text-[11px] mt-0.5">{hoveredInfo.details}</div>
        </div>
      )}

      {/* Selected Entity Inspector Panel (Follow & Telemetry) */}
      {selectedInfo && (
        <div className="absolute bottom-6 left-6 z-40 its-glass-heavy border border-its-gold/80 px-4 py-3.5 rounded-2xl text-xs font-mono shadow-its-gold max-w-sm fade-in">
          <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-its-gold/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-its-gold animate-ping" />
              <span className="font-black text-white text-sm">{selectedInfo.name}</span>
            </div>
            <button
              onClick={() => setSelectedInfo(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-its-silver hover:text-white cursor-pointer"
              title="Tutup Inspeksi"
            >
              ✕
            </button>
          </div>
          <div className="text-its-silver text-xs leading-relaxed">{selectedInfo.details}</div>
          <div className="mt-2.5 pt-2 border-t border-its-blue/20 text-[10px] text-its-blue-light font-bold flex items-center justify-between">
            <span className="uppercase tracking-wider">Tipe: {selectedInfo.type}</span>
            <span className="text-its-gold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-its-gold" />
              Kamera Terfokus
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
