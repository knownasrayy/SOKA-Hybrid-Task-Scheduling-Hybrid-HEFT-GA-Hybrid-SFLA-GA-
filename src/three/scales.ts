/**
 * World coordinate scales converting data values to 3D space units (PRD 3D §4.2)
 */
export const SCALES = {
  // Timeline: 1 second makespan = 0.5 world units
  timeToWorldZ: (seconds: number) => seconds * 0.45,

  // VM Lane spacing along X axis
  vmSpacingX: 3.2,

  // Task cube size based on instruction length (MI)
  taskLengthToSize: (mi: number) => Math.max(0.4, Math.min(1.4, mi / 12000)),

  // Datacenter rack height
  rackHeight: 6.0,
  rackWidth: 2.2,
  rackDepth: 1.8,

  // DAG Node spacing
  dagLevelSpacingZ: 4.5,
  dagRankSpacingY: 2.2,

  // Chromosome gene cube size
  geneSize: 0.4,
  strandSpacingY: 0.9,

  // SFLA Pond dimensions
  pondRadius: 14.0,
  memeplexRingRadius: 4.5,
  lilyPadRadius: 1.1,

  // Arena lanes offset
  laneOffsetX: 16.0
};
