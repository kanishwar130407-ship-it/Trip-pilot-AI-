import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RoadRisk3DProps {
  riskLevel: 'low' | 'medium' | 'high';
  className?: string;
}

export const RoadRisk3D: React.FC<RoadRisk3DProps> = ({ riskLevel, className = 'w-full h-44' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.8, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(3, 5, 2);
    scene.add(dir);

    // Color based on risk level:
    // Green (#14B8A6): Low
    // Amber (#F59E0B): Medium
    // Red (#EF4444): High
    const riskColor =
      riskLevel === 'high' ? 0xef4444 : riskLevel === 'medium' ? 0xf59e0b : 0x14b8a6;

    // Mountain hill landscape base (low poly green terrain)
    const terrainGeo = new THREE.PlaneGeometry(6, 4, 8, 6);
    // Add procedural hill bumps
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const z = Math.sin(posAttr.getX(i) * 1.5) * 0.35 + Math.cos(posAttr.getY(i) * 1.5) * 0.25;
      posAttr.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      flatShading: true,
      roughness: 0.9,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2.3;
    terrain.position.set(0, -0.2, 0);
    scene.add(terrain);

    // Winding hill road curve
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0.1, 1.4),
      new THREE.Vector3(-1.0, 0.3, 0.6),
      new THREE.Vector3(-0.2, 0.2, 0.9),
      new THREE.Vector3(0.8, 0.4, 0.2),
      new THREE.Vector3(0.3, 0.3, -0.6),
      new THREE.Vector3(1.8, 0.5, -1.2),
    ]);

    // Road ribbon tube
    const roadGeo = new THREE.TubeGeometry(roadCurve, 40, 0.16, 6, false);
    const roadMat = new THREE.MeshStandardMaterial({
      color: riskColor,
      emissive: riskColor,
      emissiveIntensity: 0.55,
      roughness: 0.3,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    scene.add(roadMesh);

    // Pine Trees on sides
    const treeGroup = new THREE.Group();
    const treeGeo = new THREE.ConeGeometry(0.12, 0.35, 5);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, flatShading: true });
    const treePositions = [
      [-1.8, 0.3, 0.8],
      [-0.8, 0.45, 0.2],
      [-0.4, 0.35, 1.3],
      [0.6, 0.45, 0.8],
      [1.2, 0.6, -0.4],
      [-1.2, 0.2, 1.6],
    ];
    treePositions.forEach(([x, y, z]) => {
      const tree = new THREE.Mesh(treeGeo, treeMat);
      tree.position.set(x, y + 0.15, z);
      treeGroup.add(tree);
    });
    scene.add(treeGroup);

    // Low-poly Car
    const carGroup = new THREE.Group();
    // Body
    const carBodyGeo = new THREE.BoxGeometry(0.24, 0.1, 0.14);
    const carBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2 });
    const carBody = new THREE.Mesh(carBodyGeo, carBodyMat);
    carGroup.add(carBody);
    // Roof / Cabin
    const roofGeo = new THREE.BoxGeometry(0.13, 0.08, 0.12);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x071427 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(-0.02, 0.08, 0);
    carGroup.add(roof);
    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 6);
    const wheelMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    [
      [-0.08, -0.04, 0.07],
      [0.08, -0.04, 0.07],
      [-0.08, -0.04, -0.07],
      [0.08, -0.04, -0.07],
    ].forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      carGroup.add(wheel);
    });

    scene.add(carGroup);

    let frameId = 0;
    let t = 0;

    const tick = () => {
      t = (t + 0.005) % 1;
      const point = roadCurve.getPointAt(t);
      carGroup.position.set(point.x, point.y + 0.12, point.z);

      const tangent = roadCurve.getTangentAt(t);
      carGroup.lookAt(point.clone().add(tangent));

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
      terrainGeo.dispose();
      terrainMat.dispose();
      roadGeo.dispose();
      roadMat.dispose();
      treeGeo.dispose();
      treeMat.dispose();
      carBodyGeo.dispose();
      carBodyMat.dispose();
      roofGeo.dispose();
      roofMat.dispose();
      wheelGeo.dispose();
      wheelMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [riskLevel]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-2 left-3 flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            riskLevel === 'high'
              ? 'bg-[#EF4444] animate-ping'
              : riskLevel === 'medium'
              ? 'bg-[#F59E0B]'
              : 'bg-[#14B8A6]'
          }`}
        />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
          {riskLevel === 'high'
            ? 'High Ghat Risk (Fog & Hairpins)'
            : riskLevel === 'medium'
            ? 'Moderate Ghat Road Caution'
            : 'Safe Hill Sector'}
        </span>
      </div>
    </div>
  );
};
