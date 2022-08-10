export type Point2D = [number, number];
export type Point3D = [number, number, number];

export type DataItem = {
  id: string;
  position: Point3D;
  color?: string;
};
