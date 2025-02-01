import { serve } from "https://deno.fresh.dev/std@v1/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Call the SQL function to calculate daily returns
    const { data, error } = await supabaseClient.rpc('calculate_daily_investment_returns');
    
    if (error) {
      console.error('Error calculating daily returns:', error);
      throw error;
    }

    // Also update completed investments
    const { data: updateData, error: updateError } = await supabaseClient.rpc('update_completed_investments');
    
    if (updateError) {
      console.error('Error updating completed investments:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ message: 'Daily returns calculated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in calculate-daily-returns function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});