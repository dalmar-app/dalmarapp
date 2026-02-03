import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nfhzzympuvilshvxsnkd.supabase.co'
const supabaseKey = 'sb_publishable_ssWbjSHfhXpm5orvSLyKIw_SNPdJeZT'

export const supabase = createClient(supabaseUrl, supabaseKey)
