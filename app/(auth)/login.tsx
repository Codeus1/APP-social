import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/lib/auth/auth-context';
import { noctuaColors } from '@/lib/theme/tokens';

export default function LoginScreen() {
  const { bootstrap, signIn, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/(feed)');
    }
  }, [user]);

  const handleLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !email || !password || isSubmitting || isLoading;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: noctuaColors.background }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32, gap: 18 }}
    >
      <View style={{ gap: 10 }}>
        <Text selectable style={{ color: noctuaColors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>
          WELCOME BACK
        </Text>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 32, fontWeight: '900' }}>
          Inicia sesión
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, lineHeight: 22 }}>
          Accede a tu cuenta para descubrir planes y conectar con tu gente.
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={noctuaColors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: noctuaColors.surface,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: noctuaColors.text,
            borderWidth: 1,
            borderColor: noctuaColors.border,
          }}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={noctuaColors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            backgroundColor: noctuaColors.surface,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: noctuaColors.text,
            borderWidth: 1,
            borderColor: noctuaColors.border,
          }}
        />
      </View>

      {errorMessage ? (
        <Text selectable style={{ color: noctuaColors.primary, lineHeight: 20 }}>
          {errorMessage}
        </Text>
      ) : null}

      <Pressable
        onPress={handleLogin}
        disabled={isDisabled}
        style={{
          backgroundColor: isDisabled ? noctuaColors.border : noctuaColors.primary,
          borderRadius: 999,
          paddingVertical: 14,
          alignItems: 'center',
        }}
      >
        <Text selectable style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Text>
      </Pressable>

      <Link href="/(auth)/forgot-password" asChild>
        <Pressable style={{ alignItems: 'center' }}>
          <Text selectable style={{ color: noctuaColors.primary, fontWeight: '700' }}>
            ¿Olvidaste tu contraseña?
          </Text>
        </Pressable>
      </Link>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
        <Text selectable style={{ color: noctuaColors.textMuted }}>
          ¿No tienes cuenta?
        </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text selectable style={{ color: noctuaColors.primary, fontWeight: '700' }}>
              Regístrate
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
