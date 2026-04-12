import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://odkjzaijyrpagquxeovy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ka2p6YWlqeXJwYWdxdXhlb3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4ODk4OTIsImV4cCI6MjA5MTQ2NTg5Mn0.OTUQndL5nmd5yppY2a-P1V0AGveTdHX1ottU0Ggfu38'
)

window.supabase = supabase