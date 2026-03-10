'use server';

import { supabase } from '../lib/supabase';

// ---- Drills ----

export async function getDrills() {
  const { data, error } = await supabase
    .from('custom_drills')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createDrill(drill) {
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

export async function updateDrill(id, drill) {
  const { data, error } = await supabase
    .from('custom_drills')
    .update({
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
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDrill(id) {
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
