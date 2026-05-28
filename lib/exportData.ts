import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import { supabase } from './supabase'

export async function exportUserData(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const summitsResult = await supabase
      .from('summits')
      .select(`
        id,
        summited_at,
        notes,
        photo_url,
        created_at,
        mountain:mountains(
          id,
          name_en,
          name_bg,
          elevation_m,
          range_en,
          range_bg,
          region,
          difficulty
        )
      `)
      .eq('user_id', user.id)
      .order('summited_at', { ascending: false })

    // build CSV
    const headers = [
      'Mountain (EN)',
      'Mountain (BG)',
      'Elevation (m)',
      'Range (EN)',
      'Range (BG)',
      'Region',
      'Difficulty',
      'Summited On',
      'Notes',
      'Has Photo',
      'Logged At',
    ]

    const rows = (summitsResult.data ?? []).map(s => {
        // Supabase returns the join as an array — take the first element
        const mountain = Array.isArray(s.mountain) ? s.mountain[0] : s.mountain

        return [
            mountain?.name_en ?? '',
            mountain?.name_bg ?? '',
            mountain?.elevation_m ?? '',
            mountain?.range_en ?? '',
            mountain?.range_bg ?? '',
            mountain?.region ?? '',
            mountain?.difficulty ?? '',
            s.summited_at,
            s.notes ? `"${s.notes.replace(/"/g, '""')}"` : '',
            s.photo_url ? 'Yes' : 'No',
            s.created_at,
        ]
    })

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    const filename = `39-mountains-${new Date().toISOString().split('T')[0]}.csv`

    // create a file reference in the document directory
    const file = new FileSystem.File(
        FileSystem.Paths.document.uri + filename
    )

    // write the CSV content
    await file.create()
    await file.write(csv)

    const canShare = await Sharing.isAvailableAsync()
    if (canShare) {
    await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export your summit log',
        UTI: 'public.comma-separated-values-text',
    })
    }

    // clean up
    await file.delete()

    return true
  } catch (err) {
    console.error('Export failed:', err)
    return false
  }
}