import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ScrollView, 
  StatusBar, 
  SafeAreaView 
} from 'react-native';
import { buscarUsuario } from './db';

export default function LoginScreen({ navigation }) {
  // 1. Estados para capturar os dados digitados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  // 2. Função de Login com consulta ao Banco de Dados
  async function handleLogin() {
    // Validação de campos vazios
    if (email.trim() === '' || senha.trim() === '') {
      Alert.alert('Aviso', 'Por favor, informe o e-mail e a senha.');
      return;
    }

    try {
      // Consulta o SQLite para verificar se existe um registro com esse e-mail e senha
      const usuarioEncontrado = await buscarUsuario(email, senha);

      if (usuarioEncontrado) {
        // Se encontrou no banco, avança para a Home passando os dados do usuário
        Alert.alert('Sucesso', `Bem-vindo(a), ${usuarioEncontrado.nome}!`);
        
        // Navega limpando o formulário e envia o objeto do usuário para a Home
        setEmail('');
        setSenha('');
        navigation.navigate('Home', { usuario: usuarioEncontrado });
      } else {
        Alert.alert('Erro de Autenticação', 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao consultar o banco de dados.');
    }
  }

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

          {/* Cabeçalho / Logotipo */}
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandSymbol}>ϟ</Text>
              </View>

              <View>
                <Text style={styles.brandName}>Inova premium</Text>
                <Text style={styles.brandSubtitle}>
                  AUTENTICAÇÃO
                </Text>
              </View>
            </View>
          </View>

          {/* Saudação */}
          <View style={styles.greeting}>
            <Text style={styles.eyebrow}>
              BEM-VINDO DE VOLTA
            </Text>

            <Text style={styles.title}>
              Faça o Login.
            </Text>

            <Text style={styles.subtitle}>
              Informe suas credenciais para acessar sua conta.
            </Text>
          </View>

          {/* Cartão do Formulário */}
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>
                  SEGURANÇA ATIVA
                </Text>
              </View>
              <Text style={styles.sparkle}>✦</Text>
            </View>

            <View style={styles.formContent}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />

              {/* Botão Principal de Login */}
              <TouchableOpacity 
                style={styles.logoutButton} 
                activeOpacity={0.75}
                onPress={handleLogin}
              >
                <Text style={styles.logoutIcon}>→︎</Text>
                <Text style={styles.logoutText}>ENTRAR NA CONTA</Text>
                <View style={styles.arrowCircle}>
                  <Text style={styles.arrow}>✓</Text>
                </View>
              </TouchableOpacity>

              
            </View>
            
          </View>
          

          {/* Botão Secundário para criar conta */}
          <TouchableOpacity
  style={styles.botaoCriarConta}
  activeOpacity={0.75}
  onPress={() => navigation.navigate('Cadastro')}
>
  <Text style={styles.textoCriarConta}>
    Não tem uma conta?{' '}
    <Text style={styles.linkCadastre}>
      Cadastre-se
    </Text>
  </Text>
</TouchableOpacity>

          <Text style={styles.footer}>
            VERSÃO 2.0  •  LOGIN
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
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
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
  greeting: {
    marginBottom: 24,
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
    marginBottom: 20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  formContent: {
    marginTop: 4,
  },
  label: {
    color: '#B6F36B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 52,
    backgroundColor: '#202E43',
    borderWidth: 1,
    borderColor: '#35445B',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#FFFFFF',
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
    marginTop: 24,
  },
  logoutIcon: {
    color: '#14210A',
    fontSize: 20,
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
    fontSize: 16,
    fontWeight: '900',
  },
  botaoCriarConta: {
    alignItems: 'center',
    padding: 12,
  },
  textoCriarConta: {
    color: '#8290A5',
    fontSize: 14,
    fontWeight: '600',
  },
  linkCadastre: {
    color: '#B6F36B',
    fontWeight: '800',
  },
  footer: {
    color: '#536178',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 20,
  },
});