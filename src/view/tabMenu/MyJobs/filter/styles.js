import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../../../config/font';

const filterJobstyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,  
        paddingTop: 40,
      },
    defaultSelectButton: { borderRadius: 5, borderWidth: 0, marginLeft: 15, height: 30, justifyContent: 'center' },
    defaultButtonText: { 
        fontSize: 13, 
        fontFamily: Fonts.MontserratBold,
        color: '#AAB2BD',
        
        
        
     },
    defaultButtonBackGroundColor: { 
        width: 'auto', 
        justifyContent:'center', 
        alignItems: 'center' 
    },
    defaultLeftButtonBackGroundColor: { 
        width: 'auto', 
        justifyContent:'center', 
        alignItems: 'flex-end' ,
        
    },
    defaultRightButtonBackGroundColor: { 
        width: 'auto', 
        justifyContent:'center', 
        alignItems: 'flex-start' 
    },
    defaultButtonTextColor: { color: '#AAB2BD' },
    selectedButtonBackgroundColor: { backgroundColor: '#2ee5b5', paddingHorizontal: 10 },
    selectedButtonTextColor: { color: '#1F89E4' },
    overDatePicker: {
        width: '100%',
        position: 'absolute',
        right: 15, left: 20,
        borderRadius: 15, 
        shadowColor: '#CEFDF2',
        shadowOpacity: 0.36,
        elevation: 10,
        shadowRadius: 20 ,
        padding: 0,
        shadowOffset : { width: 0, height: 5},
    },
    calendarStyle: {
        height: 350,
   },
   input: {
        left:0,
        height:20,
        // marginBottom: 30,        
        color: '#414253',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 15,
        borderStyle: 'solid',
        // borderBottomWidth:1,
        borderBottomColor:'#E6E9ED',
        alignItems: 'flex-start',
        justifyContent:'center',
    //   backgroundColor: 'red',
    //   padding: 0,
        paddingBottom:1,
        paddingLeft: 0,
        paddingTop:0
    },
    defaultButton: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#AAB2BD', 
        flexDirection: 'row', 
        paddingVertical: 5,
        paddingLeft: 5,
        paddingRight: 20,
        borderRadius: 20
    },
    selectedButton: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#1F89E4', 
        flexDirection: 'row',
        paddingVertical: 5,
        paddingLeft: 5,
        paddingRight: 20,
        borderRadius: 20
    }
});


export { filterJobstyles };