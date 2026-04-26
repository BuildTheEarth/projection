package net.buildtheearth;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;

public class TestVectorGenerator {

    public static void main(String[] args) throws IOException {
        Random random = new Random(42);

        FileWriter writer = new FileWriter("test-vectors.json");

        int count = 1000;
        int written = 0;

        int highErrorCount = 0;

        writer.write("[\n");

        for (int i = 0; i < count; i++) {

            double lat = -85 + random.nextDouble() * 170;
            double lon = -180 + random.nextDouble() * 360;

            double[] world = Projection.convertFromGeo(lat, lon);
            double[] back = Projection.convertToGeo(world[0], world[1]);

            double errLat = Math.abs(lat - back[1]);
            double errLon = Math.abs(lon - back[0]);


            // optional: log bad cases, but DO NOT skip them
            if (errLat > 1e-1 || errLon > 1e-1) {
                System.out.println("High error: " + errLat + ", " + errLon);
                highErrorCount++;
            }

            writer.write(String.format(
                    "  {\"lat\": %.8f, \"lon\": %.8f, \"x\": %.8f, \"z\": %.8f}%s\n",
                    lat, lon, world[0], world[1],
                    (written < count - 1 ? "," : "")
            ));

            written++;
        }

        writer.write("]\n");
        writer.close();

        System.out.println("High errors: " + highErrorCount);
        System.out.println("Total generated: " + written);
    }
}