import { useNetwork } from '../context/NetworkContext';

interface NetworkStatus {
  isConnected: boolean | null;
  connectionType: string | null;
  isOffline: boolean;
  isOnline: boolean;
}

export const useNetworkStatus = (): NetworkStatus => {
  const networkState = useNetwork();

  return {
    isConnected: networkState.isConnected,
    connectionType: networkState.connectionType,
    isOffline: networkState.isConnected === false,
    isOnline: networkState.isConnected === true,
  };
}; 