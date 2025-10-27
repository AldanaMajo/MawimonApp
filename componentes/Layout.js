import { StyleSheet, Text,StatusBar, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import { Feather as Icon } from '@expo/vector-icons';
import { Ionicons as Icons } from '@expo/vector-icons';

// HeaderNav
const HeaderNav = () => (
  <View style={styles.headerNav}>
   
    <TouchableOpacity style={styles.iconoU}>
    <Icons name="person-circle-outline" size={40} color="#000" />
    </TouchableOpacity>

  </View>
);
// Header
const Header = ({label}) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{label}</Text>
  </View>
);
// Body 
const Body = ({ children }) => (
  <View style={[styles.body, { flex: 1, width: '100%' }]}>
    {children}
  </View>
);
const FooterButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.footerButton} onPress={onPress}>
    <Icon name={icon} size={24} color="#FFA500" />
    
    <Text style={styles.footerLabel}>{label}</Text>
  </TouchableOpacity>
);
const FooterButtonGame = ({ icons, label, onPress }) => (
  <TouchableOpacity style={styles.footerButton} onPress={onPress}>
    <Icons name={icons} size={24} color="#FFA500" />
    <Text style={styles.footerLabel}>{label}</Text>
  </TouchableOpacity>
);

// Footer
const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <FooterButton icon="home" label="Inicio" onPress={() => navigation.navigate('Inicio')} />
      <FooterButton icon="search" label="Pokédex" onPress={() => navigation.navigate('Buscar')} />
      <FooterButton icon="heart" label="Favoritos" onPress={() => navigation.navigate('Favoritos')} />
      <FooterButtonGame icons="game-controller-outline" label="MiniGame" onPress={() => navigation.navigate('MiniGame')} />
    </View>
  );
};

// Layout
export default function Layout({ header, children, navigation }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <HeaderNav/>
        <Header label={header} />
        <Body>{children}</Body>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1, 
  },

  header: {
    height: 35,
    justifyContent: 'center', 
    alignItems: 'center',   
  },

  headerNav: {
    height: 60,
    backgroundColor: '#a3a2a2',
    flexDirection: 'row',       
    justifyContent: 'flex-end',  
    alignItems: 'center', 
    paddingHorizontal: 15,
},

iconoU: {
  justifyContent: 'center',
  alignItems: 'center',
},

  headerText: {
    color: 'black',
    fontSize: 24, 
    fontFamily: 'TituloP',
  },
  
body: {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'stretch', 
  width: '100%',
  backgroundColor: '#f5f5f5',
},



  footer: {
    height: 80, 
    backgroundColor: '#3384cc', 
    alignItems: 'center', 
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
footerLabel: {
  color: 'white',
  fontSize: 16,
  marginTop: 4,
  fontFamily: 'TituloP',
},

});
