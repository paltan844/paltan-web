import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface CurvedTextProps {
    text: string;
    fontSize?: number;
    color?: string;
}

const CurvedText: React.FC<CurvedTextProps> = ({ text, fontSize = 40, color = 'red' }) => {
    const length = text.length;
    const baseAngle = 50 / length;

    return (
        <View style={styles.container}>
            {text.split('').map((char, index) => {
                const depth = Math.abs(index - length / 2.4) * 2;
                const rotateX = -baseAngle * (length / 2 - index);

                return (
                    <Text
                        key={index}
                        style={[
                            styles.letter,
                            {
                                fontSize,
                                color,
                                transform: [
                                    { perspective: 200 },
                                    { rotateX: `${rotateX}deg` },
                                    { translateY: depth },
                                ],
                            },
                        ]}
                    >
                        {char}
                    </Text>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default CurvedText;
