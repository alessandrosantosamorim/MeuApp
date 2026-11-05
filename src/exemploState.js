import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function ExemploState() {
  // Criamos o estado chamado 'email'
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}            // 1. O campo exibe o valor salvo no 'email'
        onChangeText={setEmail}  // 2. A cada letra digitada, o 'setEmail' atualiza o estado
      />

      {/* Mostra em tempo real o que o usuário está digitando */}
      <Text style={styles.resultado}>
        Você está digitando: {email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 48, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12 },
  resultado: { marginTop: 16, fontSize: 16, color: '#0284C7' },
});