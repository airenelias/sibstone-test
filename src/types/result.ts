import type { Bin } from "./bin";

export type Result = {
    width: number;
    length: number;
    bins: Bin[];
    success: boolean;
};
