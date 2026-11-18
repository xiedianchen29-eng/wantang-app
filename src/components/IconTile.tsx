import { Image, type ImageProps } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

export type IconTileIcon = {
  source: NonNullable<ImageProps['source']>;
  width: number;
  height: number;
  top: number;
  offsetX?: number;
};

type IconTileProps = {
  variant: 'order' | 'service';
  label: string;
  icon: IconTileIcon;
  scale: number;
  fontScale: number;
  onPress: () => void;
};

const layouts = {
  order: {
    width: 48,
    height: 59,
    shape: require('../../assets/figma/profile/c1d6b.svg'),
    shapeWidth: 36,
    shapeHeight: 36,
    labelTop: 41,
  },
  service: {
    width: 67.536,
    height: 60.744,
    shape: require('../../assets/figma/profile/bdfaa.svg'),
    shapeWidth: 67.536,
    shapeHeight: 60.744,
    labelTop: 41,
  },
} as const;

export function IconTile({ variant, label, icon, scale, fontScale, onPress }: IconTileProps) {
  const layout = layouts[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ width: layout.width * scale, minHeight: layout.height * scale }}
    >
      <Image
        source={layout.shape}
        style={[styles.layer, {
          left: ((layout.width - layout.shapeWidth) / 2) * scale,
          width: layout.shapeWidth * scale,
          height: layout.shapeHeight * scale,
        }]}
        contentFit="contain"
        accessible={false}
        pointerEvents="none"
      />
      <Image
        source={icon.source}
        style={[styles.layer, {
          left: ((layout.width - icon.width) / 2 + (icon.offsetX ?? 0)) * scale,
          top: icon.top * scale,
          width: icon.width * scale,
          height: icon.height * scale,
        }]}
        contentFit="contain"
        accessible={false}
        pointerEvents="none"
      />
      <Text style={[styles.label, { marginTop: layout.labelTop * scale, fontSize: 10 * fontScale, lineHeight: 14 * fontScale }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute' },
  label: { color: '#8E7C73', textAlign: 'center', includeFontPadding: false },
});
