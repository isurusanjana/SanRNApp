

import { StyleSheet } from 'react-native';
import { Fonts } from '../../config/font';

const formStyles = StyleSheet.create({
  labelText: {
    marginLeft: 15,
    color: "#acacac",
    fontSize: 20,
    // paddingBottom: 5
  },
  labelError:{
    color: 'red'
  },  
  input: {
    color: "#e6e9ed",
    fontFamily: Fonts.Rubik,
    fontSize: 17,
    borderBottomColor:'#f2f3f7',
  },
  hrLine: {
    borderStyle: 'solid',
    borderBottomWidth:1,
    borderBottomColor:'#E6E9ED',
    marginBottom: 15
  },
  error: {
    borderBottomColor : 'red'
  }
});

export default formStyles;
