const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // use service role for admin server ops
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
