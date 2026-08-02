const PROGRESS_PREFIX = 'spin_progress_';

export const getProgress = (gameId) => {
  try {
    const data = localStorage.getItem(PROGRESS_PREFIX + gameId);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setProgress = (gameId, progress) => {
  localStorage.setItem(PROGRESS_PREFIX + gameId, JSON.stringify(progress));
};

export const clearProgress = (gameId) => {
  localStorage.removeItem(PROGRESS_PREFIX + gameId);
};