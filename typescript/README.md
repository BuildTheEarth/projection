<!-- markdownlint-disable -->
<div align="center">

<img width="128" src="https://github.com/BuildTheEarth/assets/blob/main/logos/logo_tools.gif?raw=true" />

# @BuildTheEarth/projection

_Typescript implementation of the BuildTheEarth projection._

![official](https://go.buildtheearth.net/official-shield)
[![chat](https://img.shields.io/discord/706317564904472627.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discord.gg/buildtheearth)

</div>
<!-- markdownlint-restore -->

## Usage

The package exports two functions, `toGeo` and `fromGeo`. You can find their usage below:

### `toGeo`

Converts Minecraft `x` and `z` coordinates to geographical `lat` and `lon` pairs.

```ts
import { toGeo } from "@buildtheearth/projection";

// or: const minecraftCoordinates = {x: 4411832, z: -4736410};
const minecraftCoordinates = [4411832, -4736410];

// or: const geographicalCoordinates = toGeo(minecraftCoordinates, {returnObject: true});
const geographicalCoordinates = toGeo(minecraftCoordinates);

console.log(geographicalCoordinates); // [49.55843154291236, 22.810606562070433]
// {lat: 49.55843154291236, lon: 22.810606562070433}
```

### `fromGeo`

Converts geographical `lat` and `lon` coordinates to Minecraft `x` and `z` pairs.

```ts
import { fromGeo } from "@buildtheearth/projection";

// or: const geographicalCoordinates = {lat: 49.55843154291236, lon: 22.810606562070433};
const geographicalCoordinates = [49.55843154291236, 22.810606562070433];

// or: const minecraftCoordinates = toGeo(geographicalCoordinates, {returnObject: true});
const minecraftCoordinates = fromGeo(geographicalCoordinates);

console.log(minecraftCoordinates); //[4411832, -4736410]
// {x: 4411832, z: -4736410}
```

## Contribute

This package is part of [a repository](https://github.com/BuildTheEarth/projection) containing the implementation of the projection in different languages. If you want to contribute a new language, please read thru the [specification](core-spec/SPECIFICATION.md).
