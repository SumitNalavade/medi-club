import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const TruncatedText = ({ text, maxLength }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (text.length <= maxLength) {
        return <Text>{text}</Text>;
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Text style={styles.text}>
            {isExpanded ? text : `${text.substring(0, maxLength)}... `}
            <TouchableOpacity onPress={toggleExpanded}>
                <Text style={styles.moreText}>{isExpanded ? 'Show less' : 'Show more'}</Text>
            </TouchableOpacity>
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: '#333',
    },
    moreText: {
        color: '#006940',
        fontWeight: 'bold',
    },
});

export default TruncatedText;
