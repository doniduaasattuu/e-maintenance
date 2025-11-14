import imageCompression from 'browser-image-compression';

export function useImageCompressor() {
    return async (file: File) => {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
        return await imageCompression(file, options);
    };
}
