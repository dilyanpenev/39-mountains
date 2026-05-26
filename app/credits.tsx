import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { PHOTOCREDITS, PhotoCredit } from '../constants/photoCredits'
import { colors, typography, spacing } from '../constants/theme'

export default function PhotoCreditsScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const renderItem = ({ item, index }: { item: PhotoCredit; index: number }) => {
    const isFirst = index === 0
    const isLast = index === PHOTOCREDITS.length - 1

    return (
      <TouchableOpacity
        style={[
          styles.row,
          isFirst && styles.rowFirst,
          isLast && styles.rowLast,
          !isLast && styles.rowDivider,
        ]}
        onPress={() => item.url && Linking.openURL(item.url)}
        activeOpacity={item.url ? 0.7 : 1}
        disabled={!item.url}
      >
        <View style={styles.rowContent}>
          <Text style={styles.mountainName}>{item.mountainName}</Text>
          <Text style={styles.author}>
            {t('attributions.by')} {item.author}
          </Text>
        </View>
        {item.url && (
          <Ionicons
            name="open-outline"
            size={16}
            color={colors.text.secondary}
          />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('attributions.title')}</Text>
      </View>

      <FlatList
        data={PHOTOCREDITS}
        keyExtractor={item => item.mountainName}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.intro}>{t('attributions.intro')}</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  intro: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#DEE2E6',
  },
  rowFirst: {
    borderTopWidth: 0.5,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  rowLast: {
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  rowDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F3F5',
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  mountainName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  author: {
    ...typography.caption,
    color: colors.text.secondary,
  },
})