import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { apiRequest } from '@/lib/http/api-client';
import { noctuaColors } from '@/lib/theme/tokens';

function resolveApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!envUrl) return '';

  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    return envUrl;
  }

  return `http://${envUrl}`;
}

const API_BASE_URL = resolveApiBaseUrl();

function buildUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
}

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      await apiRequest(buildUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setMessage('Hemos enviado un email para restablecer tu contraseña.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo enviar el email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !email || isSubmitting;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: noctuaColors.background }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32, gap: 18 }}
    >
      <View style={{ gap: 10 }}>
        <Text selectable style={{ color: noctuaColors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>
          RESET PASSWORD
        </Text>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 32, fontWeight: '900' }}>
          Recupera tu cuenta
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, lineHeight: 22 }}>
          Escribe tu email y te enviaremos un enlace para cambiar la contraseña.
        </Text>
      </View>

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

      {message ? (
        <Text selectable style={{ color: noctuaColors.primary, lineHeight: 20 }}>
          {message}
        </Text>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        disabled={isDisabled}
        style={{
          backgroundColor: isDisabled ? noctuaColors.border : noctuaColors.primary,
          borderRadius: 999,
          paddingVertical: 14,
          alignItems: 'center',
        }}
      >
        <Text selectable style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
          {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
        </Text>
      </Pressable>

      <Link href="/(auth)/login" asChild>
        <Pressable style={{ alignItems: 'center' }}>
          <Text selectable style={{ color: noctuaColors.primary, fontWeight: '700' }}>
            Volver a login
          </Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}
