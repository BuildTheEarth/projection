import { fromGeo, toGeo } from "@bte-germany/terraconvert";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type CoordinatePair = {
  lat: number;
  lon: number;
  x: number;
  z: number;
};

const randomCoordinate = (): { lat: number; lon: number } => ({
  lat: Number((Math.random() * 180 - 90).toFixed(15)),
  lon: Number((Math.random() * 360 - 180).toFixed(15)),
});

const generatePairs = (count: number): CoordinatePair[] => {
  const pairs: CoordinatePair[] = [];

  while (pairs.length < count) {
    const geo = randomCoordinate();

    try {
      const [x, z] = fromGeo(geo.lat, geo.lon);

      if (Number.isFinite(x) && Number.isFinite(z)) {
        pairs.push({
          lat: geo.lat,
          lon: geo.lon,
          x,
          z,
        });
      }
    } catch {
      // Skip coordinates the projection does not accept.
    }
  }

  return pairs;
};

const main = async (): Promise<void> => {
  const output = {
    count: 100,
    pairs: generatePairs(100),
  };

  const outDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "out");
  await mkdir(outDir, { recursive: true });

  // JSOn
  await writeFile(
    resolve(outDir, "coord-pairs.json"),
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8",
  );
  console.log(`Wrote ${output.pairs.length} coordinate pairs as JSON`);

  // CSV
  const csvHeader = "lat,lon,x,z\n";
  const csvRows = output.pairs
    .map((pair) => `${pair.lat},${pair.lon},${pair.x},${pair.z}`)
    .join("\n");
  await writeFile(
    resolve(outDir, "coord-pairs.json"),
    csvHeader + csvRows + "\n",
    "utf8",
  );
  console.log(`Wrote ${output.pairs.length} coordinate pairs as CSV`);

  // GeoJSON
  const geoJson = {
    type: "FeatureCollection",
    features: output.pairs.map((pair) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [pair.lon, pair.lat],
      },
      properties: {
        x: pair.x,
        z: pair.z,
      },
    })),
  };
  await writeFile(
    resolve(outDir, "coord-pairs.geojson"),
    `${JSON.stringify(geoJson, null, 2)}\n`,
    "utf8",
  );
  console.log(`Wrote ${output.pairs.length} coordinate pairs as GeoJSON`);
};

await main();
