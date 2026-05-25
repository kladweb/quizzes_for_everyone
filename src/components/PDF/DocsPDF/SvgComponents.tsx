import { Circle, Path, Rect, Svg, View } from "@react-pdf/renderer";
import React from "react";

export const Checkbox = () => (
  <View style={{width: 20, alignItems: 'center'}}>
    <Svg width={12} height={12} viewBox="0 0 22 22">
      <Rect
        x="1.5"
        y="1.5"
        width="17"
        height="17"
        rx="3"
        fill="#ffffff"
        fillOpacity={0}
        stroke="#1f2a44"
        strokeWidth="1.2"
      />
    </Svg>
  </View>
);

export const RadioButton = () => (
  <View style={{width: 20, alignItems: 'center'}}>
    <Svg width={12} height={12} viewBox="0 0 22 22">
      <Circle cx="11" cy="11" r="9" fill="#ffffff" fillOpacity={0} stroke="#1f2a44" strokeWidth="1.2"/>
    </Svg>
  </View>
);

export const CheckboxChecked = () => (
  <View style={{width: 20, alignItems: 'center'}}>
    <Svg width={12} height={12} viewBox="0 0 22 22">
      <Rect
        x="1.5"
        y="1.5"
        width="17"
        height="17"
        rx="3"
        fill="#ffffff"
        fillOpacity={0}
        stroke="#1f2a44"
        strokeWidth="1.2"
      />
      <Path
        d="M5.5 11 L9.5 15.5 L16.5 5.5"
        fill="none"
        stroke="#1f2a44"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

export const RadioButtonChecked = () => (
  <View style={{width: 20, alignItems: 'center'}}>
    <Svg width={12} height={12} viewBox="0 0 22 22">
      <Circle
        cx="11"
        cy="11"
        r="9"
        fill="#ffffff"
        fillOpacity={0}
        stroke="#1f2a44"
        strokeWidth="1.2"
      />
      <Path
        d="M5.5 11 L9.5 15.5 L16.5 5.5"
        fill="none"
        stroke="#1f2a44"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

export const CorrectMark = () => (
  <View style={{position: 'absolute', left: -15, width: 20, alignItems: 'center'}}>
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M20 6L9 17L4 12"
        fill="none"
        stroke="#2e7d32"           // тёмно-зелёный
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

export const IncorrectMark = () => (
  <View style={{position: 'absolute', left: -15, width: 20, alignItems: 'center'}}>
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M6 6L18 18M18 6L6 18"
        fill="none"
        stroke="#d32f2f"           // красный
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);
