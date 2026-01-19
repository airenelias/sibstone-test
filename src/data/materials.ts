import type { Material } from "../types/material";

export const materials: Material[] = [
    {
        id: 1,
        name: "Акрил стандартный",
        width: 760,
        length: 3680,
        widthStep: 760,
        lengthStep: 920,
        thickness: 12,
        cost: 1000,
    },
    {
        id: 2,
        name: "Кварц премиум",
        width: 1600,
        length: 3200,
        widthStep: 800,
        lengthStep: 3200,
        thickness: 20,
        cost: 4000,
    },
    {
        id: 3,
        name: "Кварц стандартный",
        width: 1400,
        length: 3000,
        widthStep: 600,
        lengthStep: 3000,
        thickness: 20,
        cost: 3000,
    },
];
