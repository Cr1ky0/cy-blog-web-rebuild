import React from 'react';
import FadeTransition from '@/pages/MainPage/TestPage/Test';
import Test2 from './Test2';

const TestPage = () => {
  const styles = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' };
  return (
    <div style={styles}>
      <Test2></Test2>
    </div>
  );
};

export default TestPage;
