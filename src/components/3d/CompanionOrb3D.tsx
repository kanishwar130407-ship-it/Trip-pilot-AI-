import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CompanionOrb3DProps {
  isThinking?: boolean;
  hasAlert?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CompanionOrb3D: React.FC<CompanionOrb3DProps> = ({
  isThinking = false,
  hasAlert = false,
  className = 'w-14 h-14',
  onClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const size = container.clientWidth || 56;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Core Glowing Sphere
    const coreColor = hasAlert ? 0xef4444 : isThinking ? 0xff7a1a : 0x14b8a6;
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: isThinking,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Orbiting Particles (Representing Itinerary, Safety, Budget, Navigation)
    const particleCount = 12;
    const particles = new THREE.Group();
    const pGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(pGeo, pMat);
      particles.add(p);
    }
    scene.add(particles);

    // Light
    const light = new THREE.PointLight(coreColor, 2, 5);
    light.position.set(1, 1, 2);
    scene.add(light);

    let frameId = 0;
    let angle = 0;

    const tick = () => {
      const speed = isThinking ? 0.05 : 0.015;
      core.rotation.y += speed;
      core.rotation.x += speed * 0.7;

      angle += speed * 1.5;
      particles.children.forEach((p, idx) => {
        const offset = (idx / particleCount) * Math.PI * 2;
        const r = 1.1 + Math.sin(angle * 2 + idx) * 0.1;
        p.position.set(
          Math.cos(angle + offset) * r,
          Math.sin(angle * 1.5 + offset) * 0.5,
          Math.sin(angle + offset) * r
        );
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isThinking, hasAlert]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      className={`cursor-pointer active:scale-95 transition-transform ${className}`}
      title="TripPilot AI 3D Companion"
    />
  );
};
