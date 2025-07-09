import React from 'react';
import { Flex, Spin } from 'antd';

const Loader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Flex align="center" gap="middle">
            <Spin size="large" />
        </Flex>
    </div>
);

export default Loader;
