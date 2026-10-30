import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LivingTripGlobeProps {
  fromCity?: string;
  toCity?: string;
  className?: string;
}

export const LivingTripGlobe: React.FC<LivingTripGlobeProps> = ({
  fromCity = 'Chennai',
  toCity = 'Ooty',
  className = 'w-full h-72 sm:h-96',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    // Detect software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0f2744, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 4, 3);
    scene.add(dirLight);

    const orangeRim = new THREE.PointLight(0xff7a1a, 3.5, 10);
    orangeRim.position.set(-3, -2, 2);
    scene.add(orangeRim);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Low-poly Ocean Sphere
    const oceanGeo = new THREE.IcosahedronGeometry(1.6, 3);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0b1f3a,
      roughness: 0.65,
      metalness: 0.25,
      flatShading: true,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    globeGroup.add(ocean);

    // Procedural Landmass Nodes (Icosahedron surface bumps)
    const landCount = 65;
    const landGeo = new THREE.DodecahedronGeometry(0.12, 0);
    const landMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true,
    });
    const landGroup = new THREE.Group();

    for (let i = 0; i < landCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / landCount);
      const theta = Math.sqrt(landCount * Math.PI) * phi;
      const x = 1.62 * Math.cos(theta) * Math.sin(phi);
      const y = 1.62 * Math.sin(theta) * Math.sin(phi);
      const z = 1.62 * Math.cos(phi);

      const mesh = new THREE.Mesh(landGeo, landMat);
      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      landGroup.add(mesh);
    }
    globeGroup.add(landGroup);

    // Glowing India & Tamil Nadu Marker
    const indiaGeo = new THREE.CylinderGeometry(0.08, 0.02, 0.35, 6);
    const indiaMat = new THREE.MeshStandardMaterial({
      color: 0xff7a1a,
      emissive: 0xff7a1a,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const indiaMarker = new THREE.Mesh(indiaGeo, indiaMat);
    // Orient roughly towards India's latitude/longitude on globe
    indiaMarker.position.set(0.65, 0.45, 1.45);
    indiaMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), indiaMarker.position.clone().normalize());
    globeGroup.add(indiaMarker);

    // Second destination pin (e.g. Ooty/Nilgiris)
    const destGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const destMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6 });
    const destMarker = new THREE.Mesh(destGeo, destMat);
    destMarker.position.set(0.55, 0.38, 1.50);
    globeGroup.add(destMarker);

    // Curved Flight Route Arc
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.65, 0.45, 1.45),
      new THREE.Vector3(0.9, 0.8, 1.6),
      new THREE.Vector3(0.55, 0.38, 1.50)
    );
    const points = curve.getPoints(30);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xff7a1a,
      dashSize: 0.05,
      gapSize: 0.03,
      linewidth: 2,
    });
    const routeLine = new THREE.Line(lineGeo, lineMat);
    routeLine.computeLineDistances();
    globeGroup.add(routeLine);

    // Low-poly Aeroplane
    const planeGroup = new THREE.Group();
    // Fuselage
    const fuseGeo = new THREE.ConeGeometry(0.05, 0.22, 5);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.5 });
    const fuse = new THREE.Mesh(fuseGeo, planeMat);
    fuse.rotation.x = Math.PI / 2;
    planeGroup.add(fuse);
    // Wings
    const wingGeo = new THREE.BoxGeometry(0.24, 0.015, 0.07);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xff7a1a });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0, 0.02);
    planeGroup.add(wings);
    planeGroup.scale.set(0.6, 0.6, 0.6);
    globeGroup.add(planeGroup);

    // Outer Atmospheric Glow Ring
    const haloGeo = new THREE.RingGeometry(1.68, 1.82, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0, -0.2);
    scene.add(halo);

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotX = 0.2;
    let rotY = -0.4;
    let targetRotX = 0.2;
    let targetRotY = -0.4;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize listener
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId = 0;
    let progress = 0;

    const tick = () => {
      // Gentle auto-rotation when not dragging
      if (!isDragging) {
        targetRotY += 0.003;
      }

      // Smooth damping
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;
      rotX = Math.max(-0.9, Math.min(0.9, rotX)); // clamp pitch
      globeGroup.rotation.x = rotX;
      globeGroup.rotation.y = rotY;

      // Plane movement along curved route
      progress = (progress + 0.006) % 1;
      const pos = curve.getPointAt(progress);
      planeGroup.position.copy(pos);
      const tangent = curve.getTangentAt(progress);
      planeGroup.lookAt(pos.clone().add(tangent));

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      oceanGeo.dispose();
      oceanMat.dispose();
      landGeo.dispose();
      landMat.dispose();
      indiaGeo.dispose();
      indiaMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fromCity, toCity]);

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pointer-events-none bg-white/40 dark:bg-slate-900/40 backdrop-blur px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-white/10">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF7A1A]" />
          <span>Origin: {fromCity}</span>
        </span>
        <span className="text-[10px] text-[#14B8A6] font-medium tracking-wide">● LIVE 3D ROUTE</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
          <span>Destination: {toCity}</span>
        </span>
      </div>
    </div>
  );
};
