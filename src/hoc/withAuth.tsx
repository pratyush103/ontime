import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/UserContext';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuthComponent = (props: React.ComponentProps<typeof WrappedComponent>) => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/auth/login');
      }
    }, [user, router]);

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;