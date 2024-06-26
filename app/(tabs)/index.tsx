import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, Dimensions, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0 });
  const [subscription, setSubscription] = useState(null);
  const [boxColor, setBoxColor] = useState('blue');
  const [position, setPosition] = useState({ x: 175, y: 0 });
  const [isPaused, setIsPaused] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Animation ref for rotating box
  const rotAnim = useRef(new Animated.Value(0)).current;
  const growAnim = useRef(new Animated.Value(0)).current;

  // Subscribe to accelerometer
  const _subscribe = () => {
    Accelerometer.setUpdateInterval(20);
    const newSubscription = Accelerometer.addListener(({ x, y }) => {
      if (isPaused) return;
      setAcceleration({ x, y });
      setPosition(prevPosition => ({
        x: Math.min(Math.max(prevPosition.x + (25 * x), 0), screenWidth - 50),
        y: Math.min(Math.max(prevPosition.y - (25 * y), 0), screenHeight - 50),
      }));
    });
    setSubscription(newSubscription);
  };

  // Unsubscribe from accelerometer
  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Effect to handle subscription on mount and unmount
  useEffect(() => {
    _subscribe();
    return () => {
      _unsubscribe();
    };
  }, []);

  // Effect to handle the rotating animation
  useEffect(() => {
    const rotationAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(rotAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ])
    );
    const growAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(growAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(growAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    );

    if (!isPaused) {
      rotationAnimation.start();
      growAnimation.start();
    } else {
      rotationAnimation.stop();
    }

    return () => {
      rotationAnimation.stop();
    };
  }, [isPaused, rotAnim, growAnim]);


  const detectCollision = () => {
    const box1Width = 50;
    const box1Height = 50;

    const box1Left = position.x;
    const box1Right = position.x + box1Width;
    const box1Top = position.y;
    const box1Bottom = position.y + box1Height;

    function checkCollision(enemyBox) {

      return (
        box1Right >= enemyBox.left &&
        box1Left <= enemyBox.right &&
        box1Bottom >= enemyBox.top &&
        box1Top <= enemyBox.bottom
      );
    }

    if (
      checkCollision(boxes[0]) ||
      checkCollision(boxes[1]) ||
      checkCollision(boxes[2]) ||
      checkCollision(boxes[3]) ||
      checkCollision(boxes[3]) ||
      checkCollision(boxes[4]) ||
      checkCollision(boxes[5]) ||
      checkCollision(boxes[6]) ||
      checkCollision(boxes[7]) ||
      checkCollision(boxes[8]) ||
      checkCollision(boxes[9]) ||
      checkCollision(boxes[10])
    ) {
      sendAlert('YOU FAILED!', 'let me try again....');
    }
    if (position.y >= screenHeight - 100) {
      sendAlert('YOU WIN!', 'Play again!');
    }

    if (position.y <= 0) {
      setBoxColor('blue');
    }
  };

  // Function to handle alert messages and pause state
  const sendAlert = (message, answer) => {
    setIsPaused(true);
    _unsubscribe();
    setBoxColor('blue');
    Alert.alert(message, '', [
      {
        text: answer,
        onPress: () => {
          setIsPaused(false);
          _subscribe();
          setPosition({ x: 175, y: 0 });
        },
      },
    ]);
  };

  // Effect to trigger collision detection on position change
  useEffect(() => {
    if (!isPaused) {
      detectCollision();
    }
  }, [position]);

    // Boxes definition for collision detection
    const boxes = [
      { width: 50, height: 50, left: 50, right: 50 + 50, top: 250, bottom: 250 + 50 },
      { width: 50, height: 50, left: 175, right: 175 + 50, top: 250, bottom: 250 + 50 },
      { width: 50, height: 50, left: 315, right: 315 + 50, top: 250, bottom: 250 + 50 },
      { width: 50, height: 50, left: 50, right: 50 + 50, top: 150, bottom: 150 + 50 },
      { width: 50, height: 50, left: 175, right: 175 + 50, top: 150, bottom: 150 + 50 },
      { width: 50, height: 50, left: 315, right: 315 + 50, top: 150, bottom: 150 + 50 },
      { width: 50, height: 50, left: 50, right: 50 + 50, top: 450, bottom: 450 + 50 },
      { width: 50, height: 50, left: 175, right: 175 + 50, top: 450, bottom: 450 + 50 },
      { width: 50, height: 50, left: 315, right: 315 + 50, top: 450, bottom: 450 + 50 },
      { width: 50, height: 50, left: 50, right: 50 + 50, top: 350, bottom: 350 + 50 },
      { width: 50, height: 50, left: 175, right: 175 + 50, top: 350, bottom: 350 + 50 },
      { width: 50, height: 50, left: 315, right: 315 + 50, top: 350, bottom: 350 + 50 },
    ];

  // Boxes definition for collision detection
  // const box2 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 250, bottom: 250 + 50 };
  // const box3 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 250, bottom: 250 + 50 };
  // const box4 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 250, bottom: 250 + 50 };
  // const box5 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 150, bottom: 150 + 50 };
  // const box6 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 150, bottom: 150 + 50 };
  // const box7 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 150, bottom: 150 + 50 };
  // const box8 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 450, bottom: 450 + 50 };
  // const box9 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 450, bottom: 450 + 50 };
  // const box10 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 450, bottom: 450 + 50 };
  // const box11 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 350, bottom: 350 + 50 };
  // const box12 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 350, bottom: 350 + 50 };
  // const box13 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 350, bottom: 350 + 50 };

  // Render component
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: 50,
          height: 50,
          backgroundColor: boxColor,
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: [{ scaleY: growAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          }) }, { scaleX: growAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1.2, 1],
          }) }],
        }}
      />

      {boxes.map((box, index) => (
        <Animated.View
          key={index}
          style={{
            width: 50,
            height: 50,
            position: 'absolute',
            backgroundColor: 'red',
            left: box.left,
            top: box.top,
            transform: [{ rotateZ: rotAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['-2deg', '2deg'],
            }) }],
          }}
        />
      ))}
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









// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, Animated, View, Dimensions, Alert } from 'react-native';
// import { Accelerometer } from 'expo-sensors';

// export default function App() {
//   const [acceleration, setAcceleration] = useState({ x: 0, y: 0 });
//   const [subscription, setSubscription] = useState(null);
//   const [boxColor, setBoxColor] = useState('blue');
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isPaused, setIsPaused] = useState(false);

//   const screenWidth = Dimensions.get('window').width;
//   const screenHeight = Dimensions.get('window').height;
//   const rotAnim = useRef(new Animated.Value(0)).current; // Ref for animated value

//   const _unsubscribe = () => {
//     subscription && subscription.remove();
//     setSubscription(null);
//   };

//   const _subscribe = () => {
//     Accelerometer.setUpdateInterval(1000);
//     const newSubscription = Accelerometer.addListener(({ x, y }) => {
//       if (isPaused) return;
//       setAcceleration({ x, y });
//       setPosition(prevPosition => {
//         const newX = prevPosition.x + (25 * x);
//         const newY = prevPosition.y - (25 * y);

//         const constrainedX = Math.min(Math.max(newX, 0), screenWidth - 50);
//         const constrainedY = Math.min(Math.max(newY, 0), screenHeight - 50);

//         return { x: constrainedX, y: constrainedY };
//       });
//     });
//     setSubscription(newSubscription);
//   };

//   useEffect(() => {
//     _subscribe();
//     return () => {
//       _unsubscribe();
//     };
//   }, []);

//   const box2 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 250, bottom: 250 + 50 };
//   const box3 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 250, bottom: 250 + 50 };
//   const box4 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 250, bottom: 250 + 50 };
//   const box5 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 150, bottom: 150 + 50 };
//   const box6 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 150, bottom: 150 + 50 };
//   const box7 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 150, bottom: 150 + 50 };
//   const box8 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 450, bottom: 450 + 50 };
//   const box9 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 450, bottom: 450 + 50 };
//   const box10 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 450, bottom: 450 + 50 };
//   const box11 = { width: 50, height: 50, left: 50, right: 50 + 50, top: 350, bottom: 350 + 50 };
//   const box12 = { width: 50, height: 50, left: 175, right: 175 + 50, top: 350, bottom: 350 + 50 };
//   const box13 = { width: 50, height: 50, left: 315, right: 315 + 50, top: 350, bottom: 350 + 50 };
//   const RotView = props => {

//     useEffect(() => {
//       Animated.loop(
//       Animated.sequence([
//         // decay, then spring to start and twirl
//           Animated.timing(rotAnim, {
//             toValue: 10,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(rotAnim, {
//             toValue: -10,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
 
//       ])).start();
//     }, [rotAnim]);


//     return (
//       <Animated.View style={{ ...props.style, transform: [{ rotateZ: rotAnim.interpolate({
//         inputRange: [0, 360],
//         outputRange: ['0deg', '360deg'],
//       }) }] }}>
//         {props.children}
//       </Animated.View>
//     );
//   };

//   const detectCollision = () => {
//     const box1Width = 50;
//     const box1Height = 50;

//     const box1Left = position.x;
//     const box1Right = position.x + box1Width;
//     const box1Top = position.y;
//     const box1Bottom = position.y + box1Height;

//     function checkCollision(enemyBox) {
//       return (
//         box1Right >= enemyBox.left &&
//         box1Left <= enemyBox.right &&
//         box1Bottom >= enemyBox.top &&
//         box1Top <= enemyBox.bottom
//       );
//     }

//     if (
//       checkCollision(box2) ||
//       checkCollision(box3) ||
//       checkCollision(box4) ||
//       checkCollision(box5) ||
//       checkCollision(box6) ||
//       checkCollision(box7) ||
//       checkCollision(box8) ||
//       checkCollision(box9) ||
//       checkCollision(box10) ||
//       checkCollision(box11) ||
//       checkCollision(box12) ||
//       checkCollision(box13)
//     ) {
//       sendAlert('YOU FAILED!', 'let me try again....');
//     }
//     if (position.y >= screenHeight - 100) {
//       sendAlert('YOU WIN!', 'Play again!');
//     }

//     if (position.y <= 0) {
//       setBoxColor('blue');
//     }
//   };

//   function sendAlert(message, answer) {
//     setIsPaused(true);
//     _unsubscribe();
//     setBoxColor('blue');
//     Alert.alert(message, '', [
//       {
//         text: answer,
//         onPress: () => {
//           setIsPaused(false);
//           _subscribe();
//           setPosition({ x: 0, y: 0 });
//         },
//       },
//     ]);
//   }

//   useEffect(() => {
//     if (!isPaused) {
//       detectCollision();
//     }
//   }, [position]);

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           backgroundColor: boxColor,
//           position: 'absolute',
//           left: position.x,
//           top: position.y,
//         }}
//       />

//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box2.left,
//           top: box2.top,
//           transform: [{ rotateZ: rotAnim.interpolate({
//             inputRange: [0, 360],
//             outputRange: ['0deg', '360deg'],
//           }) }],
//         }}
//       />
//       <RotView
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box3.left,
//           top: box3.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box4.left,
//           top: box4.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box5.left,
//           top: box5.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box6.left,
//           top: box6.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box7.left,
//           top: box7.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box8.left,
//           top: box8.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box9.left,
//           top: box9.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box10.left,
//           top: box10.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box11.left,
//           top: box11.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box12.left,
//           top: box12.top,
//         }}
//       />
//       <Animated.View
//         style={{
//           width: 50,
//           height: 50,
//           position: 'absolute',
//           backgroundColor: 'red',
//           left: box13.left,
//           top: box13.top,
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
// });
