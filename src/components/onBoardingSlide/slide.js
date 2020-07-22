import PropTypes from 'prop-types';
import React from 'react';
import { Text , View, ImageBackground , Image, Dimensions} from 'react-native';
import slideStyles from './styles';


const OnBoardingSlide = ({
    setImage,textHeader, textDescription , originalWidth, originalHeight
}) => 

 {  
    // let windowWidth = Dimensions.get('window').width;
    // let widthChange = ( windowWidth - (windowWidth / 2 ) ) / originalWidth;
    // let newWidth = originalWidth * widthChange;
    // let newHeight = originalHeight * widthChange;

    let newHeight = Dimensions.get('window').height*0.35;

    let ratio = newHeight / originalHeight;
    let newWidth = originalWidth * ratio;

    return (
    <View style={slideStyles.slide}>
        {/* <ImageBackground source={setImage} style={{ width: '10%', height: '10%' }}> */}
        <View style={slideStyles.imgView}>
            <Image source={setImage} style={{ width: newWidth, height: newHeight }}></Image>
        </View>
        <View style={{ flex: 2 }}>
            <Text style={slideStyles.textHeader}>{textHeader}</Text>
            <Text style={slideStyles.textDescription}>{textDescription}</Text>
        </View>
        {/* </ImageBackground> */}
    </View>)
}

export default OnBoardingSlide;