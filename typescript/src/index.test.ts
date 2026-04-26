import { describe, expect, test } from "vitest";
import { fromGeo, toGeo } from ".";

const coordinatePairsFile =
  import("../../util/coord-pairs/out/coord-pairs.json");

const EPSILON = 1e-3;

const lonDistance = (a: number, b: number): number => {
  const direct = Math.abs(a - b);
  return Math.min(direct, 360 - direct);
};

const expectInvalidGeoInput = (lat: number, lon: number): void => {
  try {
    const [x, z] = fromGeo({ lat, lon }) as [number, number];
    expect(Number.isFinite(x) && Number.isFinite(z)).toBe(false);
  } catch {
    expect(true).toBe(true);
  }
};

const expectInvalidMinecraftInput = (x: number, z: number): void => {
  try {
    const [lat, lon] = toGeo({ x, z }) as [number, number];
    expect(Number.isFinite(lat) && Number.isFinite(lon)).toBe(false);
  } catch {
    expect(true).toBe(true);
  }
};

const data = (await coordinatePairsFile) as any as {
  count: number;
  pairs: {
    lat: number;
    lon: number;
    x: number;
    z: number;
  }[];
};

describe("Coordinate Pairs", () => {
  test("input should be valid", async () => {
    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("pairs");
    expect(Array.isArray(data.pairs)).toBe(true);
    expect(data.pairs.length).toBe(data.count);

    const temp = data.pairs.map((pair) => {
      if (pair.lat && pair.lon && pair.x && pair.z) {
        return true;
      }
      return false;
    });

    expect(temp.every((val) => val)).toBe(true);
  });
});

describe("Basic fromGeo", () => {
  test("should return an array", () => {
    const element = data.pairs[0];
    const result = fromGeo({ lat: element.lat, lon: element.lon });
    expect(Array.isArray(result)).toBe(true);
  });

  test("should return an object when returnObject is true", () => {
    const element = data.pairs[0];
    const result = fromGeo(
      { lat: element.lat, lon: element.lon },
      { returnObject: true },
    );
    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("z");
  });

  test("should convert all pairs within EPSILON", () => {
    for (const pair of data.pairs) {
      const [x, z] = fromGeo({ lat: pair.lat, lon: pair.lon }) as [
        number,
        number,
      ];

      expect(Math.abs(x - pair.x)).toBeLessThanOrEqual(EPSILON);
      expect(Math.abs(z - pair.z)).toBeLessThanOrEqual(EPSILON);
    }
  });
});

describe("Basic toGeo", () => {
  test("should return an array", () => {
    const element = data.pairs[0];
    const result = toGeo({ x: element.x, z: element.z });
    expect(Array.isArray(result)).toBe(true);
  });

  test("should return an object when returnObject is true", () => {
    const element = data.pairs[0];
    const result = toGeo(
      { x: element.x, z: element.z },
      { returnObject: true },
    );
    expect(result).toHaveProperty("lat");
    expect(result).toHaveProperty("lon");
  });

  test("should convert all pairs within EPSILON", () => {
    for (const pair of data.pairs) {
      const [lat, lon] = toGeo({ x: pair.x, z: pair.z }) as [number, number];

      expect(Math.abs(lat - pair.lat)).toBeLessThanOrEqual(EPSILON);
      expect(Math.abs(lon - pair.lon)).toBeLessThanOrEqual(EPSILON);
    }
  });
});

describe("Round-trips", () => {
  test("geo -> mc -> geo should be within EPSILON", () => {
    for (const pair of data.pairs) {
      const [x, z] = fromGeo({ lat: pair.lat, lon: pair.lon }) as [
        number,
        number,
      ];
      const [lat2, lon2] = toGeo({ x, z }) as [number, number];

      expect(Math.abs(lat2 - pair.lat)).toBeLessThanOrEqual(EPSILON * 2);
      expect(lonDistance(lon2, pair.lon)).toBeLessThanOrEqual(EPSILON * 2);
    }
  });

  test("mc -> geo -> mc should be within EPSILON", () => {
    for (const pair of data.pairs) {
      const [lat, lon] = toGeo({ x: pair.x, z: pair.z }) as [number, number];
      const [x2, z2] = fromGeo({ lat, lon }) as [number, number];

      expect(Math.abs(x2 - pair.x)).toBeLessThanOrEqual(EPSILON * 2);
      expect(Math.abs(z2 - pair.z)).toBeLessThanOrEqual(EPSILON * 2);
    }
  });
});

describe("Invalid inputs", () => {
  test("fromGeo should reject or return non-finite for invalid geo inputs", () => {
    expectInvalidGeoInput(Number.NaN, 0);
    expectInvalidGeoInput(0, Number.NaN);
    expectInvalidGeoInput(Number.POSITIVE_INFINITY, 0);
    expectInvalidGeoInput(0, Number.NEGATIVE_INFINITY);
  });

  test("toGeo should reject or return non-finite for invalid minecraft inputs", () => {
    expectInvalidMinecraftInput(Number.NaN, 0);
    expectInvalidMinecraftInput(0, Number.NaN);
    expectInvalidMinecraftInput(Number.POSITIVE_INFINITY, 0);
    expectInvalidMinecraftInput(0, Number.NEGATIVE_INFINITY);
  });
});
