import { useState } from 'react';
import { MAX_HISTORY_SIZE } from '../../../shared/constants/config.js';

export function useMediaHistory() {
  const [viewedMedia, setViewedMedia] = useState([]);

  const addViewedMedia = (media) => {
    setViewedMedia((prev) => [...prev, media]);
  };

  const clearViewedMediaCacheIfTooLarge = () => {
    if (viewedMedia.length > MAX_HISTORY_SIZE) {
      setViewedMedia([]);
      return [];
    }
    return viewedMedia;
  };

  const exportViewedMedia = () => {
    if (viewedMedia.length === 0) return;
    triggerFileDownload(createJsonDataUri(viewedMedia), createExportFilename());
  };

  const createJsonDataUri = (data) => {
    return (
      'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2))
    );
  };

  const createExportFilename = () => {
    return `viewed-media-${new Date().toISOString().slice(0, 10)}.json`;
  };

  const triggerFileDownload = (dataUri, filename) => {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  };

  const importViewedMedia = (jsonString) => {
    try {
      const parsedData = JSON.parse(jsonString);
      return applyImportedData(parsedData);
    } catch {
      return false;
    }
  };

  const applyImportedData = (data) => {
    if (!Array.isArray(data)) return false;
    setViewedMedia(data);
    return true;
  };

  return {
    viewedMedia,
    addViewedMedia,
    clearViewedMediaCacheIfTooLarge,
    exportViewedMedia,
    importViewedMedia,
  };
}
