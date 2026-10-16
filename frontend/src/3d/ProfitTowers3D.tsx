import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ProfitTowersProps {
  expenses: number;
  revenue: number;
  profit: number;
  isLoss: boolean;
  currency?: string;
}

export const ProfitTowers3D: React.FC<ProfitTowersProps> = ({
  expenses = 45000,
  revenue = 98000,
  profit = 53000,
  isLoss = false,
  currency = '₹'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 4.5, 7.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const direct = new THREE.DirectionalLight(0xfff5e6, 1.2);
    direct.position.set(4, 8, 4);
    scene.add(direct);

    // Ground platform
    const platformGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.35, 32);
    const platformMat = new THREE.MeshLambertMaterial({
      color: isLoss ? 0x78350f : 0x166534 // Cracked dry ground if loss vs rich grass
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.18;
    scene.add(platform);

    // Max value for scaling heights
    const maxVal = Math.max(revenue, expenses, Math.abs(profit), 1000);
    const maxHeight = 3.2;

    const expHeight = Math.max(0.4, (expenses / maxVal) * maxHeight);
    const revHeight = Math.max(0.4, (revenue / maxVal) * maxHeight);
    const profHeight = Math.max(0.3, (Math.abs(profit) / maxVal) * maxHeight);

    // Tower 1: Expenses (Amber/Orange)
    const towerExpGeo = new THREE.BoxGeometry(0.9, expHeight, 0.9);
    const towerExpMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
    const towerExp = new THREE.Mesh(towerExpGeo, towerExpMat);
    towerExp.position.set(-1.4, expHeight / 2, 0);
    scene.add(towerExp);

    // Tower 2: Revenue (Sky Blue)
    const towerRevGeo = new THREE.BoxGeometry(0.9, revHeight, 0.9);
    const towerRevMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
    const towerRev = new THREE.Mesh(towerRevGeo, towerRevMat);
    towerRev.position.set(0, revHeight / 2, 0);
    scene.add(towerRev);

    // Tower 3: Net Profit (Green if positive, Coral if loss)
    const towerProfGeo = new THREE.BoxGeometry(0.9, profHeight, 0.9);
    const towerProfMat = new THREE.MeshLambertMaterial({
      color: isLoss ? 0xef4444 : 0x22c55e
    });
    const towerProf = new THREE.Mesh(towerProfGeo, towerProfMat);
    towerProf.position.set(1.4, profHeight / 2, 0);
    scene.add(towerProf);

    // Floating Coins if profit > 0
    let coinsGroup = new THREE.Group();
    if (!isLoss) {
      const coinGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16);
      const coinMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 }); // Gold
      for (let i = 0; i < 18; i++) {
        const coin = new THREE.Mesh(coinGeo, coinMat);
        coin.position.set(
          1.4 + (Math.random() - 0.5) * 0.8,
          profHeight + 0.3 + Math.random() * 1.5,
          (Math.random() - 0.5) * 0.8
        );
        coin.rotation.x = Math.random() * Math.PI;
        coin.rotation.z = Math.random() * Math.PI;
        coinsGroup.add(coin);
      }
      scene.add(coinsGroup);
    }

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow orbit rotation
      scene.rotation.y = Math.sin(elapsed * 0.5) * 0.25;

      // Animate floating gold coins
      if (!isLoss) {
        coinsGroup.children.forEach((coin, idx) => {
          coin.position.y += Math.sin(elapsed * 2 + idx) * 0.003;
          coin.rotation.y += 0.02;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [expenses, revenue, profit, isLoss]);

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden glass-panel flex flex-col justify-between p-4">
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            3D Financial Projection Towers
          </span>
          <h4 className="font-bold text-zinc-800 dark:text-zinc-100">
            {isLoss ? 'Loss Risk Assessment' : 'Profitable Harvest Potential'}
          </h4>
        </div>
        <div className="text-right">
          <div className={`font-mono font-bold text-sm ${isLoss ? 'text-rose-500' : 'text-emerald-500'}`}>
            {currency} {Math.round(profit).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-zinc-500 uppercase">{isLoss ? 'Estimated Loss' : 'Estimated Profit'}</span>
        </div>
      </div>

      <div ref={mountRef} className="absolute inset-0" />

      {/* Legend */}
      <div className="z-10 flex items-center justify-center gap-4 bg-white/80 dark:bg-black/70 backdrop-blur-md rounded-xl py-2 px-3 text-xs border border-emerald-100 dark:border-emerald-900 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
          <span>Expenses: {currency}{Math.round(expenses).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
          <span>Revenue: {currency}{Math.round(revenue).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-sm ${isLoss ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <span className="font-semibold">{isLoss ? 'Loss' : 'Profit'}</span>
        </div>
      </div>
    </div>
  );
};
