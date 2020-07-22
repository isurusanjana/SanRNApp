import PropTypes from 'prop-types';
import React from 'react';
import { Text , View, TextInput } from 'react-native';
import formStyles from './styles';


const FormTextInput = ({
    labelText , placeHolderText, keyboardType,secureTextEntry, textChange, error, onPress
}) => (
        <View>
            {/* <Text style={[formStyles.labelText , , error ? formStyles.labelError : formStyles.labelText]}>{labelText}</Text> */}
            <TextInput
                placeholder={placeHolderText}
                placeholderTextColor="#c6c6c9"
                keyboardType={keyboardType}
                returnKeyType="next"
                autoCorrect={false}
                style={[formStyles.input ]}
                onChangeText={textChange}
                secureTextEntry={secureTextEntry}
                onChange={onPress}
            />
            <View style={[formStyles.hrLine , error ? formStyles.error : formStyles.input]} />
        </View>
);

export default FormTextInput;