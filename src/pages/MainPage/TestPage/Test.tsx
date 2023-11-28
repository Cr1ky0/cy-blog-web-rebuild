import React, { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './transition.scss';
import IntroductionBox from '@/components/HomePage/IntroductionBox';
import WriteComment from '@/components/Comment/WriteComment';

export default function FadeTransition() {
  const [state, setState] = useState(false);
  return (
    <>
      <button onClick={() => setState(state => !state)}>click</button>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={state ? '0' : '1'}
          addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
          classNames="fade"
        >
          <div style={{ overflow: 'hidden' }}>{state ? <IntroductionBox /> : <WriteComment />}</div>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
}
