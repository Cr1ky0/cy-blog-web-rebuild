import React from 'react';
import NotFound from '@/components/ErrorPage/NotFound';

const TestPage = () => {
  const styles = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' };
  return (
    <div>
      <NotFound detail="NotFound"></NotFound>
    </div>
  );
};

export default TestPage;
