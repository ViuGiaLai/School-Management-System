// src/components/Loading.jsx
import React from 'react';
import { Spin } from 'antd';

const Loading = ({
  tip = 'loading...',
  size = 'large',
  style = { padding: 24, textAlign: 'center' },
}) => {
  return (
    <div style={style}>
      <Spin tip={tip} size={size} />
    </div>
  );
};

export default Loading;
