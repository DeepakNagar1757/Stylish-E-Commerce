import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  name: any;
  color: string;
  focused: boolean;
};

const AnimatedTabIcon = ({ name, color, focused }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity,
      }}
    >
      <Ionicons name={name} size={26} color={color} />
    </Animated.View>
  );
};

export default AnimatedTabIcon;
