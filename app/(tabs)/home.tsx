import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import AuthGuard from '../middleware/AuthGuard';

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    fetchPosts();
    const fetchAuthorName = async () => {
        try {
          const name = await AsyncStorage.getItem('@authorName');
          if (name) {
            setAuthorName(name);
          }
        } catch (error) {
          console.error('Erro ao buscar authorName:', error);
        }
      };
    
      fetchAuthorName();
  }, []);


    const getAuthorId = async () => {
    const authorId = await AsyncStorage.getItem('@authorId');
    return authorId ? parseInt(authorId, 10) : null;
  };

  // Função para buscar todos os posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      Alert.alert('Erro', 'Não foi possível carregar os posts');
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um post
  const handleCreatePost = async () => {
    

    if (!title || !content) {
        console.log('Erro', 'Título e conteúdo são obrigatórios');
      return;
    }
  
    try {
        const authorId = await getAuthorId();
        console.log(authorId);
      if (!authorId) {
        console.log('Erro', 'Não foi possível encontrar o authorId no token');
        return;
      }
  
      const token = await AsyncStorage.getItem('@authToken');
      const response = await fetch('http://localhost:3000/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, authorId }),
      });
  
      const result = await response.json();
      fetchPosts(); // Recarregar posts após criação
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      console.log('Erro', 'Não foi possível criar o post');
    }
  };
  

  // Função para editar um post
  const handleEditPost = async () => {
    if (!title || !content) {  // Verifica se título e conteúdo foram preenchidos
        console.log('Erro', 'Título e conteúdo são obrigatórios');
      return;
    }

    try {
        const authorId = await getAuthorId(); // Obtém o authorId do token
      if (!authorId) {
        console.log('Erro', 'Não foi possível encontrar o authorId no token');
        return;
      }

      const token = await AsyncStorage.getItem('@authToken');
      const response = await fetch(`http://localhost:3000/posts/edit/${editingPostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, authorId }), // Envia o authorId em vez do author
      });

      const result = await response.json();
      console.log('Sucesso', 'Post atualizado com sucesso');
      fetchPosts(); // Recarregar posts após atualização
      setEditingPostId(null);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Erro ao editar post:', error);
      Alert.alert('Erro', 'Não foi possível editar o post');
    }
  };

  // Função para deletar um post
  const handleDeletePost = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('@authToken');
      const response = await fetch(`http://localhost:3000/posts/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      Alert.alert('Sucesso', result.message);
      fetchPosts();
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      Alert.alert('Erro', 'Não foi possível deletar o post');
    }
  };

  
  // Renderiza a lista de posts
  const renderPost = ({ item }: { item: Post }) => (
    
    <View style={{ padding: 10, marginVertical: 5, backgroundColor: 'lightgray' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>Autor: {item.content}</Text>
      <Text>{authorName || 'Desconhecido'}</Text>
      <Button title="Editar" onPress={() => { setEditingPostId(item.id); setTitle(item.title); setContent(item.content); }} />
      <Button title="Excluir" onPress={() => handleDeletePost(item.id)} />
    </View>
  );

  return (
    <AuthGuard>
      <View style={{ flex: 1, padding: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <>
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id.toString()}
            />
            <TextInput
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
              style={{ borderBottomWidth: 1, marginVertical: 10 }}
            />
            <TextInput
              placeholder="Conteúdo"
              value={content}
              onChangeText={setContent}
              style={{ borderBottomWidth: 1, marginVertical: 10 }}
            />
            {editingPostId ? (
              <Button title="Atualizar Post" onPress={handleEditPost} />
            ) : (
              <Button title="Criar Post" onPress={handleCreatePost} />
            )}
          </>
        )}
      </View>
    </AuthGuard>
  );
}
