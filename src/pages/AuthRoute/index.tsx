import React from 'react';
import { useLocation } from 'react-router';
import Page403 from '@/components/ErrorPage/Page401';
import { useAppSelector } from '@/redux';
import { hasUser } from '@/utils';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const user = useAppSelector(state => state.user.user);
  const pathList = path.split('/');
  return (
    <>
      {(!pathList.includes('manage') && !pathList.includes('backstage')) || hasUser(user) ? (
        children
      ) : (
        <Page403></Page403>
      )}
    </>
  );
};

export default AuthRoute;
