import { Dimensions, StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CIRCLE_SIZE = 80;
interface AnimatedPosition {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
}

const useFollowAnimatedPosition = ({ x, y }: AnimatedPosition) => {
  const followXAxis = useDerivedValue(() => {
    return withSpring(x.value);
  });
  const followYAxis = useDerivedValue(() => {
    return withSpring(y.value);
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });
  return { followXAxis, followYAxis, rStyle };
};

export default function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      if (translateX.value > SCREEN_WIDTH / 2) {
        translateX.value = SCREEN_WIDTH - CIRCLE_SIZE;
      } else {
        translateX.value = 0;
      }
    });

  //Whatsapp --> Instagram --> Facebook --> Github --> Linkedin

  //whatsapp
  const {
    followXAxis: whatsappX,
    followYAxis: whatsappY,
    rStyle: rWhatsapp,
  } = useFollowAnimatedPosition({
    x: translateX,
    y: translateY,
  });

  //instagram
  const {
    followXAxis: instagramX,
    followYAxis: instagramY,
    rStyle: rInstagram,
  } = useFollowAnimatedPosition({
    x: whatsappX,
    y: whatsappY,
  });

  const {
    //facebook
    followXAxis: facebookX,
    followYAxis: facebookY,
    rStyle: rFacebook,
  } = useFollowAnimatedPosition({
    x: instagramX,
    y: instagramY,
  });
  //github
  const {
    followXAxis: GithubX,
    followYAxis: GithubY,
    rStyle: rGithub,
  } = useFollowAnimatedPosition({
    x: facebookX,
    y: facebookY,
  });

  //linkedin
  const {
    followXAxis,
    followYAxis,
    rStyle: rLinkedIn,
  } = useFollowAnimatedPosition({
    x: GithubX,
    y: GithubY,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Animated.View style={[styles.circle, rLinkedIn]}>
          <View style={{ alignSelf: 'center', paddingBottom: 2 }}>
            <Entypo name="linkedin-with-circle" size={70} color="#0064ff" />
          </View>
        </Animated.View>
        <Animated.View style={[styles.circle, rGithub]}>
          <View style={{ alignSelf: 'center', paddingBottom: 2 }}>
            <AntDesign name="github" size={70} color="black" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.circle, rFacebook]}>
          <View style={{ alignSelf: 'center', paddingBottom: 2 }}>
            <FontAwesome5 name="facebook" size={70} color="#0008ff" />
          </View>
        </Animated.View>
        <Animated.View style={[styles.circle, rInstagram]}>
          <View style={{ alignSelf: 'center', paddingBottom: 2 }}>
            <FontAwesome5 name="instagram" size={70} color="#a100ff" />
          </View>
        </Animated.View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.circle, rWhatsapp]}>
            <View style={{ alignSelf: 'center', paddingBottom: 2 }}>
              <FontAwesome5 name="whatsapp" size={72} color="#00ff04" />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  circle: {
    position: 'absolute',
    height: CIRCLE_SIZE,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: CIRCLE_SIZE / 2,
    opacity: 1,
    overflow: 'hidden',
  },
});
