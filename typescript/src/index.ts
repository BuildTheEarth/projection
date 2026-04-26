/**
 * Original Source by @nachwahl, found at https://github.com/Nachwahl/terraconvert
 */

import GeographicProjection from "./projection/GeographicProjection";
import { InvertedOrientation } from "./projection/InvertedOrientation";
import { ModifiedAirocean } from "./projection/ModifiedAirocean";
import { Orientation } from "./projection/Oriantation";
import { ScaleProjection } from "./projection/ScaleProjection";
import { UprightOrientation } from "./projection/UprightOrientation";

const orientProjection = (
  base: GeographicProjection,
  o: Orientation,
): GeographicProjection => {
  if (base.upright()) {
    if (o === Orientation.upright) return base;
    base = new UprightOrientation(base);
  }

  if (o === Orientation.swapped) {
    return new InvertedOrientation(base);
  } else if (o === Orientation.upright) {
    base = new UprightOrientation(base);
  }

  return base;
};

const projection: GeographicProjection = new ModifiedAirocean();
const uprightProj: GeographicProjection = orientProjection(
  projection,
  Orientation.upright,
);
const scaleProj: ScaleProjection = new ScaleProjection(
  uprightProj,
  7318261.522857145,
  7318261.522857145,
);

export type GeographicCoordinate =
  | {
      lat: number;
      lon: number;
    }
  | [number, number];

export type MinecraftCoordinate =
  | {
      x: number;
      z: number;
    }
  | [number, number];

/**
 * Converts real life coordinates to in-game coordinates
 * @param geo - GeograpicCoordinate, either as an object with lat and lon properties or as a tuple [lat, lon]
 * @param opts - Optional settings, currently supports returnObject to return an object instead of a tuple
 * @returns {MinecraftCoordinate} - In-game coordinates, either as an object with x and z properties or as a tuple [x, z]
 */
export const fromGeo = (
  geo: GeographicCoordinate,
  opts?: { returnObject?: boolean },
): MinecraftCoordinate => {
  const [lon, lat] = Array.isArray(geo) ? geo : [geo.lon, geo.lat];

  const [x, z] = scaleProj.fromGeo(lon, lat);
  return opts?.returnObject ? { x, z } : [x, z];
};

/**
 * Converts in-game coordinates to real life coordinates
 * @param mc - MinecraftCoordinate, either as an object with x and z properties or as a tuple [x, z]
 * @param opts - Optional settings, currently supports returnObject to return an object instead of a tuple
 * @returns {GeographicCoordinate} - real life coordinates, either as an object with lat and lon properties or as a tuple [lat, lon]
 */
export const toGeo = (
  mc: MinecraftCoordinate,
  opts?: { returnObject?: boolean },
): GeographicCoordinate => {
  const [x, z] = Array.isArray(mc) ? mc : [mc.x, mc.z];

  const [lon, lat] = scaleProj.toGeo(x, z);
  return opts?.returnObject ? { lat, lon } : [lat, lon];
};
