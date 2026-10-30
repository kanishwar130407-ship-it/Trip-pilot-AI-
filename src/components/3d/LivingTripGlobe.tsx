import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Sparkles, Check, Globe } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface LivingTripGlobeProps {
  fromCity?: string;
  toCity?: string;
  className?: string;
}

interface GlobePin {
  id: string;
  name: string;
  nameTa: string;
  country: string;
  lat: number;
  lng: number;
  category: 'hill' | 'beach' | 'temple' | 'global';
  popularFor: string;
}

const FEATURED_PINS: GlobePin[] = [
  { id: 'ooty', name: 'Ooty', nameTa: 'ஊட்டி', country: 'Tamil Nadu', lat: 11.41, lng: 76.69, category: 'hill', popularFor: 'Tea Gardens & Nilgiri Rail' },
  { id: 'chennai', name: 'Chennai', nameTa: 'சென்னை', country: 'Tamil Nadu', lat: 13.08, lng: 80.27, category: 'beach', popularFor: 'Marina Beach & Heritage' },
  { id: 'rameswaram', name: 'Rameswaram', nameTa: 'ராமேஸ்வரம்', country: 'Tamil Nadu', lat: 9.28, lng: 79.31, category: 'temple', popularFor: 'Pamban Sea Bridge' },
  { id: 'kodaikanal', name: 'Kodaikanal', nameTa: 'கொடைக்கானல்', country: 'Tamil Nadu', lat: 10.23, lng: 77.48, category: 'hill', popularFor: 'Star Lake & Pine Forest' },
  { id: 'dubai', name: 'Dubai', nameTa: 'துபாய்', country: 'UAE', lat: 25.20, lng: 55.27, category: 'global', popularFor: 'Burj Khalifa & Desert Safari' },
  { id: 'paris', name: 'Paris', nameTa: 'பாரிஸ்', country: 'France', lat: 48.85, lng: 2.35, category: 'global', popularFor: 'Eiffel Tower & Louvre' },
];

// Helper to convert lat/long to 3D Cartesian on a sphere of radius R
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const LivingTripGlobe: React.FC<LivingTripGlobeProps> = ({
  fromCity = 'Chennai',
  toCity = 'Ooty',
  className = 'w-full h-80 sm:h-96',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const language = useTripStore((s) => s.language);
  const reduce3dEffects = useTripStore((s) => s.reduce3dEffects);
  const setPlannerField = useTripStore((s) => s.setPlannerField);
  const addToast = useTripStore((s) => s.addToast);

  const [selectedPin, setSelectedPin] = useState<GlobePin | null>(null);
  const [showDragHint, setShowDragHint] = useState(true);

  useEffect(() => {
    if (reduce3dEffects || !mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 360;
    let height = container.clientHeight || 320;

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
    camera.position.set(0, 0, 4.6);

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
    const ambientLight = new THREE.AmbientLight(0x0f2744, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(5, 4, 3);
    scene.add(dirLight);

    const orangeRim = new THREE.PointLight(0xff7a1a, 3.8, 10);
    orangeRim.position.set(-3, -2, 2);
    scene.add(orangeRim);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Low-poly Ocean Sphere
    const globeRadius = 1.6;
    const oceanGeo = new THREE.IcosahedronGeometry(globeRadius, 3);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0b1f3a,
      roughness: 0.65,
      metalness: 0.25,
      flatShading: true,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    globeGroup.add(ocean);

    // Procedural Landmass Nodes
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
      const x = (globeRadius + 0.02) * Math.cos(theta) * Math.sin(phi);
      const y = (globeRadius + 0.02) * Math.sin(theta) * Math.sin(phi);
      const z = (globeRadius + 0.02) * Math.cos(phi);

      const mesh = new THREE.Mesh(landGeo, landMat);
      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      landGroup.add(mesh);
    }
    globeGroup.add(landGroup);

    // Interactive Destination Pins on Globe
    const pinMeshes: THREE.Mesh[] = [];
    FEATURED_PINS.forEach((pin) => {
      const pinPos = latLngToVector3(pin.lat, pin.lng, globeRadius + 0.08);

      const pGeo = new THREE.ConeGeometry(0.06, 0.22, 6);
      const pMat = new THREE.MeshStandardMaterial({
        color: pin.name.toLowerCase() === toCity.toLowerCase() ? 0xff7a1a : 0x38bdf8,
        emissive: pin.name.toLowerCase() === toCity.toLowerCase() ? 0xff7a1a : 0x0284c7,
        emissiveIntensity: 0.7,
        roughness: 0.2,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(pinPos);
      pMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pinPos.clone().normalize());
      pMesh.userData = { pinData: pin };
      globeGroup.add(pMesh);
      pinMeshes.push(pMesh);
    });

    // Flight Arc between Origin & Destination
    const fromPin = FEATURED_PINS.find((p) => p.name.toLowerCase() === fromCity.toLowerCase()) || FEATURED_PINS[1];
    const toPin = FEATURED_PINS.find((p) => p.name.toLowerCase() === toCity.toLowerCase()) || FEATURED_PINS[0];

    const vFrom = latLngToVector3(fromPin.lat, fromPin.lng, globeRadius + 0.05);
    const vTo = latLngToVector3(toPin.lat, toPin.lng, globeRadius + 0.05);
    const vMid = vFrom.clone().add(vTo).multiplyScalar(0.5).normalize().multiplyScalar(globeRadius + 0.45);

    const curve = new THREE.QuadraticBezierCurve3(vFrom, vMid, vTo);
    const points = curve.getPoints(36);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xff7a1a,
      dashSize: 0.06,
      gapSize: 0.03,
      linewidth: 2,
    });
    const routeLine = new THREE.Line(lineGeo, lineMat);
    routeLine.computeLineDistances();
    globeGroup.add(routeLine);

    // Aeroplane on flight route
    const planeGroup = new THREE.Group();
    const fuseGeo = new THREE.ConeGeometry(0.045, 0.2, 5);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.5 });
    const fuse = new THREE.Mesh(fuseGeo, planeMat);
    fuse.rotation.x = Math.PI / 2;
    planeGroup.add(fuse);

    const wingGeo = new THREE.BoxGeometry(0.22, 0.015, 0.06);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xff7a1a });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0, 0.02);
    planeGroup.add(wings);
    planeGroup.scale.set(0.65, 0.65, 0.65);
    globeGroup.add(planeGroup);

    // Atmospheric Glow Halo
    const haloGeo = new THREE.RingGeometry(globeRadius + 0.08, globeRadius + 0.22, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0, -0.2);
    scene.add(halo);

    // Initial globe rotation orienting towards South India / Asia
    let rotX = 0.22;
    let rotY = -1.25;
    let targetRotX = 0.22;
    let targetRotY = -1.25;

    // Interaction handlers
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setShowDragHint(false);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += deltaX * 0.007;
      targetRotX = Math.max(-0.8, Math.min(0.8, targetRotX + deltaY * 0.007));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Raycast Pin Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);
      if (intersects.length > 0) {
        const pinData = intersects[0].object.userData.pinData as GlobePin;
        if (pinData) {
          setSelectedPin(pinData);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domEl.addEventListener('click', onCanvasClick);

    // Resize listener
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 360;
      height = container.clientHeight || 320;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId = 0;
    let flightProgress = 0;

    const tick = () => {
      if (!isDragging) {
        targetRotY += 0.002;
      }

      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;
      globeGroup.rotation.x = rotX;
      globeGroup.rotation.y = rotY;

      // Animate plane along curve
      flightProgress = (flightProgress + 0.005) % 1;
      const pos = curve.getPointAt(flightProgress);
      planeGroup.position.copy(pos);
      const tangent = curve.getTangentAt(flightProgress);
      planeGroup.lookAt(pos.clone().add(tangent));

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('click', onCanvasClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      oceanGeo.dispose();
      oceanMat.dispose();
      landGeo.dispose();
      landMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fromCity, toCity, reduce3dEffects]);

  const handleSetAsDestination = (pin: GlobePin) => {
    setPlannerField('destination', pin.name);
    setPlannerField('destinationId', pin.id);
    addToast(
      language === 'ta'
        ? `${pin.nameTa} இலக்காக அமைக்கப்பட்டது!`
        : `${pin.name} set as trip destination!`,
      'success'
    );
    setSelectedPin(null);
  };

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden rounded-3xl bg-[#0B1F3A]/40 border border-slate-700/50 shadow-inner ${className}`}>
      {reduce3dEffects ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <Globe className="w-16 h-16 text-teal-400 mb-3 animate-spin" style={{ animationDuration: '24s' }} />
          <h4 className="text-sm font-bold text-white">Interactive 3D Route Map (Simplified)</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {fromCity} ➔ {toCity}
          </p>
        </div>
      ) : (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      )}

      {/* Floating Drag Instruction Hint */}
      {!reduce3dEffects && showDragHint && (
        <div className="absolute top-3 left-3 pointer-events-none px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/60 text-[11px] font-medium text-slate-300 flex items-center gap-1.5 animate-pulse">
          <Navigation className="w-3.5 h-3.5 text-[#14B8A6] rotate-45" />
          <span>{language === 'ta' ? 'சுழற்ற இழுக்கவும் • பின்னைத் தொடவும்' : 'Drag globe • Tap pins to select destination'}</span>
        </div>
      )}

      {/* "Near Me / Reset South India" Button */}
      <button
        onClick={() => {
          setPlannerField('destination', 'Ooty');
          addToast(language === 'ta' ? 'அருகிலுள்ள இடங்கள் சீரமைக்கப்பட்டது' : 'Centered on Nilgiris & South India', 'info');
        }}
        className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 backdrop-blur shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
        title="Center South India"
      >
        <MapPin className="w-3.5 h-3.5 text-[#FF7A1A]" />
        <span>{language === 'ta' ? 'அருகில்' : 'Near Me'}</span>
      </button>

      {/* Selected Pin Popover Card */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-12 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl z-20"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A1A]" />
                <h5 className="font-extrabold text-sm text-white">
                  {language === 'ta' ? selectedPin.nameTa : selectedPin.name}
                </h5>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                {selectedPin.country}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              {selectedPin.popularFor}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetAsDestination(selectedPin)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF7A1A] to-[#ff9342] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'இலக்காக அமை' : 'Set as destination'}</span>
              </button>
              <button
                onClick={() => setSelectedPin(null)}
                className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Route Legend Bar */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF7A1A] animate-pulse" />
          <span className="font-medium text-white">{fromCity}</span>
        </span>
        <span className="text-[10px] text-[#14B8A6] font-bold tracking-wider">● LIVE 3D FLIGHT / ROAD</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
          <span className="font-medium text-white">{toCity}</span>
        </span>
      </div>
    </div>
  );
};
