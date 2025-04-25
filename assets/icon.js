import * as React from 'react';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';

function KMusicIcon(props) {
  return (
    <Svg width={256} height={256} viewBox="0 0 204 212" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M78.614 192.304l10.691 11.801c5.913 6.527 15.485 6.527 21.383 0l10.691-11.801c-11.81-13.035-30.955-13.035-42.765 0zM35.85 145.101l21.382 23.602c23.576-26.038 61.955-26.038 85.546 0l21.382-23.602c-35.431-39.124-92.88-39.124-128.31 0zM195.567 110.417l-10.025 11.067c-47.241-52.144-123.834-52.144-171.09 0l-10.026-11.067c-6.412-7.077-5.76-18.792 1.33-25.051C60.74 36.878 139.268 36.878 194.252 85.366c7.092 6.259 7.727 17.974 1.315 25.051z"
        fill="url(#paint0_linear_992_181)"
      />
      <Path
        d="M171.5 159l-8.348 18.152L145 185.5l18.152 8.281 8.348 18.219 8.281-18.219L198 185.5l-18.219-8.348"
        fill="url(#paint1_linear_992_181)"
      />
      <Path
        d="M24.5 0l-7.656 16.844L0 24.5l16.844 7.656L24.5 49l7.656-16.844L49 24.5l-16.844-7.656"
        fill="url(#paint2_linear_992_181)"
      />
      <Path
        d="M187.5 20l-5.156 11.344L171 36.5l11.344 5.156L187.5 53l5.156-11.344L204 36.5l-11.344-5.156"
        fill="url(#paint3_linear_992_181)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_992_181"
          x1={100}
          y1={49}
          x2={100}
          y2={209}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#D0BCFF" />
          <Stop offset={1} stopColor="#9365FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_992_181"
          x1={171.5}
          y1={159}
          x2={171.5}
          y2={212}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#D0BCFF" />
          <Stop offset={1} stopColor="#9365FF" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_992_181"
          x1={24.5}
          y1={0}
          x2={24.5}
          y2={49}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#D0BCFF" />
          <Stop offset={1} stopColor="#9365FF" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_992_181"
          x1={187.5}
          y1={20}
          x2={187.5}
          y2={53}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#D0BCFF" />
          <Stop offset={1} stopColor="#9365FF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default KMusicIcon; 