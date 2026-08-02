import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const GAME_ID_KEY = 'spin_current_gameId';

export const GameProvider = ({ children }) => {
  const [gameId, setGameIdState] = useState('');
  const [gifts, setGifts] = useState([]);
  const [wonGift, setWonGift] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [deliveryId, setDeliveryId] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true); // true until initial restore is done

  // On first mount: check localStorage for saved gameId, then fetch progress from backend
  useEffect(() => {
    const savedGameId = localStorage.getItem(GAME_ID_KEY);
    if (savedGameId) {
      setGameIdState(savedGameId);
      // Fetch progress from backend
      import('../services/api').then(({ getUserData }) => {
        getUserData(savedGameId)
          .then((res) => {
            const { step: s, wonGift: wg, userDetails: ud, deliveryId: did } = res.data;
            setStep(s || 0);
            if (wg) setWonGift(wg);
            if (ud) setUserDetails(ud);
            if (did) setDeliveryId(did);
            setLoading(false);
          })
          .catch(() => {
            // Game ID no longer valid or no data – stay on homepage
            localStorage.removeItem(GAME_ID_KEY);
            setGameIdState('');
            setLoading(false);
          });
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Custom setGameId: save to localStorage and fetch progress from backend
  const setGameId = useCallback(async (id) => {
    if (!id) {
      localStorage.removeItem(GAME_ID_KEY);
      setGameIdState('');
      setStep(0);
      setWonGift(null);
      setUserDetails(null);
      setDeliveryId(null);
      return;
    }

    localStorage.setItem(GAME_ID_KEY, id);
    setGameIdState(id);

    // Reset all progress state (fresh for the new ID)
    setStep(0);
    setWonGift(null);
    setUserDetails(null);
    setDeliveryId(null);

    // Fetch progress from backend for this game ID
    try {
      const { getUserData } = await import('../services/api');
      const res = await getUserData(id);
      const { step: s, wonGift: wg, userDetails: ud, deliveryId: did } = res.data;
      setStep(s || 0);
      if (wg) setWonGift(wg);
      if (ud) setUserDetails(ud);
      if (did) setDeliveryId(did);
    } catch (err) {
      // No progress yet – that's fine
    }
  }, []);

  // Reset everything (for logout / admin actions)
  const resetGame = useCallback(() => {
    localStorage.removeItem(GAME_ID_KEY);
    setGameIdState('');
    setStep(0);
    setWonGift(null);
    setUserDetails(null);
    setDeliveryId(null);
    setGifts([]);
  }, []);

  // Update progress: only sets local state (backend already updated via API calls)
  const updateProgress = useCallback((newStep, data = {}) => {
    setStep(newStep);
    if (data.wonGift) setWonGift(data.wonGift);
    if (data.userDetails) setUserDetails(data.userDetails);
    if (data.deliveryId) setDeliveryId(data.deliveryId);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameId,
        setGameId,
        gifts,
        setGifts,
        wonGift,
        setWonGift,
        userDetails,
        setUserDetails,
        deliveryId,
        setDeliveryId,
        step,
        setStep,
        updateProgress,
        resetGame,
        loading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};