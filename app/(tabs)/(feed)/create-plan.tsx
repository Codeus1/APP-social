import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function CreatePlanScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  return (
    <ScreenContainer>
      <View style={styles.headerBlock}>
        <Text selectable style={styles.heading}>
          Let&apos;s make a plan
        </Text>
        <Text selectable style={styles.subheading}>
          Crea el mood para esta noche con estilo Noctua.
        </Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text selectable style={styles.fieldLabel}>
          Título
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Tapas & Sangría"
          placeholderTextColor={noctuaColors.textMuted}
          style={styles.textInput}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text selectable style={styles.fieldLabel}>
          Ubicación
        </Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Ej: El Born, Barcelona"
          placeholderTextColor={noctuaColors.textMuted}
          style={styles.textInput}
        />
      </View>

      <Pressable
        onPress={() =>
          Alert.alert('Plan publicado', `${title || 'Nuevo plan'} en ${location || 'ubicación pendiente'}`)
        }
        style={styles.submitButton}
      >
        <Text selectable style={styles.submitButtonText}>
          Publicar plan
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    gap: 6,
  },
  heading: {
    color: noctuaColors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subheading: {
    color: noctuaColors.textMuted,
    fontSize: 14,
  },
  fieldGroup: {
    gap: 10,
  },
  fieldLabel: {
    color: noctuaColors.text,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    color: noctuaColors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  submitButton: {
    backgroundColor: noctuaColors.primary,
    borderRadius: noctuaRadii.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
