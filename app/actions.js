'use server';

import { supabase } from '../lib/supabase';

// ---- Custom Drills ----

export async function getCustomDrills() {
  const { data, error } = await supabase
    .from('custom_drills')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createCustomDrill(drill) {
  const { data, error } = await supabase
    .from('custom_drills')
    .insert({
      name:        drill.name,
      category:    drill.category,
      duration:    drill.duration,
      players:     drill.players,
      icon:        drill.icon,
      description: drill.desc,
      theme:       drill.theme,
      rules:       drill.rules,
      how_to:      drill.howTo,
      coaching:    drill.coaching,
      teaching:    drill.teaching,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCustomDrill(id) {
  const { error } = await supabase
    .from('custom_drills')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ---- Saved Menus ----

export async function getSavedMenus() {
  const { data, error } = await supabase
    .from('saved_menus')
    .select('*')
    .order('saved_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createSavedMenu(menu) {
  const { data, error } = await supabase
    .from('saved_menus')
    .insert({
      title:      menu.title,
      total_time: menu.totalTime,
      items:      menu.items,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSavedMenu(id) {
  const { error } = await supabase
    .from('saved_menus')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
