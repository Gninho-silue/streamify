import { useState, useEffect } from 'react';
import { getStreamToken } from '../lib/api';
import { toast } from 'react-hot-toast';
import useAuthUser from './useAuthUser';

export const useStreamAuth = () => {
  const [streamToken, setStreamToken] = useState(null);
  const [streamVideoToken, setStreamVideoToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authUser } = useAuthUser();

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch Stream tokens from backend
      const response = await getStreamToken();
      
      setStreamToken(response.token);
      setStreamVideoToken(response.videoToken);
      
      // Store tokens in localStorage for persistence with user ID
      localStorage.setItem('streamChatToken', response.token);
      localStorage.setItem('streamTokenUserId', authUser._id);
      localStorage.setItem('streamVideoToken', response.videoToken);
      
    } catch (err) {
      console.error('Error fetching Stream tokens:', err);
      setError(err.message);
      toast.error('Failed to authenticate with chat service');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async () => {
    await fetchTokens();
  };

  useEffect(() => {
    if (!authUser) return;

    const storedChatToken = localStorage.getItem('streamChatToken');
    const storedUserId = localStorage.getItem('streamTokenUserId');
    const storedVideoToken = localStorage.getItem('streamVideoToken');

    if (storedChatToken && storedUserId === authUser._id) {
      setStreamToken(storedChatToken);
      setStreamVideoToken(storedVideoToken);
    } else {
      fetchTokens(); // force le refresh si l'id ne correspond pas
    }
  }, [authUser]);

  return {
    streamToken,
    streamVideoToken,
    isLoading,
    error,
    refreshTokens,
  };
}; 