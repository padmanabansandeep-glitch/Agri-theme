import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SoilCoreProps {
  soilType?: string; // alluvial, black, red, laterite, sandy, clay, loamy
  ph?: number;
  moisture?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
}

export const SoilCore3D: React.FC<SoilCoreProps> = ({
  soilType = 'alluvial',
  ph = 6.8,
  moisture = 55,
  nitrogen = 120,
  phosphorus = 45,
  potassium = 150
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(4.5, 3.2, 5.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const direct = new THREE.DirectionalLight(0xfffaed, 1.2);
    direct.position.set(5, 8, 5);
    scene.add(direct);

    // Color palette based on soil type
    const soilColors: Record<string, { top: number; sub: number; bed: number }> = {
      alluvial: { top: 0x854d0e, sub: 0xa16207, bed: 0x713f12 },
      black: { top: 0x1f2937, sub: 0x374151, bed: 0x111827 },
      red: { top: 0x991b1b, sub: 0xb91c1c, bed: 0x7f1d1d },
      laterite: { top: 0xc2410c, sub: 0xea580c, bed: 0x9a3412 },
      sandy: { top: 0xd97706, sub: 0xf59e0b, bed: 0xb45309 },
      clay: { top: 0x475569, sub: 0x64748b, bed: 0x334155 },
      loamy: { top: 0x582f0e, sub: 0x7f4f24, bed: 0x3a1e05 }
    };

    const palette = soilColors[soilType.toLowerCase()] || soilColors.alluvial;

    // Soil Core Model (3 stacked blocks)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Topsoil Layer (Horizon A)
    const topGeo = new THREE.BoxGeometry(2.0, 0.9, 2.0);
    const topMat = new THREE.MeshLambertMaterial({
      color: palette.top
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.9;
    coreGroup.add(topMesh);

    // Subsoil Layer (Horizon B)
    const subGeo = new THREE.BoxGeometry(2.0, 1.1, 2.0);
    const subMat = new THREE.MeshLambertMaterial({
      color: palette.sub
    });
    const subMesh = new THREE.Mesh(subGeo, subMat);
    subMesh.position.y = -0.1;
    coreGroup.add(subMesh);

    // Bedrock Layer (Horizon C)
    const bedGeo = new THREE.BoxGeometry(2.0, 0.8, 2.0);
    const bedMat = new THREE.MeshLambertMaterial({
      color: palette.bed
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.position.y = -1.05;
    coreGroup.add(bedMesh);

    // Root System Lines
    const rootMat = new THREE.LineBasicMaterial({ color: 0xfef08a, linewidth: 2 });
    for (let r = 0; r < 8; r++) {
      const points = [];
      const startX = (Math.random() - 0.5) * 0.4;
      const startZ = (Math.random() - 0.5) * 0.4;
      points.push(new THREE.Vector3(startX, 1.35, startZ));
      points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 0.5, 0.7, startZ + (Math.random() - 0.5) * 0.5));
      points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 0.9, 0.1, startZ + (Math.random() - 0.5) * 0.9));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const rootLine = new THREE.Line(lineGeo, rootMat);
      coreGroup.add(rootLine);
    }

    // Nutrient particle system (N, P, K floating in core)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1.8;
      positions[i + 1] = (Math.random() - 0.5) * 2.2;
      positions[i + 2] = (Math.random() - 0.5) * 1.8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.08,
      transparent: true,
      opacity: 0.8
    });
    const nutrientParticles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(nutrientParticles);

    // Raycaster for layer hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([topMesh, subMesh, bedMesh]);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj === topMesh) setActiveLayer('Topsoil (Horizon A) - Organic Matter & Root Zone');
        else if (obj === subMesh) setActiveLayer('Subsoil (Horizon B) - Mineral & Nutrient Accumulation');
        else if (obj === bedMesh) setActiveLayer('Parent Rock (Horizon C) - Weathered Bedrock & Drainage');
      } else {
        setActiveLayer(null);
      }
    };
    container.addEventListener('mousemove', onPointerMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle rotation
      coreGroup.rotation.y = elapsed * 0.35;

      // Pulse nutrient particles
      const pos = nutrientParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += Math.sin(elapsed * 2 + i) * 0.003;
      }
      nutrientParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onPointerMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [soilType, ph, moisture, nitrogen, phosphorus, potassium]);

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden glass-panel flex flex-col justify-between p-4">
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-forest dark:text-emerald-400 font-bold">
            3D Soil Core Sample
          </span>
          <h4 className="font-bold text-zinc-800 dark:text-zinc-100 capitalize">
            {soilType} Soil
          </h4>
        </div>
        <div className="text-right text-xs font-mono">
          <div className="text-emerald-600 dark:text-emerald-400 font-bold">pH {ph.toFixed(1)}</div>
          <div className="text-zinc-500">Moisture: {moisture}%</div>
        </div>
      </div>

      <div ref={mountRef} className="absolute inset-0 cursor-pointer" />

      <div className="z-10 bg-white/80 dark:bg-black/70 backdrop-blur-md rounded-xl p-2.5 text-xs text-center border border-emerald-100 dark:border-emerald-900 pointer-events-none">
        {activeLayer ? (
          <span className="font-semibold text-brand-forest dark:text-emerald-300">{activeLayer}</span>
        ) : (
          <span className="text-zinc-500 dark:text-zinc-400">Hover over soil core layers to inspect horizons</span>
        )}
      </div>
    </div>
  );
};
