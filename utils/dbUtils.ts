import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient

function getDBClient(): SupabaseClient {
    if (!supabase) {
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) throw Error('Need SUPABASE_URL and SUPABASE_KEY!')
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    }
    return supabase
}

export default getDBClient