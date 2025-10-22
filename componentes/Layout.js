import { StyleSheet, Text,StatusBar, View, TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import Icon from 'react-native-vector-icons/Feather'; 
const navigation = useNavigation();
// Header
const Header = ({label}) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{label}</Text>
  </View>
);
// Body 
const Body = ({ children }) => (
  <View style={styles.body}>
    {children}
  </View>
);
const FooterButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.footerButton} onPress={onPress}>
    <Icon name={icon} size={24} color="#FFA500" />
    <Text style={styles.footerLabel}>{label}</Text>
  </TouchableOpacity>
);

// Footer
const Footer = () => (
  <View style={styles.footer}>
     <FooterButton icon="home" label="Inicio" onPress={() => navigation.navigate('Inicio')} />
      <FooterButton icon="search" label="Buscar" />
      <FooterButton icon="heart" label="Favoritos" />
      <FooterButton icon="settings" label="Ajustes" />
  </View>
);


// Layout
export default function Layout({header,children}) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="auto"  />
        <Header label={header} />
        <Body>
         {children}
        </Body>
        <Footer />
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

  headerText: {
    color: 'black',
    fontSize: 24, 
    fontWeight: 'bold', 
  },
  
  body: {
    flex: 1,
    justifyContent: 'top', 
    alignItems: 'left', 
    padding: 5, 
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
    color: '',
    fontSize: 14,
    marginTop: 4,
  },
});
