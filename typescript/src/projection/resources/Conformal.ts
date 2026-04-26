/**
 * Original Source by @nachwahl, found at https://github.com/Nachwahl/terraconvert
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const getConformal = (): string => {
  return readFileSync(resolve(__dirname, "conformal.txt"), "utf8");
};

const getConformalJSON = (): number[][] => {
  return JSON.parse(getConformal()) as number[][];
};

export { getConformal, getConformalJSON };
