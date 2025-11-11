import React from 'react';
import { StatusBar } from 'react-native';

type Props = {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
};

const CustomStatusBar: React.FC<Props> = ({
  backgroundColor = 'rgba(14, 76, 129, 0.95)',
  barStyle = 'light-content',
}) => {
  return (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
    />
  );
};

export default CustomStatusBar;
