export type Point2D = [number, number];
export type Point3D = [number, number, number];

export type DataItem = {
  id: string;
  pos: Point3D;
  color: string;
  hidden?: boolean;
};

