import sharp from "sharp";
import fs from "fs-extra";
import path from "path";

const inputFolder = path.resolve("D:/mockupinvitaciones/front/public");

const outputFolder = "./webp"; // Carpeta donde guardará las convertidas

async function convertAllToWebP() {
    await fs.ensureDir(outputFolder);

    if (!fs.existsSync(inputFolder)) {
        console.error("❌ La carpeta no existe:", inputFolder);
        process.exit(1);
    }

    const files = await fs.readdir(inputFolder);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const fileName = path.basename(file, ext);
        const supported = [".webp", ".webp", ".webp", ".bmp", ".gif", ".tiff"];

        if (!supported.includes(ext)) continue;

        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(outputFolder, `${fileName}.webp`);

        console.log(`➡️ Procesando: ${file}`);

        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Configurar según tipo
        const webpOptions =
            metadata.hasAlpha || ext === ".webp"
                ? { lossless: true } // transparencia sin pérdida
                : { quality: 85, smartSubsample: true }; // fotos con compresión óptima

        await image.webp(webpOptions).toFile(outputPath);

        const originalSize = (await fs.stat(inputPath)).size;
        const newSize = (await fs.stat(outputPath)).size;

        console.log(`✔️ Convertida a WebP (${((newSize / originalSize) * 100).toFixed(1)}% del tamaño original)`);
    }

    console.log("\n🎉 ¡Conversiones completadas con WebP optimizado!");
}

convertAllToWebP();
