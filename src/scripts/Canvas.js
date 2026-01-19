// TODO typescript

// draw materials and details but turn 90 degrees for better fit
export function drawResult(ctx, canvas, result) {
    // scale to fit screen
    const scale = canvas.width / result.length;
    // calculate canvas height
    let totalHeight = 0;
    for (const bin of result.bins) {
        totalHeight += bin.width * scale + 5;
    }
    canvas.height = totalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let nextBinY = 0;
    result.bins.forEach((bin) => {
        // draw material
        const binW = bin.height * scale;
        const binH = bin.width * scale;
        ctx.fillStyle = "rgba(57, 79, 128, 0.6)";
        ctx.fillRect(0, nextBinY, binW, binH);

        // draw details
        bin.used.forEach((rect) => {
            const x = rect.y * scale;
            const y = rect.x * scale + nextBinY;
            const w = rect.height * scale;
            const h = rect.width * scale;

            ctx.fillStyle = "rgba(100, 150, 255, 0.6)";
            ctx.fillRect(x, y, w, h);

            ctx.strokeStyle = "#000";
            ctx.strokeRect(x, y, w, h);

            ctx.fillStyle = "#000";
            ctx.font = "12px sans-serif";
            ctx.fillText(rect.name, x + 4, y + 14);
        });

        // next material position
        nextBinY += binH + 5;
    });
}
