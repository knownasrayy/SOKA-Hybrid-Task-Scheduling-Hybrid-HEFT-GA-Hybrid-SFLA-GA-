import * as THREE from 'three';
import { PALETTE_3D } from './palette';

export interface RaycastHit {
  type: 'task' | 'vm' | 'frog' | 'node' | 'podium' | 'dna' | 'drone';
  id: number | string;
  name: string;
  details: string;
}

interface AnimatedFrog {
  group: THREE.Group;
  hindLeft: THREE.Object3D;
  hindRight: THREE.Object3D;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  phase: number;
  speed: number;
  ripple: THREE.Mesh;
  crossoverRing?: THREE.Mesh;
}

interface DataPacket {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  offset: number;
  speed: number;
}

export class WorldScene {
  public scene: THREE.Scene;
  private objectsToIntersect: THREE.Object3D[] = [];

  // Animated references
  private clouds: { group: THREE.Group; speed: number; baseY: number; phase: number }[] = [];
  private portalOuter: THREE.Mesh | null = null;
  private portalInner: THREE.Mesh | null = null;
  private portalCore: THREE.Mesh | null = null;
  private dnaHelix: THREE.Group | null = null;
  private architectDrone: THREE.Group | null = null;
  private droneCurve: THREE.CatmullRomCurve3 | null = null;
  private vmHalos: THREE.Mesh[] = [];
  private dagCrystals: { mesh: THREE.Mesh; baseY: number; phase: number }[] = [];
  private frogs: AnimatedFrog[] = [];
  private dataPackets: DataPacket[] = [];
  private trophyGroup: THREE.Group | null = null;
  private trophySparkles: { mesh: THREE.Mesh; angle: number; radius: number; baseY: number }[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    // Bright sunlit ITS sky
    this.scene.background = new THREE.Color(PALETTE_3D.skyTop);
    this.scene.fog = new THREE.FogExp2(PALETTE_3D.fogColor, 0.0085);

    this.setupLighting();
    this.buildSkyClouds();
    this.buildCentralHubIsland();
    this.buildHeftGaIsland();
    this.buildSflaGaIsland();
    this.buildEnergySplineBridges();
    this.buildWinnerPodium();
  }

  private setupLighting() {
    // Soft daylight hemisphere (sky blue above, warm grass/stone bounce below)
    const hemiLight = new THREE.HemisphereLight(0xd9f2ff, 0x8db89d, 1.05);
    hemiLight.position.set(0, 40, 0);
    this.scene.add(hemiLight);

    // Warm golden directional sunlight
    const sunLight = new THREE.DirectionalLight(PALETTE_3D.sunColor, 1.45);
    sunLight.position.set(28, 42, 24);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    this.scene.add(sunLight);

    // Cool ITS blue rim fill light from opposite angle for sculpted depth
    const rimLight = new THREE.DirectionalLight(PALETTE_3D.itsBlueLight, 0.65);
    rimLight.position.set(-25, 18, -20);
    this.scene.add(rimLight);
  }

  /** Helper: Procedural sculpted floating sky island with tapered rocky underside */
  private createFloatingIsland(
    radius: number,
    topColor: number,
    rimColor: number,
    pos: THREE.Vector3
  ): THREE.Group {
    const group = new THREE.Group();
    group.position.copy(pos);

    // Tapered organic rocky underside (faceted low-poly cliff)
    const underGeo = new THREE.ConeGeometry(radius * 0.96, radius * 0.95, 11, 3);
    const posAttr = underGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      // Deterministic organic crag displacement
      const noise = Math.sin(x * 0.9 + z * 0.7) * 0.45 + Math.cos(y * 1.1 - x * 0.5) * 0.35;
      if (y < radius * 0.4) {
        posAttr.setX(i, x + noise * 0.6);
        posAttr.setZ(i, z + noise * 0.6);
      }
    }
    underGeo.computeVertexNormals();
    const rockMat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.islandRock,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true
    });
    const underMesh = new THREE.Mesh(underGeo, rockMat);
    underMesh.rotation.x = Math.PI;
    underMesh.position.y = -radius * 0.47;
    group.add(underMesh);

    // Lush sculpted top plateau
    const topGeo = new THREE.CylinderGeometry(radius, radius * 0.94, 1.1, 14);
    const topMat = new THREE.MeshStandardMaterial({
      color: topColor,
      roughness: 0.75,
      metalness: 0.05,
      flatShading: true
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.5;
    topMesh.receiveShadow = true;
    group.add(topMesh);

    // Inner decorative trim ring
    const trimGeo = new THREE.TorusGeometry(radius * 0.95, 0.16, 8, 36);
    const trimMat = new THREE.MeshStandardMaterial({
      color: rimColor,
      roughness: 0.4,
      metalness: 0.2
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 1.02;
    group.add(trim);

    return group;
  }

  /** Helper: Stylized low-poly tree */
  private createStylizedTree(scale = 1): THREE.Group {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14 * scale, 0.22 * scale, 1.2 * scale, 6),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.treeTrunk, roughness: 0.9, flatShading: true })
    );
    trunk.position.y = 0.6 * scale;
    tree.add(trunk);

    const foliageMat1 = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.treeLeaf1,
      roughness: 0.7,
      flatShading: true
    });
    const foliageMat2 = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.treeLeaf2,
      roughness: 0.65,
      flatShading: true
    });

    const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.95 * scale, 1.4 * scale, 7), foliageMat1);
    c1.position.y = 1.55 * scale;
    tree.add(c1);

    const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.75 * scale, 1.2 * scale, 7), foliageMat2);
    c2.position.y = 2.25 * scale;
    tree.add(c2);

    const c3 = new THREE.Mesh(new THREE.ConeGeometry(0.45 * scale, 0.9 * scale, 7), foliageMat2);
    c3.position.y = 2.85 * scale;
    tree.add(c3);

    return tree;
  }

  /** Helper: Faceted natural boulder */
  private createRock(scale = 1): THREE.Mesh {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.55 * scale, 0),
      new THREE.MeshStandardMaterial({
        color: PALETTE_3D.islandRockDark,
        roughness: 0.92,
        flatShading: true
      })
    );
    rock.scale.set(1.2, 0.75, 1.0);
    return rock;
  }

  /** Fluffy multi-puff stylized 3D clouds drifting in the sunlit sky */
  private buildSkyClouds() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.cloudWhite,
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.92
    });

    const cloudPositions = [
      [-28, 12, -14],
      [-10, 15, -22],
      [14, 13, -18],
      [30, 11, -10],
      [-32, 7, 8],
      [32, 9, 12],
      [0, 16, -28],
      [-20, 14, 16],
      [22, 14, 18]
    ];

    cloudPositions.forEach(([x, y, z], idx) => {
      const cGroup = new THREE.Group();
      const puffs = [
        { p: [0, 0, 0], r: 2.0 },
        { p: [1.7, -0.2, 0.3], r: 1.5 },
        { p: [-1.7, -0.3, -0.2], r: 1.45 },
        { p: [0.6, 0.75, -0.2], r: 1.35 },
        { p: [-0.7, 0.55, 0.4], r: 1.25 }
      ];
      puffs.forEach((pf) => {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(pf.r, 1), cloudMat);
        m.position.set(pf.p[0], pf.p[1], pf.p[2]);
        m.scale.y = 0.72;
        cGroup.add(m);
      });
      cGroup.position.set(x, y, z);
      this.scene.add(cGroup);
      this.clouds.push({
        group: cGroup,
        speed: 0.12 + (idx % 4) * 0.04,
        baseY: y,
        phase: idx * 1.3
      });
    });
  }

  /** Central Island: ITS Cloud Command Portal & Marble Plaza */
  private buildCentralHubIsland() {
    const hub = this.createFloatingIsland(8.5, PALETTE_3D.marbleLight, PALETTE_3D.itsBlue, new THREE.Vector3(0, 0, 0));

    // Decorative ITS Blue inner plaza ring
    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 4.9, 32),
      new THREE.MeshBasicMaterial({ color: PALETTE_3D.itsBlue, side: THREE.DoubleSide })
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 1.07;
    hub.add(innerRing);

    // 10 Hero Pillars (10 November ITS spirit) around the edge
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const px = Math.cos(angle) * 7.2;
      const pz = Math.sin(angle) * 7.2;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.25, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.marbleTrim, roughness: 0.35, metalness: 0.15 })
      );
      pillar.position.set(px, 1.75, pz);
      hub.add(pillar);

      const cap = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.24),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? PALETTE_3D.itsGold : PALETTE_3D.itsBlue,
          emissive: i % 2 === 0 ? 0x664400 : 0x063052,
          roughness: 0.2,
          metalness: 0.7
        })
      );
      cap.position.set(px, 2.7, pz);
      hub.add(cap);
    }

    // Gyroscopic ITS Cloud Gateway Portal
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 4.8, 0);

    this.portalOuter = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.16, 14, 48),
      new THREE.MeshStandardMaterial({
        color: PALETTE_3D.itsBlue,
        metalness: 0.65,
        roughness: 0.2
      })
    );
    portalGroup.add(this.portalOuter);

    this.portalInner = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.12, 12, 36),
      new THREE.MeshStandardMaterial({
        color: PALETTE_3D.itsGold,
        metalness: 0.8,
        roughness: 0.15
      })
    );
    portalGroup.add(this.portalInner);

    this.portalCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.95, 0),
      new THREE.MeshStandardMaterial({
        color: PALETTE_3D.itsGold,
        emissive: 0x996600,
        metalness: 0.85,
        roughness: 0.1
      })
    );
    this.portalCore.userData = {
      type: 'node',
      name: 'Gerbang Cloud ITS (Task Dispatcher)',
      details: 'Sumber alur kerja komputasi awan (DAG) yang mendistribusikan beban kerja ke Pulau HEFT-GA dan Pulau SFLA-GA.'
    };
    this.objectsToIntersect.push(this.portalCore);
    portalGroup.add(this.portalCore);

    hub.add(portalGroup);

    // Stylized trees on central island perimeter
    [
      [-5.6, 1.0, 4.8, 0.85],
      [5.8, 1.0, 4.6, 0.9],
      [-6.2, 1.0, -3.5, 0.75],
      [6.2, 1.0, -3.5, 0.8]
    ].forEach(([tx, ty, tz, sc]) => {
      const t = this.createStylizedTree(sc);
      t.position.set(tx, ty, tz);
      hub.add(t);
    });

    this.scene.add(hub);
  }

  /** Left Floating Island (x = -17, z = 2): Hybrid HEFT-GA (Architect Drone + Server Towers + DNA Helix) */
  private buildHeftGaIsland() {
    const islandPos = new THREE.Vector3(-17, 0.4, 2);
    const island = this.createFloatingIsland(9.2, PALETTE_3D.marbleLight, PALETTE_3D.itsBlue, islandPos);

    // Lush terraced grass arcs on the edge
    const grassPatch = new THREE.Mesh(
      new THREE.CylinderGeometry(8.9, 8.7, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.islandGrassLight, roughness: 0.8, flatShading: true })
    );
    grassPatch.position.y = 1.02;
    island.add(grassPatch);

    // Central Sapphire Tech Floor Pad
    const techPad = new THREE.Mesh(
      new THREE.CylinderGeometry(6.8, 7.0, 0.24, 12),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.marbleLight, roughness: 0.45, metalness: 0.1 })
    );
    techPad.position.y = 1.1;
    island.add(techPad);

    // 4 Sculpted Architectural Cloud Server Towers (VMs)
    const vmSpecs = [
      { name: 'VM-1 Micro (1000 MIPS)', pos: [-4.2, 1.2, -2.5], h: 3.2, color: PALETTE_3D.vmTiers[0] },
      { name: 'VM-2 Standard (2000 MIPS)', pos: [-4.8, 1.2, 1.5], h: 4.0, color: PALETTE_3D.vmTiers[1] },
      { name: 'VM-3 High-CPU (3000 MIPS)', pos: [-2.2, 1.2, 4.4], h: 4.8, color: PALETTE_3D.vmTiers[2] },
      { name: 'VM-4 Ultra-GPU (4000 MIPS)', pos: [1.8, 1.2, 4.6], h: 5.5, color: PALETTE_3D.vmTiers[3] }
    ];

    vmSpecs.forEach((vm, idx) => {
      const tower = new THREE.Group();
      tower.position.set(vm.pos[0], vm.pos[1], vm.pos[2]);

      // Flared octagonal pedestal
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 1.05, 0.55, 8),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsBlueCover, roughness: 0.35, metalness: 0.4 })
      );
      base.position.y = 0.28;
      tower.add(base);

      // Sleek tapered architectural spire
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.68, vm.h, 8),
        new THREE.MeshStandardMaterial({
          color: PALETTE_3D.marbleLight,
          roughness: 0.25,
          metalness: 0.2
        })
      );
      body.position.y = 0.55 + vm.h / 2;
      body.userData = {
        type: 'vm',
        name: `Menara ${vm.name}`,
        details: `Server Virtual Pulau HEFT-GA. Menerima penjadwalan terurut berdasarkan Upward Rank & EFT tercepat.`
      };
      this.objectsToIntersect.push(body);
      tower.add(body);

      // 4 Vertical glowing sapphire/gold glass fins
      for (let f = 0; f < 4; f++) {
        const ang = (f / 4) * Math.PI * 2;
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, vm.h * 0.78, 0.26),
          new THREE.MeshStandardMaterial({
            color: vm.color,
            emissive: vm.color,
            emissiveIntensity: 0.3,
            roughness: 0.2,
            metalness: 0.5
          })
        );
        fin.position.set(Math.cos(ang) * 0.56, 0.55 + vm.h / 2, Math.sin(ang) * 0.56);
        fin.rotation.y = -ang;
        tower.add(fin);
      }

      // Rotating telemetry halo ring
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(0.82, 0.055, 8, 28),
        new THREE.MeshStandardMaterial({
          color: vm.color,
          emissive: vm.color,
          emissiveIntensity: 0.4
        })
      );
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 0.7 + vm.h * 0.75;
      tower.add(halo);
      this.vmHalos.push(halo);

      // Top beacon crystal
      const tip = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsGold, emissive: 0x885500, metalness: 0.8, roughness: 0.1 })
      );
      tip.position.y = 0.9 + vm.h;
      tower.add(tip);

      island.add(tower);
    });

    // Floating DAG Blueprint Crystal Constellation (Top-left above island)
    const dagCoords = [
      [-1.0, 6.8, -3.2],
      [-2.8, 5.5, -1.6],
      [0.6, 5.5, -1.8],
      [-1.2, 4.2, -0.4],
      [1.4, 4.1, 0.2]
    ];
    dagCoords.forEach(([dx, dy, dz], i) => {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
        new THREE.MeshStandardMaterial({
          color: i === 0 ? PALETTE_3D.itsGold : PALETTE_3D.itsSky,
          emissive: i === 0 ? 0x774e00 : 0x0a4966,
          roughness: 0.15,
          metalness: 0.6
        })
      );
      crystal.position.set(dx, dy, dz);
      crystal.userData = {
        type: 'task',
        name: `Kristal Tugas DAG T${i + 1}`,
        details: `Node graf dependensi HEFT. Upward Rank: ${(145 - i * 24).toFixed(1)} · Menunggu pemetaan EFT ke VM tercepat.`
      };
      this.objectsToIntersect.push(crystal);
      island.add(crystal);
      this.dagCrystals.push({ mesh: crystal, baseY: dy, phase: i * 1.1 });
    });

    // Connect DAG crystals with glowing filaments
    const dagEdges = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4]];
    dagEdges.forEach(([a, b]) => {
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(...dagCoords[a]),
        new THREE.Vector3(...dagCoords[b])
      );
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 4, 0.04, 6, false),
        new THREE.MeshBasicMaterial({ color: PALETTE_3D.itsBlueLight, transparent: true, opacity: 0.8 })
      );
      island.add(tube);
    });

    // True 3D DNA Double-Helix Bio-Reactor (GA Population seeded by HEFT)
    const reactorPos = new THREE.Vector3(3.2, 1.2, -1.2);
    const reactorPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.2, 0.65, 16),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsBlueCover, roughness: 0.3, metalness: 0.45 })
    );
    reactorPedestal.position.set(reactorPos.x, 1.45, reactorPos.z);
    island.add(reactorPedestal);

    this.dnaHelix = new THREE.Group();
    this.dnaHelix.position.set(reactorPos.x, 2.0, reactorPos.z);

    const strand1Pts: THREE.Vector3[] = [];
    const strand2Pts: THREE.Vector3[] = [];
    const turns = 2.2;
    const height = 5.4;
    const radius = 1.05;
    const steps = 36;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 2 * turns;
      const y = t * height;
      strand1Pts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
      strand2Pts.push(new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius));
    }

    const backbone1 = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strand1Pts), 48, 0.1, 8, false),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsBlue, metalness: 0.5, roughness: 0.25 })
    );
    const backbone2 = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strand2Pts), 48, 0.1, 8, false),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsGold, metalness: 0.65, roughness: 0.2 })
    );
    this.dnaHelix.add(backbone1, backbone2);

    // Colorful Gene Base-Pair Rungs (12 genes representing VM assignments)
    for (let r = 1; r <= 11; r++) {
      const idx = Math.floor((r / 12) * steps);
      const p1 = strand1Pts[idx];
      const p2 = strand2Pts[idx];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const len = p1.distanceTo(p2);

      const rung = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, len, 6),
        new THREE.MeshStandardMaterial({
          color: PALETTE_3D.vmTiers[r % 4],
          emissive: PALETTE_3D.vmTiers[r % 4],
          emissiveIntensity: 0.25,
          roughness: 0.3
        })
      );
      rung.position.copy(mid);
      rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
      rung.userData = {
        type: 'dna',
        name: `Reaktor DNA GA · Gen #${r}`,
        details: `Kromosom yang telah disuntik bibit unggul HEFT (Pola B: Seeding Relay). Menjalankan Crossover 2-Titik & Mutasi Integer.`
      };
      this.objectsToIntersect.push(rung);
      this.dnaHelix.add(rung);
    }
    island.add(this.dnaHelix);

    // Sculpted HEFT Architect Scout Drone carrying the Golden Relay Baton
    this.architectDrone = new THREE.Group();
    const fuselage = new THREE.Mesh(
      new THREE.ConeGeometry(0.32, 1.35, 8),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsBlue, metalness: 0.6, roughness: 0.2 })
    );
    fuselage.rotation.x = Math.PI / 2;
    this.architectDrone.add(fuselage);

    // Swept aerodynamic wings
    const wingGeo = new THREE.BoxGeometry(2.1, 0.08, 0.55);
    const wingMat = new THREE.MeshStandardMaterial({ color: PALETTE_3D.marbleLight, metalness: 0.4, roughness: 0.25 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0.05, 0.1);
    this.architectDrone.add(wings);

    // Glowing Golden Relay Baton carried underneath!
    const baton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.85, 10),
      new THREE.MeshStandardMaterial({
        color: PALETTE_3D.itsGold,
        emissive: 0xaa7700,
        metalness: 0.9,
        roughness: 0.1
      })
    );
    baton.rotation.z = Math.PI / 2;
    baton.position.set(0, -0.32, 0);
    baton.userData = {
      type: 'drone',
      name: 'Drone Arsitek HEFT + Tongkat Estafet Emas',
      details: 'Analogi Pola B (Seeding Relay): Menyusun jadwal deterministik HEFT lalu menyerahkannya sebagai bibit unggul ke Reaktor DNA GA!'
    };
    this.objectsToIntersect.push(baton);
    this.architectDrone.add(baton);

    // Drone flight loop from DAG constellation to DNA Reactor & Server Towers (in world coords)
    this.droneCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-18, 7.6, -0.5),
        new THREE.Vector3(-13.8, 6.2, 0.8),
        new THREE.Vector3(-14.2, 4.8, 5.2),
        new THREE.Vector3(-20.8, 6.4, 3.2),
        new THREE.Vector3(-20.2, 7.2, -1.2)
      ],
      true
    );
    this.scene.add(this.architectDrone);

    // Decorative trees & boulders on left island perimeter
    [
      [-7.2, 1.0, -3.2, 1.05],
      [-7.5, 1.0, 2.5, 0.85],
      [6.5, 1.0, 3.8, 0.95],
      [6.8, 1.0, -4.0, 0.85],
      [0.5, 1.0, -7.2, 1.0]
    ].forEach(([tx, ty, tz, sc]) => {
      const tr = this.createStylizedTree(sc);
      tr.position.set(tx, ty, tz);
      island.add(tr);
    });

    this.scene.add(island);
  }

  /** Helper: Sculpted Articulated 3D Frog (10-part organic mesh!) */
  private createSculptedFrog(bodyColor: number, isBest: boolean): {
    group: THREE.Group;
    hindLeft: THREE.Object3D;
    hindRight: THREE.Object3D;
  } {
    const frog = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.45,
      metalness: 0.08
    });
    const bellyMat = new THREE.MeshStandardMaterial({
      color: 0xfef9c3,
      roughness: 0.6
    });

    // Plump oval torso
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 12), skinMat);
    torso.scale.set(1.05, 0.72, 1.25);
    torso.position.y = 0.34;
    frog.add(torso);

    // Soft belly
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), bellyMat);
    belly.scale.set(0.95, 0.5, 1.1);
    belly.position.set(0, 0.24, 0.04);
    frog.add(belly);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), skinMat);
    head.scale.set(1.1, 0.78, 0.95);
    head.position.set(0, 0.48, 0.38);
    frog.add(head);

    // Two bulging white eyes with black pupils
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
    [-0.18, 0.18].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), whiteMat);
      eye.position.set(ex, 0.68, 0.46);
      frog.add(eye);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), pupilMat);
      pupil.position.set(ex * 1.05, 0.7, 0.55);
      frog.add(pupil);
    });

    // Articulated Hind Legs (animated during leap!)
    const makeHindLeg = (side: number) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(side * 0.36, 0.24, -0.18);

      const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), skinMat);
      thigh.scale.set(0.7, 0.7, 1.45);
      thigh.position.set(side * 0.05, 0.04, -0.05);
      legGroup.add(thigh);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.32), skinMat);
      foot.position.set(side * 0.12, -0.15, 0.1);
      legGroup.add(foot);

      frog.add(legGroup);
      return legGroup;
    };

    const hindLeft = makeHindLeg(-1);
    const hindRight = makeHindLeg(1);

    // Front legs
    [-0.26, 0.26].forEach((fx) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.32, 6), skinMat);
      arm.position.set(fx, 0.18, 0.36);
      arm.rotation.x = 0.35;
      frog.add(arm);
    });

    // Floating Golden Crown for Memeplex Leader (Xb)
    if (isBest) {
      const crown = new THREE.Mesh(
        new THREE.TorusGeometry(0.22, 0.05, 8, 16),
        new THREE.MeshStandardMaterial({
          color: PALETTE_3D.itsGold,
          emissive: 0x996600,
          metalness: 0.9,
          roughness: 0.1
        })
      );
      crown.rotation.x = Math.PI / 2;
      crown.position.set(0, 0.96, 0.35);
      frog.add(crown);
    }

    return { group: frog, hindLeft, hindRight };
  }

  /** Helper: Notched Lily Pad + Multi-Petal Blooming Lotus Flower */
  private createLotusPad(radius: number, withFlower: boolean): THREE.Group {
    const padGroup = new THREE.Group();

    // True notched lily pad disc (V-notch gap)
    const padGeo = new THREE.CircleGeometry(radius, 24, 0.22, Math.PI * 1.84);
    const padMat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.lilyPad,
      roughness: 0.55,
      side: THREE.DoubleSide
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.rotation.x = -Math.PI / 2;
    padGroup.add(pad);

    if (withFlower) {
      const flower = new THREE.Group();
      flower.position.set(radius * 0.28, 0.06, -radius * 0.22);

      const petalMat = new THREE.MeshStandardMaterial({
        color: PALETTE_3D.lotusPink,
        roughness: 0.4,
        side: THREE.DoubleSide
      });
      // Outer ring of 6 angled petals
      for (let p = 0; p < 6; p++) {
        const ang = (p / 6) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 4), petalMat);
        petal.position.set(Math.cos(ang) * 0.18, 0.12, Math.sin(ang) * 0.18);
        petal.rotation.z = -Math.cos(ang) * 0.65;
        petal.rotation.x = Math.sin(ang) * 0.65;
        flower.add(petal);
      }
      // Golden stamen center
      const stamen = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsGold, emissive: 0x664400 })
      );
      stamen.position.y = 0.16;
      flower.add(stamen);

      padGroup.add(flower);
    }

    return padGroup;
  }

  /** Right Floating Island (x = +17, z = 2): Jade Lotus Pond & Leaping Articulated 3D Frogs (SFLA-GA) */
  private buildSflaGaIsland() {
    const islandPos = new THREE.Vector3(17, 0.4, 2);
    const island = this.createFloatingIsland(9.6, PALETTE_3D.islandGrass, PALETTE_3D.itsTosca, islandPos);

    // Sandy shore rim
    const shore = new THREE.Mesh(
      new THREE.RingGeometry(6.8, 7.8, 32),
      new THREE.MeshStandardMaterial({ color: PALETTE_3D.islandSand, roughness: 0.9, side: THREE.DoubleSide })
    );
    shore.rotation.x = -Math.PI / 2;
    shore.position.y = 1.07;
    island.add(shore);

    // Shimmering Turquoise Pond Water
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(7.0, 6.8, 0.16, 36),
      new THREE.MeshStandardMaterial({
        color: PALETTE_3D.pondWater,
        roughness: 0.12,
        metalness: 0.25,
        transparent: true,
        opacity: 0.88
      })
    );
    water.position.y = 1.04;
    island.add(water);

    // 4 Memeplex Habitat Rings + Lily Pads + Articulated Leaping Frogs
    const memeplexCenters = [
      { x: -2.8, z: -2.6, color: PALETTE_3D.vmTiers[0], label: 'Memeplex #1 (Biru ITS)' },
      { x: 2.8, z: -2.6, color: PALETTE_3D.vmTiers[2], label: 'Memeplex #2 (Tosca)' },
      { x: -2.8, z: 2.6, color: PALETTE_3D.itsCrusta, label: 'Memeplex #3 (Oranye)' },
      { x: 2.8, z: 2.6, color: PALETTE_3D.baseline2, label: 'Memeplex #4 (Ungu)' }
    ];

    memeplexCenters.forEach((mem, memIdx) => {
      // Glowing habitat ring on water surface
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.15, 2.32, 32),
        new THREE.MeshBasicMaterial({ color: mem.color, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(mem.x, 1.15, mem.z);
      island.add(ring);

      // 3 Lily pads + 3 Articulated Frogs per memeplex (12 frogs total)
      const padOffsets = [
        [0, 0],
        [-1.15, 0.95],
        [1.15, -0.85]
      ];

      padOffsets.forEach(([ox, oz], fIdx) => {
        const px = mem.x + ox;
        const pz = mem.z + oz;
        const pad = this.createLotusPad(fIdx === 0 ? 0.92 : 0.72, fIdx === 0);
        pad.position.set(px, 1.16, pz);
        pad.rotation.y = (memIdx + fIdx) * 1.4;
        island.add(pad);

        const isBest = fIdx === 0;
        const isWorst = fIdx === 2;
        const frogBodyColor = isBest ? PALETTE_3D.itsTosca : isWorst ? PALETTE_3D.itsCrusta : mem.color;
        const { group: frogGroup, hindLeft, hindRight } = this.createSculptedFrog(frogBodyColor, isBest);

        // Next pad in memeplex for parabolic leap target
        const nextOff = padOffsets[(fIdx + 1) % padOffsets.length];
        const startPos = new THREE.Vector3(px, 1.18, pz);
        const endPos = new THREE.Vector3(mem.x + nextOff[0], 1.18, mem.z + nextOff[1]);
        frogGroup.position.copy(startPos);

        // Make frog selectable via raycasting
        frogGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.userData = {
              type: 'frog',
              name: `Katak ${isBest ? 'Pemimpin (Xb)' : isWorst ? 'Terburuk (Xw · Evolusi GA)' : 'Anggota'} · ${mem.label}`,
              details: isWorst
                ? 'Analogi Pola C (Teamwork): Katak ini melompat & dimutasi memakai operator Crossover + Mutasi GA agar lolos dari jebakan lokal optima!'
                : 'Setiap katak mewakili satu jadwal cloud utuh di dalam kolam habitat Memeplex SFLA-GA.'
            };
            this.objectsToIntersect.push(child);
          }
        });
        island.add(frogGroup);

        // Expanding water ripple ring under the frog
        const ripple = new THREE.Mesh(
          new THREE.RingGeometry(0.3, 0.42, 24),
          new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
        );
        ripple.rotation.x = -Math.PI / 2;
        ripple.position.set(px, 1.15, pz);
        island.add(ripple);

        // Golden GA Crossover Halo around worst frog (Xw)
        let crossoverRing: THREE.Mesh | undefined;
        if (isWorst) {
          crossoverRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.65, 0.045, 8, 24),
            new THREE.MeshStandardMaterial({
              color: PALETTE_3D.itsGold,
              emissive: 0xaa6600,
              transparent: true,
              opacity: 0.85
            })
          );
          crossoverRing.rotation.x = Math.PI / 2;
          crossoverRing.position.y = 0.55;
          frogGroup.add(crossoverRing);
        }

        this.frogs.push({
          group: frogGroup,
          hindLeft,
          hindRight,
          startPos,
          endPos,
          phase: memIdx * 1.5 + fIdx * 2.1,
          speed: isWorst ? 1.15 : 0.75,
          ripple,
          crossoverRing
        });
      });
    });

    // Lush stylized trees & natural boulders around the pond bank
    [
      [-7.8, 1.0, -3.2, 1.1],
      [-7.5, 1.0, 3.8, 0.95],
      [7.8, 1.0, -2.8, 1.15],
      [7.6, 1.0, 3.5, 0.9],
      [0.4, 1.0, -8.0, 1.05],
      [-2.0, 1.0, 8.0, 0.85],
      [3.2, 1.0, 7.6, 0.95]
    ].forEach(([tx, ty, tz, sc]) => {
      const tr = this.createStylizedTree(sc);
      tr.position.set(tx, ty, tz);
      island.add(tr);
    });

    [
      [-6.8, 1.15, -5.0, 1.1],
      [6.6, 1.15, -5.2, 0.95],
      [6.2, 1.15, 5.8, 1.2],
      [-6.0, 1.15, 5.5, 0.9]
    ].forEach(([rx, ry, rz, sc]) => {
      const rk = this.createRock(sc);
      rk.position.set(rx, ry, rz);
      island.add(rk);
    });

    this.scene.add(island);
  }

  /** Curved Glowing Energy Spline Bridges carrying animated Cloud Task Packets to both islands */
  private buildEnergySplineBridges() {
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 4.6, 0.4),
      new THREE.Vector3(-8.5, 6.2, 1.4),
      new THREE.Vector3(-13.8, 4.4, 2.0)
    ]);

    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.4, 4.6, 0.4),
      new THREE.Vector3(8.5, 6.2, 1.4),
      new THREE.Vector3(13.8, 4.4, 2.0)
    ]);

    const leftBridge = new THREE.Mesh(
      new THREE.TubeGeometry(leftCurve, 32, 0.08, 8, false),
      new THREE.MeshBasicMaterial({ color: PALETTE_3D.itsBlue, transparent: true, opacity: 0.55 })
    );
    const rightBridge = new THREE.Mesh(
      new THREE.TubeGeometry(rightCurve, 32, 0.08, 8, false),
      new THREE.MeshBasicMaterial({ color: PALETTE_3D.itsTosca, transparent: true, opacity: 0.55 })
    );
    this.scene.add(leftBridge, rightBridge);

    // Animated diamond task packets streaming along both bridges
    for (let i = 0; i < 4; i++) {
      const pktL = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsBlue, emissive: 0x0a4a7a, roughness: 0.15, metalness: 0.6 })
      );
      this.scene.add(pktL);
      this.dataPackets.push({ mesh: pktL, curve: leftCurve, offset: i * 0.25, speed: 0.22 });

      const pktR = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28),
        new THREE.MeshStandardMaterial({ color: PALETTE_3D.itsTosca, emissive: 0x065c55, roughness: 0.15, metalness: 0.6 })
      );
      this.scene.add(pktR);
      this.dataPackets.push({ mesh: pktR, curve: rightCurve, offset: i * 0.25 + 0.12, speed: 0.22 });
    }
  }

  /** Sculpted 3-Tier Marble & Gold Winner Podium (z = -14) */
  private buildWinnerPodium() {
    const podiumIsland = this.createFloatingIsland(6.2, PALETTE_3D.marbleLight, PALETTE_3D.itsGold, new THREE.Vector3(0, 0.8, -15));

    const tiers = [
      { x: -2.4, h: 1.5, color: PALETTE_3D.itsTosca, label: 'Juara 2 · Hybrid SFLA-GA (Pola C)' },
      { x: 0, h: 2.6, color: PALETTE_3D.itsGold, label: 'Juara 1 · Pemenang Skor Komposit (N=30 Run)' },
      { x: 2.4, h: 1.0, color: PALETTE_3D.itsCrusta, label: 'Juara 3 · Baseline Murni (SFLA / WCA)' }
    ];

    tiers.forEach((t, idx) => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.18, t.h, 8),
        new THREE.MeshStandardMaterial({
          color: PALETTE_3D.marbleLight,
          roughness: 0.3,
          metalness: 0.15
        })
      );
      col.position.set(t.x, 1.05 + t.h / 2, 0);
      col.userData = {
        type: 'podium',
        name: t.label,
        details: 'Peringkat berdasarkan evaluasi empiris Makespan, Biaya Cloud, Utilisasi VM, dan Load Balance.'
      };
      this.objectsToIntersect.push(col);
      podiumIsland.add(col);

      // Colored trim crown on each podium tier
      const cap = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.1, 8, 24),
        new THREE.MeshStandardMaterial({ color: t.color, metalness: 0.7, roughness: 0.2 })
      );
      cap.rotation.x = Math.PI / 2;
      cap.position.set(t.x, 1.05 + t.h, 0);
      podiumIsland.add(cap);
    });

    // Sculpted Multi-Part Golden Chalice Trophy on Tier 1
    this.trophyGroup = new THREE.Group();
    this.trophyGroup.position.set(0, 3.85, 0);

    const goldMat = new THREE.MeshStandardMaterial({
      color: PALETTE_3D.itsGold,
      emissive: 0x775200,
      metalness: 0.9,
      roughness: 0.12
    });

    const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.58, 0.25, 12), goldMat);
    const tStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 0.7, 10), goldMat);
    tStem.position.y = 0.45;
    const tCup = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.26, 0.85, 16), goldMat);
    tCup.position.y = 1.15;

    // Two arched trophy handles
    [-0.52, 0.52].forEach((hx) => {
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 16), goldMat);
      handle.position.set(hx, 1.18, 0);
      this.trophyGroup!.add(handle);
    });

    // Floating Wijayakusuma Diamond Star above cup
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), goldMat);
    star.position.y = 1.95;

    this.trophyGroup.add(tBase, tStem, tCup, star);
    podiumIsland.add(this.trophyGroup);

    // Floating celebratory golden sparkles orbiting the trophy
    for (let s = 0; s < 10; s++) {
      const sp = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.11, 0),
        new THREE.MeshBasicMaterial({ color: s % 2 === 0 ? PALETTE_3D.itsGold : PALETTE_3D.itsSky })
      );
      const angle = (s / 10) * Math.PI * 2;
      const radius = 1.35 + (s % 3) * 0.35;
      const baseY = 4.2 + (s % 4) * 0.45;
      sp.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
      podiumIsland.add(sp);
      this.trophySparkles.push({ mesh: sp, angle, radius, baseY });
    }

    this.scene.add(podiumIsland);
  }

  public getIntersectables(): THREE.Object3D[] {
    return this.objectsToIntersect;
  }

  /** Smooth real-time animation tick */
  public update(elapsedTime: number) {
    // 1. Drifting clouds
    this.clouds.forEach((c) => {
      c.group.position.x += Math.sin(elapsedTime * c.speed + c.phase) * 0.008;
      c.group.position.y = c.baseY + Math.sin(elapsedTime * 0.45 + c.phase) * 0.3;
    });

    // 2. Central ITS Cloud Gateway Portal
    if (this.portalOuter) this.portalOuter.rotation.z = elapsedTime * 0.45;
    if (this.portalInner) {
      this.portalInner.rotation.x = elapsedTime * 0.7;
      this.portalInner.rotation.y = elapsedTime * 0.5;
    }
    if (this.portalCore) {
      this.portalCore.rotation.y = -elapsedTime * 1.1;
      this.portalCore.position.y = Math.sin(elapsedTime * 2.2) * 0.16;
    }

    // 3. Rotating VM Telemetry Halos & Floating DAG Crystals
    this.vmHalos.forEach((halo, idx) => {
      halo.rotation.z = elapsedTime * (0.9 + idx * 0.2);
    });
    this.dagCrystals.forEach((c) => {
      c.mesh.position.y = c.baseY + Math.sin(elapsedTime * 2.0 + c.phase) * 0.22;
      c.mesh.rotation.y = elapsedTime * 0.8 + c.phase;
    });

    // 4. Spinning 3D DNA Double Helix
    if (this.dnaHelix) {
      this.dnaHelix.rotation.y = elapsedTime * 0.75;
    }

    // 5. HEFT Architect Scout Drone gliding along relay curve
    if (this.architectDrone && this.droneCurve) {
      const t = (elapsedTime * 0.11) % 1;
      const pos = this.droneCurve.getPointAt(t);
      const nextPos = this.droneCurve.getPointAt((t + 0.02) % 1);
      this.architectDrone.position.copy(pos);
      this.architectDrone.lookAt(nextPos);
    }

    // 6. Articulated 3D Frogs leaping in parabolic arcs + water ripples + GA spark halo
    this.frogs.forEach((f) => {
      const cycle = (elapsedTime * f.speed + f.phase) % (Math.PI * 2);
      // Leap happens during first 45% of cycle; rest/crouch during remaining 55%
      const jumpFrac = Math.min(1, cycle / (Math.PI * 0.9));
      const isJumping = cycle < Math.PI * 0.9;

      if (isJumping) {
        const smoothT = 0.5 - 0.5 * Math.cos(jumpFrac * Math.PI);
        f.group.position.lerpVectors(f.startPos, f.endPos, smoothT);
        // Parabolic jump arc
        const jumpHeight = Math.sin(jumpFrac * Math.PI) * 1.45;
        f.group.position.y = f.startPos.y + jumpHeight;

        // Face direction of leap
        f.group.lookAt(
          f.group.parent ? f.endPos.clone().add(f.group.parent.position) : f.endPos
        );

        // Extend hind legs mid-air!
        const legExt = Math.sin(jumpFrac * Math.PI) * 0.85;
        f.hindLeft.rotation.x = legExt;
        f.hindRight.rotation.x = legExt;
      } else {
        // Rest gently on pad & breathe
        const restPos = Math.floor((elapsedTime * f.speed + f.phase) / (Math.PI * 2)) % 2 === 0 ? f.endPos : f.startPos;
        f.group.position.x = f.endPos.x;
        f.group.position.z = f.endPos.z;
        f.group.position.y = restPos.y + Math.sin(elapsedTime * 4 + f.phase) * 0.03;
        f.hindLeft.rotation.x = 0;
        f.hindRight.rotation.x = 0;
      }

      // Expanding water ripple pulse
      const ripScale = 0.7 + ((elapsedTime * 0.9 + f.phase) % 1.4);
      f.ripple.scale.set(ripScale, ripScale, 1);
      (f.ripple.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.55 - (ripScale - 0.7) * 0.38);

      // Spin GA Crossover Halo on worst frog (Xw)
      if (f.crossoverRing) {
        f.crossoverRing.rotation.z = elapsedTime * 2.5;
      }
    });

    // 7. Data packets streaming along energy spline bridges
    this.dataPackets.forEach((p) => {
      const t = (elapsedTime * p.speed + p.offset) % 1;
      p.mesh.position.copy(p.curve.getPointAt(t));
      p.mesh.rotation.y = elapsedTime * 3.0;
      p.mesh.rotation.x = elapsedTime * 1.8;
    });

    // 8. Winner Trophy & Celebratory Sparkles
    if (this.trophyGroup) {
      this.trophyGroup.rotation.y = elapsedTime * 0.9;
      this.trophyGroup.position.y = 3.85 + Math.sin(elapsedTime * 2.2) * 0.18;
    }
    this.trophySparkles.forEach((sp, i) => {
      const a = sp.angle + elapsedTime * 0.9;
      sp.mesh.position.set(
        Math.cos(a) * sp.radius,
        sp.baseY + Math.sin(elapsedTime * 2.5 + i) * 0.28,
        Math.sin(a) * sp.radius
      );
      sp.mesh.rotation.y = elapsedTime * 2;
    });
  }
}
