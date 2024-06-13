"use client";
import { useCallback } from "react";

const useUtils = () => {
  const convert = require('heic-convert/browser');
  const isPhotoHEIC = useCallback((filename) => {
    let isHEIC = false;

    if (filename) {
      if (filename.includes('.heic')) {
        isHEIC = true;
      }
    }

    return isHEIC;
  }, []);

  const updateAndConvertToHEIC = useCallback(async (_photo) => {
    try {
      const base64Data = _photo.base64.split(';base64,').pop();
      const inputBuffer = Buffer.from(base64Data, 'base64');
      // Convert HEIC to JPEG
      const outputBuffer = await convert({
        buffer: inputBuffer, // the HEIC file buffer
        format: 'JPEG',      // output format
        quality: 1           // the JPEG compression quality, between 0 and 1
      });

      const jpegBase64 = `data:image/jpeg;base64,${outputBuffer.toString('base64')}`;

      if (jpegBase64) {
        _photo.base64 = jpegBase64;
        _photo.type = "image/jpeg";
      }
    } catch (error) {
      console.error("Error converting HEIC to JPEG:", error);
    }
  }, [convert]);
 
  return {
    isPhotoHEIC,
    updateAndConvertToHEIC
  }
}

export default useUtils;
