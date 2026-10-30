import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AirshipsComparison3DProps {
  selectedPackageId: string;
  onSelectPackage?: (id: 'budget' | 'standard' | 'premium' | 'family') => void;
  className?: string;
}

export const AirshipsComparison3D: React.FC<AirshipsComparison3DProps> = ({
  selectedPackageId,
  onSelectPackage,
  className = 'w-full h-48 sm:h-56',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(4, 5, 3);
    scene.add(dir);

    // 4 Airships: Budget, Standard (AI Best), Premium, Family
    const airshipConfigs = [
      { id: 'budget', x: -2.4, color: 0x64748b, name: 'Budget' },
      { id: 'standard', x: -0.8, color: 0xff7a1a, name: 'Standard (Best)' },
      { id: 'family', x: 0.8, color: 0x14b8a6, name: 'Family' },
      { id: 'premium', x: 2.4, color: 0x8b5cf6, name: 'Premium' },
    ];

    const airshipMeshes: THREE.Group[] = [];

    airshipConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      group.position.set(cfg.x, 0, 0);

      // Low-poly Zeppelin gas bag
      const balloonGeo = new THREE.ConeGeometry(0.35, 1.2, 7);
      const balloonMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.4,
        metalness: 0.2,
        flatShading: true,
      });
      const balloon = new THREE.Mesh(balloonGeo, balloonMat);
      balloon.rotation.z = Math.PI / 2;
      group.add(balloon);

      // Gondola cabin underneath
      const gondolaGeo = new THREE.BoxGeometry(0.35, 0.12, 0.15);
      const gondolaMat = new THREE.MeshStandardMaterial({ color: 0x071427 });
      const gondola = new THREE.Mesh(gondolaGeo, gondolaMat);
      gondola.position.set(0, -0.28, 0);
      group.add(gondola);

      // Tail fins
      const finGeo = new THREE.BoxGeometry(0.18, 0.18, 0.02);
      const fin = new THREE.Mesh(finGeo, balloonMat);
      fin.position.set(-0.55, 0, 0);
      group.add(fin);

      // Special glowing ring for Standard (AI Best for you)
      if (cfg.id === 'standard') {
        const ringGeo = new THREE.TorusGeometry(0.48, 0.03, 8, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xff7a1a });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.y = Math.PI / 2;
        group.add(ring);
      }

      scene.add(group);
      airshipMeshes.push(group);
    });

    let frameId = 0;
    let time = 0;

    const tick = () => {
      time += 0.02;
      airshipMeshes.forEach((ship, idx) => {
        const isSelected = airshipConfigs[idx].id === selectedPackageId;
        // Bobbing gently up and down
        ship.position.y = Math.sin(time + idx * 1.2) * 0.12 + (isSelected ? 0.3 : 0);
        ship.position.z = isSelected ? 0.6 : 0;
        ship.rotation.z = Math.sin(time * 0.8 + idx) * 0.04;
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedPackageId]);

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-900/40 border border-slate-700/50 backdrop-blur-md ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-2 left-4 text-xs font-semibold text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FF7A1A] animate-pulse" />
        <span>3D Package Airships • AI Recommended Standard is highlighted</span>
      </div>
      <div className="absolute bottom-2 inset-x-0 flex justify-around text-[10px] text-slate-400 font-medium px-4 pointer-events-none">
        <span>Budget ₹9.8k</span>
        <span className="text-[#FF7A1A] font-bold">Standard ₹12.4k (Best)</span>
        <span>Family ₹14.6k</span>
        <span>Premium ₹16.9k</span>
      </div>
    </div>
  );
};
