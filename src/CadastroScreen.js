import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { buscarTodosUsuarios, cadastrarUsuario } from './db';

export default function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [nome, setNome] = useState('');

  
async function handleCadastro() {
  if (
    !email.trim() ||
    !senha.trim() ||
    !nome.trim() ||
    !confirmarSenha.trim() ||
    !idade.trim() ||
    !peso.trim()
  ) {
    Alert.alert('Aviso', 'Por favor, preencha todos os campos.');
    return;
  }

  if (senha.length < 6) {
    Alert.alert('Senha inválida', 'A senha precisa ter pelo menos 6 caracteres.');
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert('Erro', 'As senhas digitadas não coincidem.');
    return;
  }

  const idadeNum = Number(idade);
  const pesoNum = Number(peso.replace(',', '.'));

  if (!Number.isInteger(idadeNum) || idadeNum <= 0) {
    Alert.alert('Erro', 'Informe uma idade válida.');
    return;
  }

  if (!Number.isFinite(pesoNum) || pesoNum <= 0) {
    Alert.alert('Erro', 'Informe um peso válido.');
    return;
  }

  const dataAtual = new Date().toISOString();

  try {
    await cadastrarUsuario(
      nome,
      email,
      senha,
      idade,
      peso,
      dataAtual
    );

    // Não chamar buscarTodosUsuarios() aqui.
    // O cadastro já foi realizado.

    Alert.alert(
      'Sucesso!',
      'Sua conta foi cadastrada com sucesso!',
      [
        {
          text: 'Ir para Login',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );

  } catch (error) {
    console.log('Erro no cadastro:', error.code, error.message);

    if (error.code === 'auth/email-already-in-use') {
      Alert.alert(
        'Email já cadastrado',
        'Este email já possui uma conta. Faça login.'
      );
    } else if (error.code === 'auth/weak-password') {
      Alert.alert(
        'Senha inválida',
        'Sua senha precisa ter pelo menos 6 caracteres.'
      );
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Email inválido', 'Digite um email válido.');
    } else {
      Alert.alert(
        'Erro no cadastro',
        error.message || 'Não foi possível cadastrar sua conta.'
      );
    }
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
                  REGISTRO DE CONTA
                </Text>
              </View>
            </View>
          </View>

          {/* Saudação */}
          <View style={styles.greeting}>
            <Text style={styles.eyebrow}>
              NOVA CONTA
            </Text>

            <Text style={styles.title}>
              Criar Nova Conta.
            </Text>

            <Text style={styles.subtitle}>
              Preencha os dados abaixo para se cadastrar.
            </Text>
          </View>

          {/* Cartão do Formulário */}
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>
                  CADASTRO
                </Text>
              </View>
              <Text style={styles.sparkle}>✦</Text>
            </View>

            <View style={styles.formContent}>
              <Text style={styles.label}>NOME</Text>
              <TextInput
                style={styles.input}
                placeholder="João"
                placeholderTextColor="#64748B"
                value={nome}
                onChangeText={setNome}
              />

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

              <Text style={styles.label}>IDADE</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a sua idade"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                value={idade}
                onChangeText={setIdade}
              />

              <Text style={styles.label}>PESO (KG)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 70.5"
                placeholderTextColor="#64748B"
                keyboardType="decimal-pad"
                value={peso}
                onChangeText={setPeso}
              />

              <Text style={styles.label}>SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="Crie uma senha"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />

              <Text style={styles.label}>CONFIRMAR SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />

              {/* Botão de Cadastro */}
              <TouchableOpacity 
                style={styles.logoutButton} 
                activeOpacity={0.75}
                onPress={handleCadastro}
              >
                <Text style={styles.logoutIcon}>＋</Text>
                <Text style={styles.logoutText}>CADASTRAR CONTA</Text>
                <View style={styles.arrowCircle}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Voltar para Login */}
          <TouchableOpacity 
            style={styles.botaoVoltar} 
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.textoBotaoVoltar}>
              Já tem uma conta? <Text style={styles.linkLogin}>Faça Login</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            VERSÃO 2.0  •  CADASTRO
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
    fontSize: 19,
    fontWeight: '800',
  },
  botaoVoltar: {
    alignItems: 'center',
    padding: 12,
  },
  textoBotaoVoltar: {
    color: '#8290A5',
    fontSize: 14,
    fontWeight: '600',
  },
  linkLogin: {
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