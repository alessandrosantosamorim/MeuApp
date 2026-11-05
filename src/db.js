
import { db, auth } from '../firebaseConfig';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';


// ==========================================
// 1. INICIALIZAR BANCO DE DADOS
// ==========================================

export async function initDb() {
  console.log('Firebase conectado com sucesso!');
  return true;
}

// Retorna a conexão com o Firestore.
// Compatibilidade para códigos que chamam getDbConnection().
export async function getDbConnection() {
  return db;
}


// ==========================================
// 2. CADASTRAR USUÁRIO
// ==========================================

export async function cadastrarUsuario(
  nome,
  email,
  senha,
  idade,
  peso,
  criado_em
) {
  try {
    const emailFormatado = email.toLowerCase().trim();
    const idadeNum = parseInt(idade, 10);
    const pesoNum = parseFloat(
      peso.toString().replace(',', '.')
    );

    if (!nome.trim() || !emailFormatado || !senha) {
      throw new Error('Preencha todos os campos.');
    }

    if (!Number.isFinite(idadeNum) || !Number.isFinite(pesoNum)) {
      throw new Error('Idade ou peso inválido.');
    }

    // Cria a conta no Firebase Authentication
    const resultado = await createUserWithEmailAndPassword(
      auth,
      emailFormatado,
      senha
    );

    const uid = resultado.user.uid;

    // Salva os dados do usuário no Firestore
    await setDoc(doc(db, 'usuarios', uid), {
      nome: nome.trim(),
      email: emailFormatado,
      idade: idadeNum,
      peso: pesoNum,
      criado_em: criado_em || new Date().toISOString(),
      criado_em_servidor: serverTimestamp()
    });

    return {
      id: uid,
      uid,
      nome: nome.trim(),
      email: emailFormatado,
      idade: idadeNum,
      peso: pesoNum
    };

  } catch (error) {
    console.log('Erro ao cadastrar usuário:', error);
    throw error;
  }
}


// ==========================================
// 3. LOGIN DO USUÁRIO
// ==========================================

export async function buscarUsuario(email, senha) {
  try {
    const resultado = await signInWithEmailAndPassword(
      auth,
      email.toLowerCase().trim(),
      senha
    );

    const uid = resultado.user.uid;

    const referencia = doc(db, 'usuarios', uid);
    const documento = await getDoc(referencia);

    if (!documento.exists()) {
      throw new Error('Dados do usuário não encontrados.');
    }

    return {
      id: uid,
      uid,
      ...documento.data()
    };

  } catch (error) {
    console.log('Erro ao realizar login:', error);
    throw error;
  }
}


// ==========================================
// 4. BUSCAR TODOS OS USUÁRIOS
// ==========================================

export async function buscarTodosUsuarios() {
  try {
    const usuario = auth.currentUser;

    if (!usuario) {
      throw new Error('Nenhum usuário está logado.');
    }

    const resultado = await getDoc(
      doc(db, 'usuarios', usuario.uid)
    );

    if (!resultado.exists()) {
      return [];
    }

    return [{
      id: resultado.id,
      ...resultado.data()
    }];

  } catch (error) {
    console.log('Erro ao buscar usuário:', error);
    throw error;
  }
}


// ==========================================
// 5. BUSCAR USUÁRIO POR ID
// ==========================================

export async function buscarUsuarioPorId(id) {
  try {
    const referencia = doc(db, 'usuarios', String(id));
    const resultado = await getDoc(referencia);

    if (!resultado.exists()) {
      return null;
    }

    return {
      id: resultado.id,
      ...resultado.data()
    };

  } catch (error) {
    console.log('Erro ao buscar usuário:', error);
    throw error;
  }
}


// ==========================================
// FUNÇÃO AUXILIAR: IDENTIFICAR USUÁRIO
// ==========================================

function obterUsuarioAtual(usuario_id) {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error('Você precisa estar logado.');
  }

  if (
    usuario_id !== undefined &&
    usuario_id !== null &&
    String(usuario_id) !== usuario.uid
  ) {
    throw new Error('Usuário informado não corresponde à sessão atual.');
  }

  return usuario.uid;
}


// ==========================================
// 6. CADASTRAR PEDIDO
// ==========================================

export async function cadastrarPedido(
  descricao,
  valor,
  quantidade,
  usuario_id
) {
  try {
    const uid = obterUsuarioAtual(usuario_id);

    const valorNum = parseFloat(
      valor.toString().replace(',', '.')
    );

    const quantidadeNum = parseInt(quantidade, 10);

    if (!descricao.trim()) {
      throw new Error('Informe a descrição do pedido.');
    }

    if (!Number.isFinite(valorNum) || valorNum < 0) {
      throw new Error('Valor inválido.');
    }

    if (!Number.isInteger(quantidadeNum) || quantidadeNum < 1) {
      throw new Error('Quantidade inválida.');
    }

    const usuarioRef = doc(db, 'usuarios', uid);
    const usuario = await getDoc(usuarioRef);

    if (!usuario.exists()) {
      throw new Error('Usuário não encontrado.');
    }

    const pedidosRef = collection(
      db,
      'usuarios',
      uid,
      'pedidos'
    );

    const dataAtual = new Date().toISOString();

    const resultado = await addDoc(pedidosRef, {
      descricao: descricao.trim(),
      valor: valorNum,
      quantidade: quantidadeNum,
      data_pedido: dataAtual,
      criado_em: serverTimestamp()
    });

    console.log('Pedido cadastrado:', resultado.id);

    return {
      id: resultado.id,
      descricao: descricao.trim(),
      valor: valorNum,
      quantidade: quantidadeNum,
      data_pedido: dataAtual,
      usuario_id: uid
    };

  } catch (error) {
    console.log('Erro ao cadastrar pedido:', error);
    throw error;
  }
}


// ==========================================
// 7. BUSCAR PEDIDOS DE UM USUÁRIO
// ==========================================

export async function buscarPedidosPorUsuario(usuario_id) {
  try {
    const uid = obterUsuarioAtual(usuario_id);

    const pedidosRef = collection(
      db,
      'usuarios',
      uid,
      'pedidos'
    );

    const consulta = query(
      pedidosRef,
      orderBy('data_pedido', 'desc')
    );

    const resultado = await getDocs(consulta);

    const pedidos = resultado.docs.map(documento => ({
      id: documento.id,
      usuario_id: uid,
      ...documento.data()
    }));

    return pedidos;

  } catch (error) {
    console.log('Erro ao buscar pedidos:', error);
    throw error;
  }
}


// ==========================================
// 8. BUSCAR PEDIDOS COM DADOS DO USUÁRIO
// ==========================================

export async function buscarPedidosComUsuario() {
  try {
    const uid = obterUsuarioAtual();

    const usuarioRef = doc(db, 'usuarios', uid);
    const usuarioDoc = await getDoc(usuarioRef);

    if (!usuarioDoc.exists()) {
      return [];
    }

    const pedidos = await buscarPedidosPorUsuario(uid);

    return pedidos.map(pedido => ({
      pedido_id: pedido.id,
      descricao: pedido.descricao,
      valor: pedido.valor,
      quantidade: pedido.quantidade,
      nome_usuario: usuarioDoc.data().nome,
      email: usuarioDoc.data().email
    }));

  } catch (error) {
    console.log('Erro ao buscar pedidos com usuário:', error);
    throw error;
  }
}


// ==========================================
// 9. EXCLUIR PEDIDO
// ==========================================

export async function deletarPedidoPorId(id) {
  try {
    const uid = obterUsuarioAtual();

    const referencia = doc(
      db,
      'usuarios',
      uid,
      'pedidos',
      String(id)
    );

    await deleteDoc(referencia);

    console.log('Pedido excluído:', id);

    return true;

  } catch (error) {
    console.log('Erro ao excluir pedido:', error);
    throw error;
  }
}


// ==========================================
// 10. ATUALIZAR PEDIDO
// ==========================================

export async function atualizarPedido(
  id,
  descricao,
  valor,
  quantidade
) {
  try {
    const uid = obterUsuarioAtual();

    const valorNum = parseFloat(
      valor.toString().replace(',', '.')
    );

    const quantidadeNum = parseInt(quantidade, 10);

    if (!Number.isFinite(valorNum) || valorNum < 0) {
      throw new Error('Valor inválido.');
    }

    if (!Number.isInteger(quantidadeNum) || quantidadeNum < 1) {
      throw new Error('Quantidade inválida.');
    }

    const referencia = doc(
      db,
      'usuarios',
      uid,
      'pedidos',
      String(id)
    );

    await updateDoc(referencia, {
      descricao: descricao.trim(),
      valor: valorNum,
      quantidade: quantidadeNum
    });

    console.log('Pedido atualizado:', id);

    return true;

  } catch (error) {
    console.log('Erro ao atualizar pedido:', error);
    throw error;
  }
}


// ==========================================
// 11. SAIR DA CONTA
// ==========================================

export async function sairUsuario() {
  try {
    await signOut(auth);
    console.log('Usuário desconectado!');
    return true;

  } catch (error) {
    console.log('Erro ao sair:', error);
    throw error;
  }
}
