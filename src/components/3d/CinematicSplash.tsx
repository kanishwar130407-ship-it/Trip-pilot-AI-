import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { Compass, Sparkles, Plane } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

interface CinematicSplashProps {
  onComplete: () => void;
}

export const CinematicSplash: React.FC<CinematicSplashProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const language = useTripStore((s) => s.language);
  const setLanguage = useTripStore((s) => s.setLanguage);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // 3.5 second progress counter
    const startTime = Date.now();
    const duration = 3500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 600); // allow curtain exit animation
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  // 3D Scene setup
  useEffect(() => {
    if (prefersReducedMotion || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x0f2744, 1.5);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);
    const orangeFill = new THREE.PointLight(0xff7a1a, 3.0, 10);
    orangeFill.position.set(-2, -2, 2);
    scene.add(orangeFill);

    // Globe
    const globeGeo = new THREE.IcosahedronGeometry(1.5, 3);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x071427,
      roughness: 0.5,
      metalness: 0.3,
      flatShading: true,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // India Highlight (Orange land cluster)
    const indiaGeo = new THREE.ConeGeometry(0.1, 0.25, 5);
    const indiaMat = new THREE.MeshBasicMaterial({ color: 0xff7a1a });
    const indiaMesh = new THREE.Mesh(indiaGeo, indiaMat);
    indiaMesh.position.set(0.6, 0.4, 1.35);
    indiaMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), indiaMesh.position.clone().normalize());
    globe.add(indiaMesh);

    // Golden Indian Golden Quadrilateral Route lines: Chennai, Mumbai, Delhi, Kolkata
    const cities = [
      new THREE.Vector3(0.62, 0.38, 1.36), // Chennai
      new THREE.Vector3(0.52, 0.52, 1.38), // Mumbai
      new THREE.Vector3(0.58, 0.72, 1.25), // Delhi
      new THREE.Vector3(0.78, 0.56, 1.24), // Kolkata
    ];

    const routeCurve = new THREE.CatmullRomCurve3([...cities, cities[0]], true);
    const routePoints = routeCurve.getPoints(60);
    const routeGeo = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMat = new THREE.LineBasicMaterial({ color: 0xff7a1a, linewidth: 2 });
    const routeLine = new THREE.Line(routeGeo, routeMat);
    globe.add(routeLine);

    // Low-poly Plane
    const planeGeo = new THREE.ConeGeometry(0.06, 0.2, 5);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    let frameId = 0;
    let planeProgress = 0;

    const tick = () => {
      globe.rotation.y += 0.008;
      globe.rotation.x = 0.2;

      planeProgress = (planeProgress + 0.008) % 1;
      // Orbiting plane around globe
      const angle = planeProgress * Math.PI * 2;
      const radius = 2.1;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      const py = Math.sin(angle * 2) * 0.4;
      plane.position.set(px, py, pz);

      const lookTarget = new THREE.Vector3(
        Math.cos(angle + 0.1) * radius,
        Math.sin((angle + 0.1) * 2) * 0.4,
        Math.sin(angle + 0.1) * radius
      );
      plane.lookAt(lookTarget);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      indiaGeo.dispose();
      indiaMat.dispose();
      routeGeo.dispose();
      routeMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#071427] text-white select-none px-6 py-8 overflow-hidden"
        >
          {/* Top Bar with Language selector & Skip */}
          <div className="w-full max-w-4xl flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
              <span className="text-xs text-slate-400">Lang:</span>
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition ${
                  language === 'en' ? 'bg-[#FF7A1A] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition ${
                  language === 'ta' ? 'bg-[#FF7A1A] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
            </div>

            <button
              onClick={handleSkip}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 transition active:scale-95"
            >
              {language === 'ta' ? 'அறிமுகத்தைத் தவிர்' : 'Skip Intro'} &rarr;
            </button>
          </div>

          {/* Central 3D Globe / Visual */}
          <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-lg my-auto">
            {!prefersReducedMotion ? (
              <div ref={mountRef} className="w-72 h-72 sm:w-80 sm:h-80" />
            ) : (
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#FF7A1A] flex items-center justify-center bg-slate-900/50">
                <Plane className="w-16 h-16 text-[#FF7A1A] animate-pulse" />
              </div>
            )}

            {/* Logo and Tagline with Soft Bounce scale */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring', bounce: 0.4 }}
              className="text-center mt-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A1A]/20 border border-[#FF7A1A]/40 text-[#FF7A1A] text-xs font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous AI Travel Agent</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#FF7A1A] bg-clip-text text-transparent">
                TripPilot AI
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 font-medium">
                {language === 'ta'
                  ? 'திட்டமிடுங்கள். பயணியுங்கள். மாற்றுங்கள். பாதுகாப்பாக இருங்கள்.'
                  : 'Plan. Travel. Replan. Stay safe.'}
              </p>
            </motion.div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="w-full max-w-sm flex flex-col items-center gap-2 z-10">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <motion.div
                className="h-full bg-gradient-to-r from-[#14B8A6] via-[#FF7A1A] to-[#FF7A1A]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[11px] text-slate-400">
              <span>{language === 'ta' ? 'பயணத் தளம் தயாராகிறது...' : 'Initializing travel engine...'}</span>
              <span className="font-mono text-[#FF7A1A] font-semibold">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
