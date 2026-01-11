import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mspcxtdfffzpbrzgcxlf.supabase.co';
const supabaseKey = 'sb_publishable_Nw-39x9NLUhaey1mKqL9xQ_hQr46lR3';

export const supabase = createClient(supabaseUrl, supabaseKey);
