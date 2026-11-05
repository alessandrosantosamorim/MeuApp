import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  cadastrarPedido,
  buscarPedidosPorUsuario,
  deletarPedidoPorId,
  atualizarPedido,
} from './db';

export default function CadastrarPedidoScreen({ navigation, route }) {
  const userId = route.params?.userId;

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEmEdicaoId, setPedidoEmEdicaoId] = useState(null);

  // Calcula o custo total considerando valor unitário x quantidade.
  const custoTotal = pedidos.reduce((total, item) => {
    const valorItem = Number(item.valor) || 0;
    const quantidadeItem = Number(item.quantidade) || 0;

    return total + valorItem * quantidadeItem;
  }, 0);

  function formatarMoeda(valorNumerico) {
    return Number(valorNumerico).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  async function carregarPedidos() {
    if (userId == null) return;

    try {
      const lista = await buscarPedidosPorUsuario(userId);
      setPedidos(lista);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, [userId]);

  // Carrega os dados do pedido selecionado.
  function handleIniciarEdicao(item) {
    setPedidoEmEdicaoId(item.id);
    setDescricao(item.descricao);
    setValor(String(item.valor));
    setQuantidade(String(item.quantidade ?? 1));
  }

  // Limpa os campos do formulário.
  function handleCancelarEdicao() {
    setPedidoEmEdicaoId(null);
    setDescricao('');
    setValor('');
    setQuantidade('');
  }

  // Cadastra ou atualiza o pedido.
  async function handleSalvarPedido() {
    if (
      !descricao.trim() ||
      !valor.trim() ||
      !quantidade.trim()
    ) {
      Alert.alert(
        'Atenção',
        'Preencha a descrição, o valor e a quantidade.'
      );
      return;
    }

    const valorNum = Number(valor.trim().replace(',', '.'));
    const quantidadeNum = Number(quantidade.trim());

    if (!Number.isFinite(valorNum) || valorNum <= 0) {
      Alert.alert(
        'Atenção',
        'Informe um valor válido maior que zero.'
      );
      return;
    }

    if (
      !Number.isInteger(quantidadeNum) ||
      quantidadeNum <= 0
    ) {
      Alert.alert(
        'Atenção',
        'Informe uma quantidade inteira maior que zero.'
      );
      return;
    }

    if (userId == null && pedidoEmEdicaoId == null) {
      Alert.alert(
        'Erro',
        'Não foi possível identificar o usuário.'
      );
      return;
    }

    try {
      if (pedidoEmEdicaoId !== null) {
        await atualizarPedido(
          pedidoEmEdicaoId,
          descricao.trim(),
          valorNum,
          quantidadeNum
        );

        Alert.alert('Sucesso', 'Pedido atualizado com sucesso!');
      } else {
        await cadastrarPedido(
          descricao.trim(),
          valorNum,
          quantidadeNum,
          userId
        );

        Alert.alert('Sucesso', 'Pedido cadastrado com sucesso!');
      }

      handleCancelarEdicao();
      await carregarPedidos();
    } catch (error) {
      console.error('Erro ao salvar/atualizar pedido:', error);

      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível salvar o pedido.'
      );
    }
  }

  // Exclui um pedido.
  function handleDeletarPedido(pedidoId, descricaoPedido) {
    Alert.alert(
      'Excluir pedido',
      `Deseja realmente excluir "${descricaoPedido}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarPedidoPorId(pedidoId);

              if (pedidoEmEdicaoId === pedidoId) {
                handleCancelarEdicao();
              }

              await carregarPedidos();

              Alert.alert(
                'Sucesso',
                'Pedido excluído com sucesso!'
              );
            } catch (error) {
              console.error('Erro ao excluir pedido:', error);
              Alert.alert(
                'Erro',
                'Não foi possível excluir o pedido.'
              );
            }
          },
        },
      ]
    );
  }

  function formatarData(dataIso) {
    if (!dataIso) return 'N/A';

    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) return 'N/A';

    return data.toLocaleDateString('pt-BR');
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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          {/* CABEÇALHO */}
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandSymbol}>ϟ</Text>
              </View>

              <View>
                <Text style={styles.brandName}>
                  Inova premium
                </Text>

                <Text style={styles.brandSubtitle}>
                  GESTÃO DE PEDIDOS
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.75}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#B6F36B"
              />
            </TouchableOpacity>
          </View>

          {/* TÍTULO */}
          <View style={styles.greeting}>
            <Text style={styles.eyebrow}>
              {pedidoEmEdicaoId !== null
                ? 'EDIÇÃO DE PEDIDO'
                : 'ÁREA DE PEDIDOS'}
            </Text>

            <Text style={styles.title}>
              {pedidoEmEdicaoId !== null
                ? 'Editar Pedido.'
                : 'Novo Pedido.'}
            </Text>

            <Text style={styles.subtitle}>
              Cadastre, organize e acompanhe seus pedidos
              em um só lugar.
            </Text>
          </View>

          {/* RESUMO DE PEDIDOS */}
          <View style={styles.statsCard}>
            <View style={styles.statsIcon}>
              <Ionicons
                name="receipt-outline"
                size={24}
                color="#B6F36B"
              />
            </View>

            <View style={styles.statsInfo}>
              <Text style={styles.statsLabel}>
                PEDIDOS CADASTRADOS
              </Text>

              <Text style={styles.statsValue}>
                {pedidos.length}
              </Text>
            </View>

            <View style={styles.statsBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.statsBadgeText}>
                ATIVO
              </Text>
            </View>
          </View>

          {/* CARTÃO DE CUSTO TOTAL */}
          <View style={styles.costCard}>
            <View style={styles.costHeader}>
              <View style={styles.costHeading}>
                <Text style={styles.costLabel}>
                  CUSTO TOTAL DOS PEDIDOS
                </Text>

                <Text style={styles.costSubtitle}>
                  Valor unitário multiplicado pela quantidade
                </Text>
              </View>

              <View style={styles.costIcon}>
                <Ionicons
                  name="wallet-outline"
                  size={25}
                  color="#B6F36B"
                />
              </View>
            </View>

            <Text style={styles.costValue}>
              {formatarMoeda(custoTotal)}
            </Text>

            <View style={styles.costDivider} />

            <View style={styles.costFooter}>
              <Ionicons
                name="checkmark-circle-outline"
                size={17}
                color="#B6F36B"
              />

              <Text style={styles.costFooterText}>
                {pedidos.length}{' '}
                {pedidos.length === 1
                  ? 'pedido registrado'
                  : 'pedidos registrados'}
              </Text>
            </View>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />

                <Text style={styles.activeText}>
                  {pedidoEmEdicaoId !== null
                    ? 'EDITANDO'
                    : 'CADASTRO'}
                </Text>
              </View>

              <Ionicons
                name={
                  pedidoEmEdicaoId !== null
                    ? 'create-outline'
                    : 'add-circle-outline'
                }
                size={27}
                color="#B6F36B"
              />
            </View>

            <Text style={styles.cardTitle}>
              {pedidoEmEdicaoId !== null
                ? 'Atualizar informações'
                : 'Informações do pedido'}
            </Text>

            <Text style={styles.cardDescription}>
              Preencha os campos abaixo para continuar.
            </Text>

            <View style={styles.formContent}>

              <Text style={styles.label}>
                DESCRIÇÃO DO PEDIDO
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="pricetag-outline"
                  size={19}
                  color="#8290A5"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Ex: Tênis de corrida"
                  placeholderTextColor="#64748B"
                  value={descricao}
                  onChangeText={setDescricao}
                  returnKeyType="next"
                />
              </View>

              <Text style={styles.label}>
                VALOR UNITÁRIO (R$)
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="cash-outline"
                  size={19}
                  color="#8290A5"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Ex: 150,00"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={valor}
                  onChangeText={setValor}
                />
              </View>

              <Text style={styles.label}>
                QUANTIDADE
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="layers-outline"
                  size={19}
                  color="#8290A5"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Ex: 2"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  value={quantidade}
                  onChangeText={setQuantidade}
                />
              </View>

              {/* PRÉVIA DO TOTAL DO PEDIDO */}
              <View style={styles.previewCard}>
                <View>
                  <Text style={styles.previewLabel}>
                    TOTAL DESTE PEDIDO
                  </Text>

                  <Text style={styles.previewSubtitle}>
                    Valor × quantidade
                  </Text>
                </View>

                <Text style={styles.previewValue}>
                  {formatarMoeda(
                    (Number(valor.trim().replace(',', '.')) || 0) *
                    (Number(quantidade.trim()) || 0)
                  )}
                </Text>
              </View>

              {/* BOTÃO PRINCIPAL */}
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handleSalvarPedido}
              >
                <Ionicons
                  name={
                    pedidoEmEdicaoId !== null
                      ? 'checkmark-circle-outline'
                      : 'add-circle-outline'
                  }
                  size={21}
                  color="#14210A"
                />

                <Text style={styles.primaryButtonText}>
                  {pedidoEmEdicaoId !== null
                    ? 'ATUALIZAR PEDIDO'
                    : 'SALVAR PEDIDO'}
                </Text>

                <View style={styles.arrowCircle}>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#14210A"
                  />
                </View>
              </TouchableOpacity>

              {pedidoEmEdicaoId !== null && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.75}
                  onPress={handleCancelarEdicao}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color="#F87171"
                  />

                  <Text style={styles.cancelButtonText}>
                    CANCELAR EDIÇÃO
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* LISTAGEM */}
          <View style={styles.listHeader}>
            <View>
              <Text style={styles.listTitle}>
                Meus Pedidos
              </Text>

              <Text style={styles.listSubtitle}>
                Histórico de pedidos cadastrados
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {pedidos.length}
              </Text>
            </View>
          </View>

          {pedidos.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="file-tray-outline"
                  size={34}
                  color="#B6F36B"
                />
              </View>

              <Text style={styles.emptyTitle}>
                Nenhum pedido ainda
              </Text>

              <Text style={styles.emptyText}>
                Seus pedidos cadastrados aparecerão aqui.
              </Text>
            </View>
          ) : (
            pedidos.map((item) => (
              <View
                key={String(item.id)}
                style={styles.orderCard}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderIcon}>
                    <Ionicons
                      name="receipt-outline"
                      size={21}
                      color="#B6F36B"
                    />
                  </View>

                  <View style={styles.orderHeading}>
                    <Text
                      style={styles.orderDescription}
                      numberOfLines={2}
                    >
                      {item.descricao}
                    </Text>

                    <Text style={styles.orderId}>
                      PEDIDO #{item.id}
                    </Text>
                  </View>

                  <View style={styles.orderActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.7}
                      accessibilityLabel="Editar pedido"
                      onPress={() => handleIniciarEdicao(item)}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={18}
                        color="#B6F36B"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.7}
                      accessibilityLabel="Excluir pedido"
                      onPress={() =>
                        handleDeletarPedido(item.id, item.descricao)
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#F87171"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      VALOR UNITÁRIO
                    </Text>

                    <Text style={styles.orderPrice}>
                      {formatarMoeda(item.valor)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      QUANTIDADE
                    </Text>

                    <Text style={styles.detailValue}>
                      {Number(item.quantidade)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>
                      DATA
                    </Text>

                    <Text style={styles.dateValue}>
                      {formatarData(item.data_pedido)}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalLabel}>
                    TOTAL DO ITEM
                  </Text>

                  <Text style={styles.itemTotalValue}>
                    {formatarMoeda(
                      Number(item.valor) * Number(item.quantidade)
                    )}
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* VOLTAR AO PAINEL */}
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={20}
              color="#B6F36B"
            />

            <Text style={styles.backButtonText}>
              VOLTAR AO PAINEL
            </Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            INOVA PREMIUM • GESTÃO DE PEDIDOS
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
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 28,
  },

  // CABEÇALHO
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 34,
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

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#131F33',
    borderWidth: 1,
    borderColor: '#2B3A51',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // TÍTULO
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
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },

  // RESUMO
  statsCard: {
    backgroundColor: '#131F33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2B3A51',
    padding: 17,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#243A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  statsInfo: {
    flex: 1,
  },

  statsLabel: {
    color: '#8290A5',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  statsValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 3,
  },

  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243A2C',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },

  statsBadgeText: {
    color: '#B6F36B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B6F36B',
    marginRight: 7,
  },

  // CUSTO TOTAL
  costCard: {
    backgroundColor: '#131F33',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3C5739',
    padding: 20,
    marginBottom: 28,
  },

  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  costHeading: {
    flex: 1,
    paddingRight: 10,
  },

  costLabel: {
    color: '#B6F36B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  costSubtitle: {
    color: '#8290A5',
    fontSize: 11,
    marginTop: 7,
    lineHeight: 17,
  },

  costIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#243A2C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  costValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 20,
  },

  costDivider: {
    height: 1,
    backgroundColor: '#2B3A51',
    marginVertical: 17,
  },

  costFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  costFooterText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },

  // FORMULÁRIO
  card: {
    backgroundColor: '#131F33',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#2B3A51',
    padding: 20,
    marginBottom: 30,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243A2C',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  activeText: {
    color: '#B6F36B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  cardTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },

  cardDescription: {
    color: '#8290A5',
    fontSize: 12,
    marginTop: 7,
    marginBottom: 12,
    lineHeight: 18,
  },

  formContent: {
    marginTop: 3,
  },

  label: {
    color: '#B6F36B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 9,
    marginTop: 14,
  },

  inputContainer: {
    minHeight: 53,
    backgroundColor: '#202E43',
    borderWidth: 1,
    borderColor: '#35445B',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 14,
    color: '#FFFFFF',
    paddingVertical: 10,
  },

  // PRÉVIA DO PEDIDO
  previewCard: {
    backgroundColor: '#202E43',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#35445B',
    padding: 14,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  previewLabel: {
    color: '#B6F36B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  previewSubtitle: {
    color: '#8290A5',
    fontSize: 10,
    marginTop: 5,
  },

  previewValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    flexShrink: 1,
  },

  // BOTÕES
  primaryButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: '#B6F36B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    gap: 9,
    marginTop: 24,
  },

  primaryButtonText: {
    color: '#14210A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
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

  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    marginTop: 6,
  },

  cancelButtonText: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // LISTAGEM
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  listTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  listSubtitle: {
    color: '#8290A5',
    fontSize: 12,
    marginTop: 5,
  },

  countBadge: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: '#243A2C',
    borderWidth: 1,
    borderColor: '#3C5739',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#B6F36B',
    fontSize: 15,
    fontWeight: '900',
  },

  // LISTA VAZIA
  emptyCard: {
    backgroundColor: '#131F33',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2B3A51',
    borderStyle: 'dashed',
    paddingHorizontal: 22,
    paddingVertical: 32,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#243A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },

  emptyText: {
    color: '#8290A5',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },

  // CARTÃO DO PEDIDO
  orderCard: {
    backgroundColor: '#131F33',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#2B3A51',
    padding: 16,
    marginBottom: 13,
  },

  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#243A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  orderHeading: {
    flex: 1,
    marginRight: 6,
  },

  orderDescription: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },

  orderId: {
    color: '#8290A5',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 5,
  },

  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#202E43',
    borderWidth: 1,
    borderColor: '#35445B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#2B3A51',
    marginVertical: 16,
  },

  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    color: '#8290A5',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 7,
  },

  orderPrice: {
    color: '#B6F36B',
    fontSize: 12,
    fontWeight: '900',
  },

  detailValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },

  dateValue: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },

  itemTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#202E43',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 16,
  },

  itemTotalLabel: {
    color: '#8290A5',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  itemTotalValue: {
    color: '#B6F36B',
    fontSize: 14,
    fontWeight: '900',
  },

  // RODAPÉ
  backButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#131F33',
    borderWidth: 1,
    borderColor: '#2B3A51',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 18,
  },

  backButtonText: {
    color: '#B6F36B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  footer: {
    color: '#536178',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 24,
  },
});
