import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({name, size = 24, color = '#000'}) => {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
};

export default Icon; 