# Cross-Language Implementation Guide

This project defines a deterministic coordinate projection system between Minecraft world coordinates and WGS84 geographic coordinates.

The goal is for implementations in other languages (JavaScript, Python, Rust, etc.) to behave identically down to numerical output.

# Core Concept

The system performs two reversible transformations:

1. Minecraft → Geographic
(x, z) → (latitude, longitude)
2. Geographic → Minecraft
(latitude, longitude) → (x, z)

All transformations are based on a configured GeographicProjection pipeline.

# Data Models

Implementations MUST use equivalent/similar structures:

MinecraftCoordinate
x: double
z: double

GeographicalCoordinate
latitude: double
longitude: double

**IMPORTANT:**

Latitude is always the first component in GeographicalCoordinate
Longitude is always the second

# Core API Behavior
**Minecraft → Geo**
toGeo(MinecraftCoordinate) → GeographicalCoordinate

**Geo → Minecraft**
toMinecraft(GeographicalCoordinate) → MinecraftCoordinate


# Error Handling

If a coordinate is outside projection bounds:

Java behavior:
OutOfProjectionBoundsException is thrown

Implementers MUST choose ONE of:

Throw equivalent exception (recommended)
OR return null / error result type
OR use a Result<T> wrapper

**Do NOT silently clamp or return fake coordinates.**

# Batch Processing

Batch operations are required for performance parity.

**Minecraft → Geo (batch)**
toGeo(MinecraftCoordinate[]) → GeographicalCoordinate[]

**Geo → Minecraft (batch)**
toMinecraf(GeographicalCoordinate[]) → MinecraftCoordinate[]


# Numeric Precision Requirements

All implementations MUST:

Use IEEE 754 double precision (64-bit float)
Avoid float32 unless explicitly porting for constrained environments
Preserve decimal accuracy (no rounding except formatting utilities)

# Implementation Validation

A correct implementation must:

Get the correct output for the randomly generated coordinate pairs in util/coord-pairs/out/*

# Summary

To remain compatible:

Implement only the projection math exactly as defined, keep I/O and parsing outside the core system, and ensure batch + single-item behavior match precisely.