import { fromGeo, toGeo } from "@bte-germany/terraconvert";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_COUNT = 100;

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

const parseCountFromArgs = (args: string[]): number => {
  let countArg: string | undefined;

  for (const [i, arg] of args.entries()) {

    if (arg === "--count" || arg === "-c") {
      countArg = args[i + 1];
      break;
    }

    if (arg.startsWith("--count=")) {
      countArg = arg.slice("--count=".length);
      break;
    }

    if (!arg.startsWith("-") && countArg === undefined) {
      countArg = arg;
      break;
    }
  }

  if (countArg === undefined) {
    return DEFAULT_COUNT;
  }

  if (!/^\d+$/.test(countArg)) {
    throw new Error(
      `Invalid count \"${countArg}\". Use a positive integer, e.g. 100 or --count 100.`,
    );
  }

  const count = Number(countArg);
  if (!Number.isSafeInteger(count) || count <= 0) {
    throw new Error(
      `Invalid count \"${countArg}\". Use a positive safe integer greater than 0.`,
    );
  }

  return count;
};

const main = async (): Promise<void> => {
  const count = parseCountFromArgs(process.argv.slice(2));
  const output = {
    count,
    pairs: generatePairs(count),
  };

  const outDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "out");
  await mkdir(outDir, { recursive: true });

  // JSON
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
    resolve(outDir, "coord-pairs.csv"),
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
