import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { user_id, amount } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { error } = await supabaseClient
      .from('profiles')
      .update({ 
        balance: supabaseClient.rpc('increment_balance', { 
          row_id: user_id,
          increment_amount: amount 
        })
      })
      .eq('id', user_id)

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Balance updated successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})