export type VehicleModel = {
  id: string;
  name: string;
  category: string;
  scenegraph: string;
  sizeScale: number;
  description: string;
  license: string;
};

export const VEHICLE_MODELS: VehicleModel[] = [
  {
    id: "voyager-duck",
    name: "Voyager Duck",
    category: "Road",
    scenegraph:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    sizeScale: 120,
    description: "Playful road marker with strong visibility",
    license: "CC-BY 4.0",
  },
  {
    id: "cesium-explorer",
    name: "Cesium Explorer",
    category: "Character",
    scenegraph:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb",
    sizeScale: 70,
    description: "Human explorer silhouette for personal stories",
    license: "CC-BY 4.0",
  },
  {
    id: "avocado-rider",
    name: "Avocado Rider",
    category: "Road",
    scenegraph:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    sizeScale: 180,
    description: "Stylized icon for whimsical map animations",
    license: "CC-BY 4.0",
  },
  {
    id: "boombox-cruiser",
    name: "Boombox Cruiser",
    category: "Road",
    scenegraph:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
    sizeScale: 90,
    description: "Retro urban storyteller style",
    license: "CC-BY 4.0",
  },
  {
    id: "flight-helmet",
    name: "Flight Helmet",
    category: "Air",
    scenegraph:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF-Binary/FlightHelmet.glb",
    sizeScale: 75,
    description: "Aviation-themed cinematic avatar",
    license: "CC-BY 4.0",
  },
  {
    id: "lantern-route",
    name: "Lantern Route",
    category: "Sea",
    scenegraph:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
    sizeScale: 80,
    description: "Moody route marker for night voyages",
    license: "CC-BY 4.0",
  },
];

export const DEFAULT_MODEL_ID = VEHICLE_MODELS[0].id;
