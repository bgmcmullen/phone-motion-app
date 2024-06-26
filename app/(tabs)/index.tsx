import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Dimensions, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0 });
  const [subscription, setSubscription] = useState(null);
  const [boxColor, setBoxColor] = useState('blue');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);

  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
    setPosition({ x: 0, y: 0 });
  };

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(20);
    setSubscription(Accelerometer.addListener(({ x, y }) => {
      setAcceleration({ x, y });
      // Update position based on acceleration
      setPosition(prevPosition => {
        // Calculate new position
        const newX = prevPosition.x + (25 * x);
        const newY = prevPosition.y - (25 * y);

        if(newY >= screenHeight - 100){
          setBoxColor('green');

        }

        if(newY <= 0) {
          setBoxColor('blue');
        }

        // Constrain position within screen bounds
        const constrainedX = Math.min(Math.max(newX, 0), screenWidth - 50);
        const constrainedY = Math.min(Math.max(newY, 0), screenHeight - 50);
        

        return { x: constrainedX, y: constrainedY };
      });
    }));
  };

  useEffect(() => {
 
    _subscribe();

    return () => {
      _unsubscribe();
    };
  }, []);

  const box2Width = 50;
  const box2Height = 50;

  const box3Width = 50;
  const box3Height = 50;

  const box4Width = 50;
  const box4Height = 50;

  const box2Left = 50; // Adjust left position of red box as needed
  const box2Right = box2Left + box2Width;
  const box2Top = 250; // Adjust top position of red box as needed
  const box2Bottom = box2Top + box2Height;

  const box3Left = 175; // Adjust left position of red box as needed
  const box3Right = box3Left + box3Width;
  const box3Top = 250; // Adjust top position of red box as needed
  const box3Bottom = box3Top + box3Height;

  const box4Left = 315; // Adjust left position of red box as needed
  const box4Right = box4Left + box4Width;
  const box4Top = 250; // Adjust top position of red box as needed
  const box4Bottom = box4Top + box4Height;


  // Collision detection logic
  const detectCollision = () => {
    // Dimensions and positions of the boxes
    const box1Width = 50;
    const box1Height = 50;


    // Positions of the boxes
    const box1Left = position.x;
    const box1Right = position.x + box1Width;
    const box1Top = position.y;
    const box1Bottom = position.y + box1Height;



    // Check for intersection
    if (
      (box1Right >= box2Left &&
        box1Left <= box2Right &&
        box1Bottom >= box2Top &&
        box1Top <= box2Bottom) ||
      (box1Right >= box3Left &&
        box1Left <= box3Right &&
        box1Bottom >= box3Top &&
        box1Top <= box3Bottom) ||
      (box1Right >= box4Left &&
        box1Left <= box4Right &&
        box1Bottom >= box4Top &&
        box1Top <= box4Bottom)

    ) {
      setIsPaused(true); // Pause updates
      _unsubscribe();
      setBoxColor('blue');
      Alert.alert("YOU FAILED!!!!!!!!!!!!", "", [
        { text: "DARN!", onPress: () => {
          
          setIsPaused(false) 
          _subscribe();
        }} // Resume updates on OK press
      ]);
    }
  };

  // Periodically check for collision
  useEffect(() => {
    if (!isPaused) {
      detectCollision();
    }




  }, [position]);

  return (
    <View style={styles.container}>
      <Animated.View style={{
        width: 50,
        height: 50,
        backgroundColor: boxColor,
        position: 'absolute',
        left: position.x,
        top: position.y,
      }} />

      <Animated.View style={{
        width: 50,
        height: 50,
        position: 'absolute',
        backgroundColor: 'red',
        left: box2Left, // Adjust as needed
        top: box2Top, // Adjust as needed
      }} />

      <Animated.View style={{
        width: 50,
        height: 50,
        position: 'absolute',
        backgroundColor: 'red',
        left: box3Left, // Adjust as needed
        top: box3Top, // Adjust as needed
      }} />

      <Animated.View style={{
        width: 50,
        height: 50,
        position: 'absolute',
        backgroundColor: 'red',
        left: box4Left, // Adjust as needed
        top: box4Top, // Adjust as needed
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
