import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  X,
  Sun,
  CloudRain,
  CloudFog,
  Moon,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Navigation,
  MapPin,
  Clock,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface ControlCenter3DProps {
  isOpen: boolean;
  onClose: () => void;
}

type WeatherCondition = 'clear' | 'rain' | 'fog' | 'night';

export const ControlCenter3D: React.FC<ControlCenter3DProps> = ({ isOpen, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const language = useTripStore((s) => s.language);
  const roadRiskLevel = useTripStore((s) => s.roadRiskLevel);
  const setRoadRiskLevel = useTripStore((s) => s.setRoadRiskLevel);
  const plannerForm = useTripStore((s) => s.plannerForm);
  const setStep = useTripStore((s) => s.setStep);
  const addToast = useTripStore((s) => s.addToast);
  const reduce3dEffects = useTripStore((s) => s.reduce3dEffects);

  const [weather, setWeather] = useState<WeatherCondition>('clear');
  const [timelineProgress, setTimelineProgress] = useState<number>(35); // 0 - 100%
  const [selectedLandmark, setSelectedLandmark] = useState<{
    id: string;
    name: string;
    nameTa: string;
    altitude: string;
    eta: string;
    status: string;
    statusColor: string;
  } | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Landmarks along the demo journey (Mettupalayam -> Coonoor -> Ooty)
  const LANDMARKS = [
    {
      id: 'start',
      name: 'Mettupalayam Foothills',
      nameTa: 'மேட்டுப்பாளையம் அடிவாரம்',
      altitude: '300m ASL',
      eta: '08:00 AM (Departed)',
      status: 'Clear & Smooth',
      statusColor: 'text-emerald-400',
      pos: new THREE.Vector3(-3.2, 0.2, 2.0),
    },
    {
      id: 'hairpin',
      name: 'Hairpin Bend 14 (Burliar)',
      nameTa: 'கொண்டை ஊசி வளைவு 14',
      altitude: '1,150m ASL',
      eta: '09:45 AM (Passing Now)',
      status: 'Moderate Mist & Wet Curves',
      statusColor: 'text-amber-400',
      pos: new THREE.Vector3(-0.6, 0.8, 0.5),
    },
    {
      id: 'coonoor',
      name: 'Coonoor Tea Gardens',
      nameTa: 'குன்னூர் தேயிலைத் தோட்டம்',
      altitude: '1,850m ASL',
      eta: '11:15 AM (Upcoming)',
      status: 'Light Drizzle',
      statusColor: 'text-teal-400',
      pos: new THREE.Vector3(1.2, 1.4, -0.8),
    },
    {
      id: 'dest',
      name: 'Ooty Charring Cross',
      nameTa: 'ஊட்டி சாரிங் கிராஸ்',
      altitude: '2,240m ASL',
      eta: '12:30 PM (Final Destination)',
      status: 'Pleasant & Cool 14°C',
      statusColor: 'text-emerald-400',
      pos: new THREE.Vector3(3.0, 2.0, -2.2),
    },
  ];

  useEffect(() => {
    if (!isOpen || reduce3dEffects || !mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      weather === 'night' ? 0x071427 : weather === 'fog' ? 0xcbd5e1 : 0x0b1f3a
    );

    if (weather === 'fog') {
      scene.fog = new THREE.FogExp2(0xcbd5e1, 0.18);
    } else if (weather === 'rain') {
      scene.fog = new THREE.FogExp2(0x1e293b, 0.08);
    }

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 7.5, 9.5);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(
      weather === 'night' ? 0x334155 : 0xffffff,
      weather === 'night' ? 0.4 : weather === 'fog' ? 0.9 : 1.2
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      weather === 'night' ? 0x38bdf8 : weather === 'clear' ? 0xfffbeb : 0x94a3b8,
      weather === 'night' ? 0.6 : 1.8
    );
    sunLight.position.set(5, 10, 4);
    scene.add(sunLight);

    // Mountainous Low-Poly Terrain
    const terrainGeo = new THREE.PlaneGeometry(12, 10, 24, 20);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const elevation =
        Math.sin(vx * 0.8) * 0.6 +
        Math.cos(vy * 0.6) * 0.5 +
        (vx + 6) * 0.22 + // Gradual hill slope upward to Ooty
        Math.sin(vx * 2 + vy * 2) * 0.15;
      pos.setZ(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color:
        weather === 'night'
          ? 0x0f172a
          : weather === 'rain'
          ? 0x1e3a5f
          : weather === 'fog'
          ? 0x475569
          : 0x1e293b,
      flatShading: true,
      roughness: 0.85,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2.2;
    terrain.position.set(0, -0.5, 0);
    scene.add(terrain);

    // Winding Mountain Highway Line
    const curvePoints = [
      new THREE.Vector3(-3.5, 0.1, 2.5),
      new THREE.Vector3(-2.2, 0.4, 1.8),
      new THREE.Vector3(-1.2, 0.6, 1.2),
      new THREE.Vector3(-0.6, 0.8, 0.5),
      new THREE.Vector3(0.0, 1.1, 0.2),
      new THREE.Vector3(0.8, 1.3, -0.4),
      new THREE.Vector3(1.4, 1.5, -0.9),
      new THREE.Vector3(2.2, 1.7, -1.6),
      new THREE.Vector3(3.2, 2.0, -2.4),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.12, 8, false);

    const roadRiskColor =
      roadRiskLevel === 'high' ? 0xef4444 : roadRiskLevel === 'medium' ? 0xf59e0b : 0x14b8a6;

    const roadMat = new THREE.MeshStandardMaterial({
      color: roadRiskColor,
      emissive: roadRiskColor,
      emissiveIntensity: 0.35,
      roughness: 0.4,
    });
    const road = new THREE.Mesh(tubeGeo, roadMat);
    scene.add(road);

    // 3D Moving Vehicle along the curve
    const vehicleGroup = new THREE.Group();
    // Low-poly SUV Body
    const carBodyGeo = new THREE.BoxGeometry(0.38, 0.18, 0.22);
    const carBodyMat = new THREE.MeshStandardMaterial({
      color: 0xff7a1a,
      roughness: 0.3,
      metalness: 0.2,
    });
    const carBody = new THREE.Mesh(carBodyGeo, carBodyMat);
    carBody.position.y = 0.1;
    vehicleGroup.add(carBody);

    // Headlights
    const lightGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftLight = new THREE.Mesh(lightGeo, lightMat);
    leftLight.position.set(0.18, 0.1, 0.08);
    const rightLight = new THREE.Mesh(lightGeo, lightMat);
    rightLight.position.set(0.18, 0.1, -0.08);
    vehicleGroup.add(leftLight);
    vehicleGroup.add(rightLight);

    // Radar pulse ring under vehicle
    const ringGeo = new THREE.RingGeometry(0.35, 0.45, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: roadRiskColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.02;
    vehicleGroup.add(ringMesh);

    scene.add(vehicleGroup);

    // Landmark Pins
    const pinMeshes: THREE.Mesh[] = [];
    LANDMARKS.forEach((lm) => {
      const pinGroup = new THREE.Group();
      const pinGeo = new THREE.ConeGeometry(0.16, 0.45, 6);
      const pinMat = new THREE.MeshStandardMaterial({
        color: lm.id === 'dest' ? 0xff7a1a : 0x38bdf8,
        emissive: lm.id === 'dest' ? 0xff7a1a : 0x0284c7,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.rotation.x = Math.PI; // Point down
      pinMesh.position.copy(lm.pos);
      pinMesh.position.y += 0.4;
      pinMesh.userData = { landmarkId: lm.id };
      scene.add(pinMesh);
      pinMeshes.push(pinMesh);
    });

    // Rain particles (if weather is rain)
    let rainParticles: THREE.Points | null = null;
    if (weather === 'rain') {
      const rainCount = 600;
      const rainGeo = new THREE.BufferGeometry();
      const rainPositions = new Float32Array(rainCount * 3);
      for (let i = 0; i < rainCount * 3; i += 3) {
        rainPositions[i] = (Math.random() - 0.5) * 12;
        rainPositions[i + 1] = Math.random() * 8;
        rainPositions[i + 2] = (Math.random() - 0.5) * 10;
      }
      rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
      const rainMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.06,
        transparent: true,
        opacity: 0.7,
      });
      rainParticles = new THREE.Points(rainGeo, rainMat);
      scene.add(rainParticles);
    }

    // Touch & Mouse Drag to Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotationY += deltaX * 0.006;
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX + deltaY * 0.004));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Tap/Click Landmark raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);
      if (intersects.length > 0) {
        const id = intersects[0].object.userData.landmarkId;
        const found = LANDMARKS.find((l) => l.id === id);
        if (found) {
          setSelectedLandmark(found);
          addToast(
            language === 'ta'
              ? `தேர்ந்தெடுக்கப்பட்டது: ${found.nameTa}`
              : `Waypoint inspected: ${found.name}`,
            'info'
          );
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    domEl.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domEl.addEventListener('touchstart', handlePointerDown, { passive: true });
    domEl.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    domEl.addEventListener('click', handleCanvasClick);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera orbit damping
      camera.position.x += (Math.sin(targetRotationY) * 9.5 - camera.position.x) * 0.08;
      camera.position.z += (Math.cos(targetRotationY) * 9.5 - camera.position.z) * 0.08;
      camera.position.y += (7.5 + targetRotationX * 6 - camera.position.y) * 0.08;
      camera.lookAt(0, 1.0, 0);

      // Position vehicle based on timelineProgress
      const progressT = Math.max(0, Math.min(1, timelineProgress / 100));
      const currentPoint = curve.getPointAt(progressT);
      const nextPoint = curve.getPointAt(Math.min(1, progressT + 0.02));

      vehicleGroup.position.copy(currentPoint);
      vehicleGroup.lookAt(nextPoint);

      // Radar pulse ring animation
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.25;
      ringMesh.scale.set(scale, scale, 1);

      // Pin floating bob
      pinMeshes.forEach((pin, idx) => {
        pin.position.y =
          LANDMARKS[idx].pos.y + 0.4 + Math.sin(clock.getElapsedTime() * 2 + idx) * 0.08;
      });

      // Rain fall
      if (rainParticles) {
        const rPos = rainParticles.geometry.attributes.position;
        for (let i = 1; i < rPos.count * 3; i += 3) {
          rPos.array[i] -= delta * 12;
          if (rPos.array[i] < -0.5) {
            rPos.array[i] = 7.5;
          }
        }
        rPos.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth || 600;
      height = mountRef.current.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', handlePointerDown);
      domEl.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      domEl.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      domEl.removeEventListener('click', handleCanvasClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      tubeGeo.dispose();
      roadMat.dispose();
    };
  }, [isOpen, weather, timelineProgress, roadRiskLevel, reduce3dEffects]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.94, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 15 }}
          className={`w-full max-w-5xl rounded-3xl bg-[#0B1F3A] border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-white ${
            isFullscreen ? 'fixed inset-3 max-w-none' : 'max-h-[90vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF7A1A] to-[#14B8A6] flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base tracking-tight">
                    {language === 'ta' ? '3D மிஷன் கண்ட்ரோல் மையம்' : '3D Mission Control Center'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30 animate-pulse">
                    LIVE SIMULATION
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {plannerForm.from || 'Chennai'} → {plannerForm.destination || 'Ooty'} •{' '}
                  {language === 'ta' ? 'ஹேர்பின் வளைவு பகுப்பாய்வு' : 'Hairpin Bend Risk Telemetry'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAudioFeedback(!audioFeedback)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title={audioFeedback ? 'Mute' : 'Unmute'}
              >
                {audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors hidden sm:flex"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3D Scene Viewport / Reduced Fallback */}
          <div className="relative flex-1 min-h-[320px] sm:min-h-[420px] bg-slate-950">
            {reduce3dEffects ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900">
                <Navigation className="w-16 h-16 text-[#FF7A1A] mb-3 animate-bounce" />
                <h4 className="text-lg font-bold">
                  {language === 'ta' ? '2D வரைபட பார்வை இயக்கத்தில் உள்ளது' : '2D Route Map Fallback Active'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  {language === 'ta'
                    ? 'செட்டிங்ஸில் 3D விளைவுகள் குறைக்கப்பட்டுள்ளன. கீழே உள்ள டைம்லைனைப் பயன்படுத்தி வழியை ஆராயுங்கள்.'
                    : '3D effects are reduced in settings. Use the telemetry scrubber and waypoint triggers below.'}
                </p>
              </div>
            ) : (
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            )}

            {/* Hint overlay */}
            {!reduce3dEffects && (
              <div className="absolute top-3 left-3 pointer-events-none px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/60 text-[11px] font-medium text-slate-300 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#14B8A6] rotate-45" />
                <span>{language === 'ta' ? 'சுழற்ற இழுக்கவும் • பின்னைத் தொடவும்' : 'Drag to rotate • Tap pins to inspect'}</span>
              </div>
            )}

            {/* Selected Landmark Floating Card */}
            {selectedLandmark && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl z-10"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF7A1A]" />
                    <h5 className="font-bold text-sm text-white">
                      {language === 'ta' ? selectedLandmark.nameTa : selectedLandmark.name}
                    </h5>
                  </div>
                  <button
                    onClick={() => setSelectedLandmark(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-300 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ta' ? 'உயரம்:' : 'Altitude:'}</span>
                    <span className="font-mono font-bold text-teal-400">{selectedLandmark.altitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ta' ? 'வருகை நேரம்:' : 'ETA:'}</span>
                    <span className="font-mono">{selectedLandmark.eta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ta' ? 'நிலைமை:' : 'Status:'}</span>
                    <span className={`font-semibold ${selectedLandmark.statusColor}`}>
                      {selectedLandmark.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    setStep(5); // Navigate to Replan Page
                    addToast(
                      language === 'ta'
                        ? 'இங்கிருந்து மறுதிட்டமிடல் தொடங்குகிறது...'
                        : 'Initiating AI replan from selected waypoint...',
                      'info'
                    );
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF7A1A] to-[#ff9342] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'இங்கிருந்து மாற்றியமை' : 'Replan from here'}</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Interactive Control Deck */}
          <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-4">
            {/* Timeline Scrubber */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#14B8A6]" />
                  <span>{language === 'ta' ? 'பயண காலவரிசை முன்னேற்றம்' : 'Journey Timeline Scrubber'}</span>
                </span>
                <span className="font-mono text-[#FF7A1A]">{timelineProgress}% Completed</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={timelineProgress}
                onChange={(e) => setTimelineProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF7A1A]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Start: Foothills</span>
                <span>Bend 14</span>
                <span>Coonoor</span>
                <span>Dest: Ooty</span>
              </div>
            </div>

            {/* Condition Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Weather simulation */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {language === 'ta' ? 'வானிலை உருவகப்படுத்துதல்' : 'Weather Condition Simulation'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setWeather('clear')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      weather === 'clear'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                  <button
                    onClick={() => setWeather('rain')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      weather === 'rain'
                        ? 'bg-blue-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>Rain</span>
                  </button>
                  <button
                    onClick={() => setWeather('fog')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      weather === 'fog'
                        ? 'bg-slate-400 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CloudFog className="w-3.5 h-3.5" />
                    <span>Fog</span>
                  </button>
                  <button
                    onClick={() => setWeather('night')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      weather === 'night'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Night</span>
                  </button>
                </div>
              </div>

              {/* Road Risk selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {language === 'ta' ? 'சாலை ஆபத்து நிலை' : 'Road Hazard & Curve Risk'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setRoadRiskLevel('low')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      roadRiskLevel === 'low'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Low (Safe)</span>
                  </button>
                  <button
                    onClick={() => setRoadRiskLevel('medium')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      roadRiskLevel === 'medium'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Medium</span>
                  </button>
                  <button
                    onClick={() => setRoadRiskLevel('high')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      roadRiskLevel === 'high'
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>High (Risk)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
