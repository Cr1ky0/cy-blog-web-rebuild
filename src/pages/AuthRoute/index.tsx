import React from 'react';
import { useLocation } from 'react-router';
import Page403 from '@/components/ErrorPage/Page403';
import { useAppSelector } from '@/redux';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const user = useAppSelector(state => state.user.user);
  const pathList = path.split('/');
  return (
    <>{(!pathList.includes('manage') && !pathList.includes('backstage')) || user ? children : <Page403></Page403>}</>
  );
};

export default AuthRoute;
