import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../config/font';

const paidStyles = StyleSheet.create({
    container: { flex: 1, paddingTop: 25, paddingHorizontal: 20 },
    heading: { fontSize: 18, fontFamily: Fonts.RubikMedium, color: '#142828',  textAlignVertical: 'bottom', textAlign: 'left' },
    headingSub: { color: '#aeb7af', fontFamily: Fonts.Rubik, fontSize: 12, textAlignVertical: 'bottom', textAlign: 'left', paddingBottom: 2  },
    headingFilterIcon: { flex: 1, color: '#aeb7af', justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', },
    clickArea: { height: 'auto' , marginTop: 15 , },
    detailsHeading: { flex: 1, color: '#142828', fontFamily: Fonts.RubikMedium, fontSize: 14 },
    detailsAmount: { justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', color: '#142828', fontFamily: Fonts.RubikMedium, fontSize: 15, },
    detailsDate: { flex: 1, color: '#aeb7af', fontFamily: Fonts.Rubik, fontSize: 12 },
    detailsStatus: { elevation: 0, textAlign: 'center', backgroundColor: '#e3f8f2', justifyContent: 'center', alignContent: 'center', alignSelf: 'flex-end', height: 25, width: 35, marginRight:10 },
    detailsStatusText: { fontSize: 11, color: '#2ee5b5', fontFamily: Fonts.MontserratBold, justifyContent: 'center',  },

});

export default paidStyles;