import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function CreatePlanScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  return (
    <ScreenContainer style={{ flex: 1, padding: 16, gap: 16, backgroundColor: noctuaColors.background }}>
      <View style={{ gap: 6 }}>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 28, fontWeight: '800' }}>
          Let&apos;s make a plan
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, fontSize: 14 }}>
          Crea el mood para esta noche con estilo Noctua.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={{ color: noctuaColors.text, fontWeight: '700' }}>
          Título
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Tapas & Sangría"
          placeholderTextColor={noctuaColors.textMuted}
          style={{
            backgroundColor: noctuaColors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: noctuaColors.border,
            color: noctuaColors.text,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={{ color: noctuaColors.text, fontWeight: '700' }}>
          Ubicación
        </Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Ej: El Born, Barcelona"
          placeholderTextColor={noctuaColors.textMuted}
          style={{
            backgroundColor: noctuaColors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: noctuaColors.border,
            color: noctuaColors.text,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />
      </View>

      <Pressable
        onPress={() => Alert.alert('Plan publicado', `${title || 'Nuevo plan'} en ${location || 'ubicación pendiente'}`)}
        style={{
          backgroundColor: noctuaColors.primary,
          borderRadius: 999,
          paddingVertical: 14,
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <Text selectable style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
          Publicar plan
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

