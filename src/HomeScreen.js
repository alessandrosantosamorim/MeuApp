
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const usuario = route.params?.usuario;
  const nome = usuario?.nome || 'Usuário';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#090F1D"
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandSymbol}>ϟ</Text>
              </View>

              <View>
                <Text style={styles.brandName}>Inova premium</Text>
                <Text style={styles.brandSubtitle}>
                  PERSONAL DASHBOARD
                </Text>
              </View>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {nome.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Saudação */}
          <View style={styles.greeting}>
            <Text style={styles.eyebrow}>
              BEM-VINDO DE VOLTA
            </Text>

            <Text style={styles.title}>
              Olá, {nome}.
            </Text>

            <Text style={styles.subtitle}>
              Seu espaço. Sua experiência.
            </Text>
          </View>

          {/* Cartão principal */}
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>
                  SESSÃO ATIVA
                </Text>
              </View>

              <Text style={styles.sparkle}>✦</Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: 'https://candide.vtexassets.com/arquivos/ids/1425540-800-800?v=638987218950030000&width=800&height=800&aspect=true',
                }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.cardTitle}>
              Tudo pronto.
            </Text>

            <Text style={styles.cardDescription}>
              Acesse sua área e aproveite
              sua jornada.
            </Text>

            <View style={styles.separator} />

            <View style={styles.loginInfo}>
              <View style={styles.checkCircle}>
                <Text style={styles.check}>✓</Text>
              </View>

              <View>
                <Text style={styles.loginTitle}>
                  Login realizado
                </Text>
                <Text style={styles.loginSubtitle}>
                  Você está conectado à sua conta.
                </Text>
              </View>
            </View>
          </View>

          {/* Botão sair */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.logoutIcon}>↗</Text>
            <Text style={styles.logoutText}>
              SAIR DA CONTA
            </Text>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.footer}>
            VERSÃO 2.0  •  HOME
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090F1D',
  },

  scroll: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 38,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#B6F36B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandSymbol: {
    fontSize: 30,
    fontWeight: '900',
    color: '#14210A',
  },

  brandName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 2,
  },

  brandSubtitle: {
    fontSize: 8,
    color: '#8290A5',
    letterSpacing: 1.3,
    marginTop: 4,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#35445B',
    backgroundColor: '#17243A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#B6F36B',
    fontSize: 18,
    fontWeight: '800',
  },

  greeting: {
    marginBottom: 28,
  },

  eyebrow: {
    color: '#B6F36B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 10,
  },

  card: {
    backgroundColor: '#131F33',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#2B3A51',
    padding: 20,
    marginBottom: 24,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243A2C',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B6F36B',
    marginRight: 7,
  },

  activeText: {
    color: '#B6F36B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  sparkle: {
    color: '#B6F36B',
    fontSize: 27,
  },

  imageContainer: {
    backgroundColor: '#202E43',
    borderRadius: 20,
    height: 210,
    marginTop: 20,
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  logo: {
    width: '85%',
    height: '85%',
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  cardDescription: {
    color: '#A0AEC0',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 7,
  },

  separator: {
    height: 1,
    backgroundColor: '#2B3A51',
    marginVertical: 20,
  },

  loginInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkCircle: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#243A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  check: {
    color: '#B6F36B',
    fontSize: 19,
    fontWeight: '900',
  },

  loginTitle: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '700',
  },

  loginSubtitle: {
    color: '#8290A5',
    fontSize: 11,
    marginTop: 4,
  },

  logoutButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#B6F36B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    gap: 10,
  },

  logoutIcon: {
    color: '#14210A',
    fontSize: 22,
    fontWeight: '800',
  },

  logoutText: {
    color: '#14210A',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },

  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#9DDF50',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    color: '#14210A',
    fontSize: 19,
    fontWeight: '800',
  },

  footer: {
    color: '#536178',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 26,
  },
});
