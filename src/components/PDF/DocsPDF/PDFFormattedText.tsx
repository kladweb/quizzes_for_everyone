import React from "react";
import { Text, View, type TextProps } from "@react-pdf/renderer";
import { Math } from "@react-pdf/math";

interface PDFFormattedTextProps {
  text: string;
  style?: TextProps["style"];
}

const PARTS_REGEX = /(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

const isSimpleSymbol = (formula: string) =>
  /^[a-zA-Z]$/.test(formula) ||
  /^\\(?:alpha|beta|gamma|delta|theta|pi|mu|sigma|omega)$/.test(formula);

export const PDFFormattedText: React.FC<PDFFormattedTextProps> = ({
                                                                    text,
                                                                    style,
                                                                  }) => {
  const parts = text.split(PARTS_REGEX).filter(Boolean);

  const elements: React.ReactNode[] = [];
  let inlineParts: React.ReactNode[] = [];

  const flushInlineParts = () => {
    if (inlineParts.length === 0) return;

    elements.push(
      <View
        key={`inline-${elements.length}`}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {inlineParts}
      </View>
    );

    inlineParts = [];
  };

  parts.forEach((part, index) => {
    if (part.startsWith("\\[") && part.endsWith("\\]")) {
      flushInlineParts();

      const formula = part.slice(2, -2).trim();

      elements.push(
        <View key={`block-${index}`} style={{marginVertical: 4}}>
          <Math height={24}>{formula}</Math>
        </View>
      );

      return;
    }

    if (part.startsWith("\\(") && part.endsWith("\\)")) {
      const formula = part.slice(2, -2).trim();
      const isSymbol = isSimpleSymbol(formula);
      const hasFraction = /\\(?:frac|dfrac|tfrac)\b/.test(formula);
      const hasRoot = /\\(?:sqrt)\b/.test(formula);

      const baseHeight = isSymbol ? 6 : hasFraction ? 16 : 12;
      const height = hasRoot && hasFraction
        ? baseHeight * 1.2
        : baseHeight;
      const marginVertical = height > 16 ? 1 : 3;

      inlineParts.push(
        <View
          key={`math-${index}`}
          style={{
            marginVertical,
            justifyContent: "center",
          }}
        >
          <Math inline height={height}>
            {formula}
          </Math>
        </View>
      );

      if (isSymbol) {
        inlineParts.push(
          <Text key={`space-${index}`} style={style}>
            {" "}
          </Text>
        );
      }

      return;
    }

    inlineParts.push(
      <Text key={`text-${index}`} style={style}>
        {part}
      </Text>
    );
  });

  flushInlineParts();

  return <View>{elements}</View>;
};
