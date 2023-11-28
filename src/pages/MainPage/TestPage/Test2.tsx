import React, { useState } from 'react';
import { animated, useTransition } from '@react-spring/web';
import { Button } from 'antd';

export default function Test2() {
  const [state, setState] = useState(false);
  // ***
  const config = {
    mass: 2,
    duration: 300,
  };
  const transitions = useTransition(state, {
    from: { opacity: 0, y: 100 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 100 },
    exitBeforeEnter: true,
    config,
  });

  const changeAnimePage = () => {
    return transitions((props, item) => (
      <animated.div style={props}>{item ? 'THIS IS YOUR FATHER' : 'THIS IS YOUR MATHER'}</animated.div>
    ));
  };

  return (
    <div>
      {changeAnimePage()}
      <Button
        onClick={() => {
          setState(state => !state);
        }}
      >
        点击切换状态
      </Button>
    </div>
  );
}
