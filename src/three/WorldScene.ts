import * as THREE from 'three';
import { PALETTE_3D } from './palette';
import { SCALES } from './scales';
import { Problem, TaskAssignment } from '../sim/model';
import { SMALL_STEPPER_PROBLEM, MINGGU3_PROBLEM } from '../data/defaultDatasets';

export interface RaycastHit {
  type: 'task' | 'vm' | 'frog' | 'node' | 'podium';
  id: number | string;
  name: string;
  details: string;
}

export class WorldScene {
  public scene: THREE.Scene;
  private animGroup: THREE.Group;
  private objectsToIntersect: THREE.Object3D[] = [];

  // Animated elements
  private ledLights: THREE.Mesh[] = [];
  private frogs: THREE.Group[] = [];
  private arenaBlocksLeft: THREE.Mesh[] = [];
  private arenaBlocksRight: THREE.Mesh[] = [];
  private podiumWinner: THREE.Mesh | null = null;
  private technoShield: THREE.Group | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PALETTE_3D.itsDark);
    this.scene.fog = new THREE.FogExp2(PALETTE_3D.itsDark, 0.015);

    this.animGroup = new THREE.Group();
    this.scene.add(this.animGroup);

    this.setupLighting();
    this.setupEnvironment();
    this.buildHub();
    this.buildDatacenterZone();
    this.buildDagZone();
    this.buildChromosomeZone();
    this.buildLotusPondZone();
    this.buildDualArenaZone();
    this.buildPodiumZone();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(PALETTE_3D.itsBlueLight, 1.2);
    dirLight.position.set(20, 40, 20);
    this.scene.add(dirLight);

    const goldSpot = new THREE.SpotLight(PALETTE_3D.itsGold, 2.0, 50, Math.PI / 4, 0.5);
    goldSpot.position.set(0, 25, 0);
    this.scene.add(goldSpot);
  }

  private setupEnvironment() {
    // Cybernetic Grid Floor
    const gridHelper = new THREE.GridHelper(120, 60, PALETTE_3D.itsBlue, 0x192841);
    gridHelper.position.y = -0.05;
    this.scene.add(gridHelper);

    // Subtle reflective ground disk
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.itsDark,
      roughness: 0.85,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    this.scene.add(ground);
  }

  /** Central Hub: Floating ITS Techno-Shield geometric emblem */
  private buildHub() {
    this.technoShield = new THREE.Group();
    this.technoShield.position.set(0, 4.5, -6);

    // Outer Gear Rim (Toroid with tooth notches)
    const rimGeo = new THREE.TorusGeometry(2.4, 0.15, 16, 40);
    const rimMat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.itsBlue,
      emissive: PALETTE_3D.itsBlueDark,
      metalness: 0.8,
      roughness: 0.2
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    this.technoShield.add(rim);

    // 10 Gear teeth representing 10 November hero spirit
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const toothGeo = new THREE.BoxGeometry(0.35, 0.6, 0.2);
      const tooth = new THREE.Mesh(toothGeo, rimMat);
      tooth.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0);
      tooth.rotation.z = angle;
      this.technoShield.add(tooth);
    }

    // Inner Wijayakusuma Gold Flower Diamond
    const flowerGeo = new THREE.OctahedronGeometry(1.0);
    const flowerMat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.itsGold,
      emissive: 0x664800,
      metalness: 0.9,
      roughness: 0.1
    });
    const flower = new THREE.Mesh(flowerGeo, flowerMat);
    this.technoShield.add(flower);

    this.scene.add(this.technoShield);
  }

  /** Datacenter Zone: 4 Server Racks with VM timeline lanes */
  private buildDatacenterZone() {
    const dcGroup = new THREE.Group();
    dcGroup.position.set(-6, 0, 4);

    const vms = MINGGU3_PROBLEM.vms;
    vms.forEach((vm, idx) => {
      const x = (idx - 1.5) * SCALES.vmSpacingX;

      // Server Rack Tower
      const rackGeo = new THREE.BoxGeometry(1.6, 5.0, 1.2);
      const rackMat = new THREE.MeshStandardMaterial({
        color: PALETTE_3D.itsNavy,
        metalness: 0.7,
        roughness: 0.3
      });
      const rack = new THREE.Mesh(rackGeo, rackMat);
      rack.position.set(x, 2.5, -2);
      rack.userData = {
        type: 'vm',
        name: vm.name,
        details: `${vm.mips} MIPS · $${vm.pricePerHour}/jam`
      };
      this.objectsToIntersect.push(rack);
      dcGroup.add(rack);

      // Pulsing LED front strip
      const ledGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.4, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: PALETTE_3D.vmTiers[idx % 4] });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(x, 2.5, -1.38);
      this.ledLights.push(led);
      dcGroup.add(led);

      // VM Timeline Base Lane
      const laneGeo = new THREE.BoxGeometry(1.4, 0.1, 14);
      const laneMat = new THREE.MeshStandardMaterial({
        color: 0x132238,
        roughness: 0.6
      });
      const lane = new THREE.Mesh(laneGeo, laneMat);
      lane.position.set(x, 0.05, 5.5);
      dcGroup.add(lane);
    });

    this.scene.add(dcGroup);
  }

  /** 3D DAG Space (Left Wing x ≈ -16) */
  private buildDagZone() {
    const dagGroup = new THREE.Group();
    dagGroup.position.set(-16, 0, -2);

    const tasks = SMALL_STEPPER_PROBLEM.tasks;
    const positions = [
      [-2, 3.5, -4], // T1
      [-3.5, 2.5, -1], // T2
      [-0.5, 2.5, -1], // T3
      [-3.5, 1.5, 2],  // T4
      [-0.5, 1.5, 2],  // T5
      [-2, 0.8, 5]     // T6
    ];

    tasks.forEach((t, i) => {
      const pos = positions[i] || [0, 2, i * 2];
      const nodeGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: PALETTE_3D.itsBlue,
        emissive: 0x072238,
        roughness: 0.3
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(pos[0], pos[1], pos[2]);
      node.userData = {
        type: 'node',
        name: `Task ${t.name}`,
        details: `${t.length} MI · Deps: ${t.deps.join(', ') || 'Entry'}`
      };
      this.objectsToIntersect.push(node);
      dagGroup.add(node);
    });

    // Connection dependency lines
    SMALL_STEPPER_PROBLEM.edges?.forEach((e) => {
      const p1 = positions[e.from];
      const p2 = positions[e.to];
      if (p1 && p2) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p1[0], p1[1], p1[2]),
          new THREE.Vector3(p2[0], p2[1], p2[2])
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: PALETTE_3D.itsBlueLight, transparent: true, opacity: 0.6 });
        const line = new THREE.Line(lineGeo, lineMat);
        dagGroup.add(line);
      }
    });

    this.scene.add(dagGroup);
  }

  /** 3D GA Chromosome Lab (Left Wing x ≈ -14, z ≈ 3) */
  private buildChromosomeZone() {
    const labGroup = new THREE.Group();
    labGroup.position.set(-14, 0, 4);

    // 5 Chromosome Strands
    for (let c = 0; c < 5; c++) {
      const y = (4 - c) * SCALES.strandSpacingY + 0.8;
      const isHeftSeed = c === 0;

      for (let g = 0; g < 8; g++) {
        const x = (g - 3.5) * 0.55;
        const geneGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
        const geneMat = new THREE.MeshStandardMaterial({
          color: isHeftSeed ? PALETTE_3D.itsGold : PALETTE_3D.vmTiers[g % 4],
          emissive: isHeftSeed ? 0x443000 : 0x000000,
          roughness: 0.3
        });
        const gene = new THREE.Mesh(geneGeo, geneMat);
        gene.position.set(x, y, 0);
        labGroup.add(gene);
      }
    }

    this.scene.add(labGroup);
  }

  /** 3D SFLA Lotus Pond (Right Wing x ≈ +14) */
  private buildLotusPondZone() {
    const pondGroup = new THREE.Group();
    pondGroup.position.set(14, 0, 0);

    // Pond Water Basin
    const waterGeo = new THREE.CylinderGeometry(8.5, 9.0, 0.4, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0a2638,
      roughness: 0.1,
      metalness: 0.8
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.1;
    pondGroup.add(water);

    // 4 Memeplex Cluster Rings with Lily Pads & Frogs
    const memOffsets = [
      [-3.5, -3.5],
      [3.5, -3.5],
      [-3.5, 3.5],
      [3.5, 3.5]
    ];

    memOffsets.forEach(([mx, mz], memIdx) => {
      // Ring boundary
      const ringGeo = new THREE.RingGeometry(2.4, 2.55, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: PALETTE_3D.vmTiers[memIdx % 4],
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(mx, 0.32, mz);
      pondGroup.add(ring);

      // 3 Lily Pads with Frogs per memeplex
      for (let p = 0; p < 3; p++) {
        const angle = (p / 3) * Math.PI * 2;
        const px = mx + Math.cos(angle) * 1.4;
        const pz = mz + Math.sin(angle) * 1.4;

        // Lily pad
        const padGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.08, 16);
        const padMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.5 });
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.set(px, 0.35, pz);
        pondGroup.add(pad);

        // Frog
        const frogGroup = new THREE.Group();
        frogGroup.position.set(px, 0.55, pz);

        const frogBodyGeo = new THREE.SphereGeometry(0.3, 12, 12);
        const frogMat = new THREE.MeshStandardMaterial({
          color: PALETTE_3D.itsTosca,
          roughness: 0.4
        });
        const frogBody = new THREE.Mesh(frogBodyGeo, frogMat);
        frogGroup.add(frogBody);

        this.frogs.push(frogGroup);
        pondGroup.add(frogGroup);
      }
    });

    this.scene.add(pondGroup);
  }

  /** 3D Dual-Lane Arena: Side-by-Side HEFT-GA vs SFLA-GA */
  private buildDualArenaZone() {
    const arenaGroup = new THREE.Group();
    arenaGroup.position.set(0, 0, -1);

    // Left Lane: HEFT-GA (ITS Blue)
    const leftBaseGeo = new THREE.BoxGeometry(6.5, 0.2, 14);
    const leftMat = new THREE.MeshStandardMaterial({ color: 0x16243d });
    const leftBase = new THREE.Mesh(leftBaseGeo, leftMat);
    leftBase.position.set(-4.5, 0.1, 0);
    arenaGroup.add(leftBase);

    // Right Lane: SFLA-GA (ITS Cyan/Tosca)
    const rightBase = new THREE.Mesh(leftBaseGeo, leftMat);
    rightBase.position.set(4.5, 0.1, 0);
    arenaGroup.add(rightBase);

    // Populate animated task cubes in both lanes
    for (let i = 0; i < 18; i++) {
      const z = -5 + i * 0.7;

      // Left cube
      const cubeL = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.4, 0.55),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsBlue, roughness: 0.3 })
      );
      cubeL.position.set(-4.5 + ((i % 4) - 1.5) * 1.3, 0.4, z);
      this.arenaBlocksLeft.push(cubeL);
      arenaGroup.add(cubeL);

      // Right cube
      const cubeR = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.4, 0.55),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsTosca, roughness: 0.3 })
      );
      cubeR.position.set(4.5 + (((i + 1) % 4) - 1.5) * 1.3, 0.4, z * 1.05);
      this.arenaBlocksRight.push(cubeR);
      arenaGroup.add(cubeR);
    }

    this.scene.add(arenaGroup);
  }

  /** 3D Winner Podium Zone */
  private buildPodiumZone() {
    const podiumGroup = new THREE.Group();
    podiumGroup.position.set(0, 0, 0);

    // 1st place center pillar (Gold)
    const pillar1Geo = new THREE.CylinderGeometry(1.5, 1.6, 2.4, 24);
    const pillar1Mat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.itsGold,
      metalness: 0.8,
      roughness: 0.2
    });
    this.podiumWinner = new THREE.Mesh(pillar1Geo, pillar1Mat);
    this.podiumWinner.position.set(0, 1.2, 0);
    this.podiumWinner.userData = {
      type: 'podium',
      name: 'Podium Pemenang',
      details: 'Algoritma Hybrid Terbaik Berdasarkan Skor Komposit'
    };
    this.objectsToIntersect.push(this.podiumWinner);
    podiumGroup.add(this.podiumWinner);

    // 2nd place runner-up pillar (Left, Silver)
    const pillar2Geo = new THREE.CylinderGeometry(1.2, 1.3, 1.5, 24);
    const pillar2Mat = new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsSilver, roughness: 0.4 });
    const pillar2 = new THREE.Mesh(pillar2Geo, pillar2Mat);
    pillar2.position.set(-3.2, 0.75, 0);
    podiumGroup.add(pillar2);

    // 3rd place pillar (Right, Bronze/Slate)
    const pillar3Geo = new THREE.CylinderGeometry(1.1, 1.2, 1.0, 24);
    const pillar3Mat = new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsBlueLight, roughness: 0.5 });
    const pillar3 = new THREE.Mesh(pillar3Geo, pillar3Mat);
    pillar3.position.set(3.2, 0.5, 0);
    podiumGroup.add(pillar3);

    this.scene.add(podiumGroup);
  }

  /** Update loop called every frame */
  public update(time: number) {
    // Rotate ITS Techno Shield gently
    if (this.technoShield) {
      this.technoShield.rotation.z = time * 0.15;
    }

    // Pulse rack LED lights
    const glow = Math.sin(time * 3) * 0.5 + 0.5;
    this.ledLights.forEach((l, i) => {
      (l.material as THREE.MeshBasicMaterial).color.setHex(
        glow > 0.5 ? PALETTE_3D.vmTiers[i % 4] : 0x0b132b
      );
    });

    // Animate frog hops in the pond
    this.frogs.forEach((f, i) => {
      const hop = Math.abs(Math.sin(time * 2 + i));
      f.position.y = 0.55 + hop * 0.4;
    });

    // Rotate winner podium badge
    if (this.podiumWinner) {
      this.podiumWinner.rotation.y = time * 0.4;
    }
  }

  public getIntersectables(): THREE.Object3D[] {
    return this.objectsToIntersect;
  }
}
