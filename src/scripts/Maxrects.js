// TODO typescript

function expandDetails(details) {
    const items = [];
    for (const d of details) {
        for (let i = 0; i < d.quantity; i++) {
            items.push({
                name: d.name,
                width: d.width,
                height: d.length,
            });
        }
    }
    return items;
}

// MAXRECTS-CP-DESCSS-BFF
class MaxRectsBin {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.free = [{ x: 0, y: 0, width, height }];
        this.used = [];
    }

    contactScore = (x, y, w, h) => {
        let score = 0;

        for (const u of this.used) {
            // touching vertically
            if (u.x === x + w || u.x + u.width === x) {
                if (!(u.y >= y + h || u.y + u.height <= y)) score += 1;
            }
            // houching horizontally
            if (u.y === y + h || u.y + u.height === y) {
                if (!(u.x >= x + w || u.x + u.width <= x)) score += 1;
            }
        }

        return -score;
    };

    testInsert(w, h, name) {
        let bestNode = null;
        let bestScore = Infinity;

        for (const r of this.free) {
            const tryPlace = (rw, rh) => {
                if (rw > r.width || rh > r.height) return;

                // score by contact points (CP)
                let score = this.contactScore(r.x, r.y, rw, rh);

                if (score < bestScore) {
                    bestScore = score;
                    bestNode = { x: r.x, y: r.y, width: rw, height: rh, name };
                }
            };

            tryPlace(w, h);
            tryPlace(h, w);
        }

        if (!bestNode) return null;

        return { node: bestNode, score: bestScore };
    }

    intersects(a, b) {
        return !(b.x >= a.x + a.width || b.x + b.width <= a.x || b.y >= a.y + a.height || b.y + b.height <= a.y);
    }

    place(node) {
        const newFree = [];

        for (const r of this.free) {
            if (!this.intersects(r, node)) {
                newFree.push(r);
                continue;
            }

            // split horizontally
            if (node.y > r.y && node.y < r.y + r.height) {
                newFree.push({
                    x: r.x,
                    y: r.y,
                    width: r.width,
                    height: node.y - r.y,
                });
            }
            if (node.y + node.height < r.y + r.height) {
                newFree.push({
                    x: r.x,
                    y: node.y + node.height,
                    width: r.width,
                    height: r.y + r.height - (node.y + node.height),
                });
            }

            // split vertically
            if (node.x > r.x && node.x < r.x + r.width) {
                newFree.push({
                    x: r.x,
                    y: r.y,
                    width: node.x - r.x,
                    height: r.height,
                });
            }
            if (node.x + node.width < r.x + r.width) {
                newFree.push({
                    x: node.x + node.width,
                    y: r.y,
                    width: r.x + r.width - (node.x + node.width),
                    height: r.height,
                });
            }
        }

        this.free = this.prune(newFree);
        this.used.push(node);
    }

    prune(rects) {
        return rects.filter(
            (a) =>
                !rects.some(
                    (b) =>
                        a !== b &&
                        a.x >= b.x &&
                        a.y >= b.y &&
                        a.x + a.width <= b.x + b.width &&
                        a.y + a.height <= b.y + b.height,
                ),
        );
    }
}

function packIntoBestBins(items, bins) {
    for (const item of items) {
        let bestBin = null;
        let bestPlacement = null;

        // go through bins and bick best one (BFF)
        for (const bin of bins) {
            const test = bin.testInsert(item.width, item.height, item.name);
            if (!test) continue;

            if (!bestPlacement || test.score < bestPlacement.score) {
                bestPlacement = test;
                bestBin = bin;
            }
        }

        if (!bestBin) return false;

        bestBin.place(bestPlacement.node);
    }

    return {
        reason: "",
        success: true,
    };
}

export function packDetailsNew(details, materialWidth, materialLength, widthStep, lengthStep) {
    // get each detail quantity as array
    const items = expandDetails(details);
    // short side desceding order (DESCSS)
    items.sort((a, b) => Math.min(b.width, b.height) - Math.min(a.width, a.height));

    let bins = [];
    let completed = false;

    let maxWidth = widthStep;
    let maxHeight = lengthStep;

    while (!completed) {
        if (packIntoBestBins(items, bins)) {
            completed = true;
            break;
        }

        let materialAvailable = false;
        for (let i = 0; i < bins.length; i++) {
            // if material sheet is not maximum allowed width
            if (bins[i].width < materialWidth) {
                // increase bin width
                bins[i] = new MaxRectsBin(bins[i].width + widthStep, bins[i].height);
                maxWidth = Math.max(maxWidth, bins[i].width);
                materialAvailable = true;
                break;
            }
            // if material sheet is not maximum allowed length
            if (bins[i].height < materialLength) {
                // increase bin length
                bins[i] = new MaxRectsBin(bins[i].width, bins[i].height + lengthStep);
                maxHeight = Math.max(maxHeight, bins[i].height);
                materialAvailable = true;
                break;
            }

            // if bin empty when maximum size then return cuz items cant fit
            if (bins[i].used.length === 0) {
                return {
                    success: false,
                };
            } else {
                // empty bins before another packing
                bins[i] = new MaxRectsBin(bins[i].width, bins[i].height);
            }
        }

        // add new sheet if packed
        if (!materialAvailable) {
            bins.push(new MaxRectsBin(widthStep, lengthStep));
        }
    }

    return {
        width: maxWidth,
        length: maxHeight,
        bins,
        success: true,
    };
}
