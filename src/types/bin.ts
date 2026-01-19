import type { Rectangle } from "./rectangle";

export type Bin = {
    width: number;
    height: number;
    free: Rectangle[];
    used: Rectangle[];
};
