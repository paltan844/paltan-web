// src/hoc/withNetworkHandler.tsx
import React, { useEffect, useState } from 'react';
import NoConnectionScreen  from '@components/common/NetworkHandler';

type WithNetworkHandlerProps = {
  isConnected?: boolean;
  onRetry?: () => void;
};

// ✅ For normal screens (no header handling)
export function withNetworkHandler<P extends WithNetworkHandlerProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithNetworkHandler: React.FC<P> = (props) => {
    const [isConnected, setIsConnected] = useState<boolean>(navigator.onLine);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
      const handleOnline = () => setIsConnected(true);
      const handleOffline = () => setIsConnected(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    if (!isConnected) {
      return (
        <NoConnectionScreen
          onRetry={() => {
            setRetryKey(prev => prev + 1);
            props.onRetry?.();
          }}
        />
      );
    }

    return <WrappedComponent key={retryKey} {...props} />;
  };

  ComponentWithNetworkHandler.displayName = `withNetworkHandler(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithNetworkHandler;
}

// ✅ For screens that use a header or need network props
export function withNetworkHandlerWithHeader<P extends object>(
  WrappedComponent: React.ComponentType<P & WithNetworkHandlerProps>
) {
  const ComponentWithNetworkHandlerWithHeader: React.FC<P> = (props) => {
    const [isConnected, setIsConnected] = useState<boolean>(navigator.onLine);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
      const handleOnline = () => setIsConnected(true);
      const handleOffline = () => setIsConnected(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    return (
      <WrappedComponent
        key={retryKey}
        {...props}
        isConnected={isConnected}
        onRetry={() => setRetryKey(prev => prev + 1)}
      />
    );
  };

  ComponentWithNetworkHandlerWithHeader.displayName = `withNetworkHandlerWithHeader(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithNetworkHandlerWithHeader;
}
