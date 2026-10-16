import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface FarmHeroProps {
  weatherCondition?: string; // 'sunny' | 'rainy' | 'cloudy' | 'storm'
  timeOfDay?: 'day' | 'sunset' | 'night';
  reducedMotion?: boolean;
}

export const FarmHero3D: React.FC<FarmHeroProps> = ({
  weatherCondition = 'sunny',
  timeOfDay = 'day',
  reducedMotion = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    // Background color based on time of day
    let bgColor = 0xdcfce7; // Soft mint sunrise
    if (timeOfDay === 'sunset') bgColor = 0xfde68a; // Warm golden
    if (timeOfDay === 'night') bgColor = 0x08170e; // Deep dark moss
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(10, 8, 12);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(
      timeOfDay === 'night' ? 0x244230 : 0xffffff,
      timeOfDay === 'night' ? 0.6 : 0.85
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      timeOfDay === 'sunset' ? 0xf59e0b : (timeOfDay === 'night' ? 0x60a5fa : 0xfef08a),
      timeOfDay === 'night' ? 0.5 : 1.4
    );
    sunLight.position.set(8, 14, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 3. Floating Island Geometry (Hexagonal Terraced Base)
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Upper grass surface
    const topGeo = new THREE.CylinderGeometry(5.2, 4.8, 0.9, 8);
    const topMat = new THREE.MeshLambertMaterial({
      color: timeOfDay === 'night' ? 0x0f3d23 : 0x4ade80 // Leaf green
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.45;
    topMesh.receiveShadow = true;
    islandGroup.add(topMesh);

    // Soil bedrock layer
    const bedrockGeo = new THREE.CylinderGeometry(4.8, 1.2, 3.2, 8);
    const bedrockMat = new THREE.MeshLambertMaterial({ color: 0x78350f }); // Earthy brown
    const bedrockMesh = new THREE.Mesh(bedrockGeo, bedrockMat);
    bedrockMesh.position.y = -1.6;
    bedrockMesh.castShadow = true;
    bedrockMesh.receiveShadow = true;
    islandGroup.add(bedrockMesh);

    // Terraced step fields
    const terraceGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.4, 8);
    const terraceMat = new THREE.MeshLambertMaterial({ color: 0x65a30d });
    const terraceMesh = new THREE.Mesh(terraceGeo, terraceMat);
    terraceMesh.position.set(-1.2, 0.95, -0.6);
    islandGroup.add(terraceMesh);

    // 4. Little Farmhouse
    const houseGroup = new THREE.Group();
    const wallsGeo = new THREE.BoxGeometry(1.2, 0.9, 1.0);
    const wallsMat = new THREE.MeshLambertMaterial({ color: 0xfef3c7 }); // Warm cream
    const walls = new THREE.Mesh(wallsGeo, wallsMat);
    walls.position.y = 0.45;
    walls.castShadow = true;
    houseGroup.add(walls);

    // Roof
    const roofGeo = new THREE.ConeGeometry(1.1, 0.6, 4);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0xb45309 }); // Terracotta
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1.15;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    houseGroup.position.set(1.8, 0.9, 1.2);
    islandGroup.add(houseGroup);

    // 5. Animated Windmill
    const windmillGroup = new THREE.Group();
    const towerGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.2, 8);
    const towerMat = new THREE.MeshLambertMaterial({ color: 0xf3f4f6 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 1.1;
    tower.castShadow = true;
    windmillGroup.add(tower);

    // Blades group
    const bladesGroup = new THREE.Group();
    bladesGroup.position.set(0, 2.0, 0.35);

    const bladeGeo = new THREE.BoxGeometry(0.12, 1.4, 0.04);
    const bladeMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (Math.PI / 2) * i;
      bladesGroup.add(blade);
    }
    windmillGroup.add(bladesGroup);
    windmillGroup.position.set(-2.2, 0.9, 1.8);
    islandGroup.add(windmillGroup);

    // 6. Winding Water Stream
    const streamCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-3.5, 0.92, -2.0),
      new THREE.Vector3(0, 0.92, 0),
      new THREE.Vector3(3.5, 0.92, 2.5)
    );
    const streamGeo = new THREE.TubeGeometry(streamCurve, 20, 0.35, 6, false);
    const streamMat = new THREE.MeshLambertMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });
    const streamMesh = new THREE.Mesh(streamGeo, streamMat);
    islandGroup.add(streamMesh);

    // 7. Crop Field Instanced Stalks (Swaying with wind)
    const cropsCount = 60;
    const cropGeo = new THREE.ConeGeometry(0.08, 0.45, 4);
    const cropMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 }); // Golden harvest
    const cropsMesh = new THREE.InstancedMesh(cropGeo, cropMat, cropsCount);

    const dummy = new THREE.Object3D();
    const cropPositions: THREE.Vector3[] = [];
    for (let i = 0; i < cropsCount; i++) {
      const x = -1.2 + (Math.random() - 0.5) * 2.0;
      const z = -0.6 + (Math.random() - 0.5) * 1.8;
      const pos = new THREE.Vector3(x, 1.3, z);
      cropPositions.push(pos);
      dummy.position.copy(pos);
      dummy.scale.set(0.9 + Math.random() * 0.4, 0.9 + Math.random() * 0.4, 0.9 + Math.random() * 0.4);
      dummy.updateMatrix();
      cropsMesh.setMatrixAt(i, dummy.matrix);
    }
    cropsMesh.instanceMatrix.needsUpdate = true;
    cropsMesh.castShadow = true;
    islandGroup.add(cropsMesh);

    // 8. Clouds
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });
    for (let c = 0; c < 3; c++) {
      const cloud = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), cloudMat);
      cloud.position.set(-4 + c * 4, 3.8 + Math.random() * 0.8, -3 + Math.random() * 2);
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // 9. Rain Particles (if weather is rainy)
    let rainParticles: THREE.Points | null = null;
    if (weatherCondition === 'rainy' || weatherCondition === 'storm') {
      const rainCount = 350;
      const rainGeo = new THREE.BufferGeometry();
      const rainPositions = new Float32Array(rainCount * 3);
      for (let i = 0; i < rainCount * 3; i += 3) {
        rainPositions[i] = (Math.random() - 0.5) * 12;
        rainPositions[i + 1] = Math.random() * 10;
        rainPositions[i + 2] = (Math.random() - 0.5) * 12;
      }
      rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
      const rainMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.12,
        transparent: true,
        opacity: 0.7
      });
      rainParticles = new THREE.Points(rainGeo, rainMat);
      scene.add(rainParticles);
    }

    // Parallax mouse movement
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Spin windmill blades
        bladesGroup.rotation.z -= 0.035;

        // Island gentle floating bob
        islandGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

        // Crop gentle swaying
        for (let i = 0; i < cropsCount; i++) {
          const pos = cropPositions[i];
          dummy.position.copy(pos);
          dummy.rotation.z = Math.sin(elapsedTime * 3 + pos.x) * 0.1;
          dummy.updateMatrix();
          cropsMesh.setMatrixAt(i, dummy.matrix);
        }
        cropsMesh.instanceMatrix.needsUpdate = true;

        // Cloud drifting
        cloudGroup.children.forEach((cloud, idx) => {
          cloud.position.x += 0.008;
          if (cloud.position.x > 7) cloud.position.x = -7;
        });

        // Rain falling
        if (rainParticles) {
          const positions = rainParticles.geometry.attributes.position.array as Float32Array;
          for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.18;
            if (positions[i] < 0) positions[i] = 10;
          }
          rainParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Camera subtle parallax
        camera.position.x += (10 + mouseX * 2.5 - camera.position.x) * 0.05;
        camera.position.y += (8 - mouseY * 1.8 - camera.position.y) * 0.05;
        camera.lookAt(0, 0.8, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [weatherCondition, timeOfDay, reducedMotion]);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full min-h-[360px] flex items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-50 dark:from-emerald-950 dark:to-zinc-900 rounded-3xl p-8 text-center border border-emerald-200 dark:border-emerald-800">
        <div>
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-bold text-brand-forest dark:text-emerald-300">AgriSmart Living Farm</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-sm">
            Interactive low-poly farm running in lightweight CSS fallback mode for your display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] overflow-hidden rounded-3xl">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1 bg-white/70 dark:bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-brand-forest dark:text-emerald-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>3D Living Farm · {timeOfDay.toUpperCase()} · {weatherCondition.toUpperCase()}</span>
      </div>
    </div>
  );
};
