
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { buscarUsuarioPorId } from './db';

export default function UserScreen({ navigation, route }) {
  const userId = route.params?.userId;

  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarDadosDoBanco() {
      setCarregando(true);

      try {
        if (userId != null) {
          const dadosDoBanco = await buscarUsuarioPorId(userId);

          if (ativo) {
            setUsuario(dadosDoBanco);
          }
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error(
          'Erro ao buscar usuário no SQLite:',
          error
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDadosDoBanco();

    return () => {
      ativo = false;
    };
  }, [userId]);

  function formatarData(dataIso) {
    if (!dataIso) return 'Não informado';

    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) {
      return 'Data inválida';
    }

    return (
      data.toLocaleDateString('pt-BR') +
      ' às ' +
      data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }

  function handleSair() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const nome = usuario?.nome || 'Usuário';
  const email = usuario?.email || 'E-mail não informado';

  if (carregando) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#090F1D"
        />

        <View style={styles.loadingIcon}>
          <ActivityIndicator
            size="large"
            color="#B6F36B"
          />
        </View>

        <Text style={styles.loadingTitle}>
          Carregando perfil
        </Text>

        <Text style={styles.loadingSubtitle}>
          Buscando suas informações...
        </Text>
      </SafeAreaView>
    );
  }

  if (!usuario) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#090F1D"
        />

        <View style={styles.emptyIcon}>
          <Text style={styles.emptySymbol}>!</Text>
        </View>

        <Text style={styles.loadingTitle}>
          Perfil não encontrado
        </Text>

        <Text style={styles.loadingSubtitle}>
          Não foi possível localizar os dados deste usuário.
        </Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSair}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>
            VOLTAR AO LOGIN
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const dados = [
    {
      simbolo: 'ID',
      label: 'ID DO USUÁRIO',
      valor: usuario.id != null
        ? `#${usuario.id}`
        : 'Não informado',
    },
    {
      simbolo: 'U',
      label: 'NOME COMPLETO',
      valor: usuario.nome || 'Não informado',
    },
    {
      simbolo: '@',
      label: 'E-MAIL',
      valor: usuario.email || 'Não informado',
    },
    {
      simbolo: 'A',
      label: 'IDADE',
      valor: usuario.idade != null &&
        usuario.idade !== ''
        ? `${usuario.idade} anos`
        : 'Não informada',
    },
    {
      simbolo: 'P',
      label: 'PESO',
      valor: usuario.peso != null &&
        usuario.peso !== ''
        ? `${usuario.peso} kg`
        : 'Não informado',
    },
    {
      simbolo: 'T',
      label: 'DATA DE CADASTRO',
      valor: formatarData(usuario.criado_em),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#090F1D"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <View>
              <Text style={styles.breadcrumb}>
                Inova premium / CONTA
              </Text>

              <Text style={styles.pageTitle}>
                Meu perfil
              </Text>

              <Text style={styles.pageSubtitle}>
                Suas informações pessoais
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>✦</Text>
            </View>
          </View>

          {/* Cartão do usuário */}
          <View style={styles.profileCard}>
            <View style={styles.profileGlow} />

            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://candide.vtexassets.com/arquivos/ids/1425540-800-800?v=638987218950030000&width=800&height=800&aspect=true',
                }}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.userName}>
              {nome}
            </Text>

            <Text style={styles.userEmail}>
              {email}
            </Text>

            <View style={styles.profileBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.profileBadgeText}>
                PERFIL CADASTRADO
              </Text>
            </View>
          </View>

          {/* Dados do banco */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Informações da conta
              </Text>

              <Text style={styles.sectionSubtitle}>
                Dados registrados no sistema
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countText}>06</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            {dados.map((item, index) => (
              <View key={item.label}>
                <View style={styles.dataRow}>
                  <View style={styles.dataIcon}>
                    <Text style={styles.dataIconText}>
                      {item.simbolo}
                    </Text>
                  </View>

                  <View style={styles.dataContent}>
                    <Text style={styles.dataLabel}>
                      {item.label}
                    </Text>

                    <Text style={styles.dataValue}>
                      {item.valor}
                    </Text>
                  </View>
                </View>

                {index < dados.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>

          {/* Botão sair */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleSair}
            activeOpacity={0.75}
          >
            <Text style={styles.logoutSymbol}>↗</Text>

            <Text style={styles.logoutText}>
              SAIR DA CONTA
            </Text>

            <View style={styles.logoutArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Inova premium  •  PERFIL DO USUÁRIO
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

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },

  breadcrumb: {
    color: '#B6F36B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 8,
  },

  pageTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  pageSubtitle: {
    color: '#8290A5',
    fontSize: 13,
    marginTop: 6,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#243A2C',
    borderWidth: 1,
    borderColor: '#405C3B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIconText: {
    fontSize: 26,
    color: '#B6F36B',
  },

  profileCard: {
    backgroundColor: '#131F33',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B3A51',
    marginBottom: 30,
    overflow: 'hidden',
  },

  profileGlow: {
    position: 'absolute',
    top: -70,
    width: 220,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#1C352B',
    opacity: 0.55,
  },

  avatarContainer: {
    width: 112,
    height: 112,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#B6F36B',
    backgroundColor: '#202E43',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },

  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 28,
  },

  userName: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },

  userEmail: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 7,
    textAlign: 'center',
  },

  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243A2C',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 18,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B6F36B',
    marginRight: 8,
  },

  profileBadgeText: {
    color: '#B6F36B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#8290A5',
    fontSize: 12,
    marginTop: 5,
  },

  countBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#243A2C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#B6F36B',
    fontWeight: '900',
    fontSize: 12,
  },

  detailsCard: {
    backgroundColor: '#131F33',
    borderWidth: 1,
    borderColor: '#2B3A51',
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  dataIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#243A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  dataIconText: {
    color: '#B6F36B',
    fontSize: 14,
    fontWeight: '900',
  },

  dataContent: {
    flex: 1,
  },

  dataLabel: {
    color: '#8290A5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
  },

  dataValue: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#2B3A51',
  },

  logoutButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#B6F36B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },

  logoutSymbol: {
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

  logoutArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#9DDF50',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    color: '#14210A',
    fontSize: 19,
    fontWeight: '800',
  },

  footer: {
    color: '#536178',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.8,
    textAlign: 'center',
    marginTop: 24,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#090F1D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  loadingIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#131F33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#2B3A51',
  },

  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },

  loadingSubtitle: {
    color: '#8290A5',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 20,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: '#35252C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptySymbol: {
    color: '#FCA5A5',
    fontSize: 32,
    fontWeight: '800',
  },
});
