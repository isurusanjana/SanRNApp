import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../config/font';

const sentStyles = StyleSheet.create({
    container: { flex: 1, paddingTop: 25, paddingHorizontal: 20  },
    heading: { fontSize: 18, fontFamily: Fonts.RubikMedium, color: '#142828',  textAlignVertical: 'bottom', textAlign: 'left' },
    headingSub: { color: '#aeb7af', fontFamily: Fonts.Rubik, fontSize: 12, textAlignVertical: 'bottom', textAlign: 'left', paddingBottom: 2 },
    headingFilterIcon: { flex: 1, color: '#aeb7af', justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', },
    clickArea: { height: 'auto' , marginTop: 15 , },
    detailsHeading: { flex: 1, color: '#414253', fontFamily: Fonts.RubikMedium, fontSize: 13,  },
    detailsAmount: { justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', color: '#414253', fontFamily: Fonts.RubikMedium, fontSize: 18, },
    detailsDate: { flex: 1, color: '#AAB2BD', fontFamily: Fonts.Rubik, fontSize: 12 },
    detailsStatus: { elevation: 0, textAlign: 'center', backgroundColor: '#FFD7D7', justifyContent: 'center', alignContent: 'center', alignSelf: 'flex-end', height: 25, width: 50 , borderRadius: 12, },
    detailsStatusText: { fontSize: 13, color: '#EB5757',fontFamily: Fonts.Rubik, justifyContent: 'center', },
    overDuedetailsStatus: { elevation: 0, textAlign: 'center', backgroundColor: '#ffb3b3', justifyContent: 'center', alignContent: 'center', alignSelf: 'flex-end', height: 25, width: 60 , borderRadius: 12},
    overDuedetailsStatusText: { fontSize: 11, color: '#ff0000', fontFamily: Fonts.Rubik, justifyContent: 'center' }
});

export default sentStyles;