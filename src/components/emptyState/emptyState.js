import React, { Component } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import emptyStateStyle from './styles';
import PTRView from 'react-native-pull-to-refresh';

const headerHeight = 100;

const EmptyState = ({
    title, setImage, displayMessage, vectorImage, frameImage, bubbleImage, callBack
}) => (
        <View style={emptyStateStyle.container}>
            <PTRView onRefresh={callBack} ></PTRView>
            <Image resizeMode='contain' style={emptyStateStyle.image} source={vectorImage} />
        </View>
    );

export default EmptyState;



