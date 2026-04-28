package net.buildtheearth.model;

public record MinecraftCoordinate(double x, double z) {

    public int blockX() {
        return (int) x;
    }

    public int blockZ() {
        return (int) z;
    }
}
