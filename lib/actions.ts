"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { questionInputFromFormData } from "@/lib/form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createQuestion(formData: FormData) {
  const input = questionInputFromFormData(formData);
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("questions").insert(input);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/questions");
  redirect("/questions");
}

export async function updateQuestion(id: string, formData: FormData) {
  const input = questionInputFromFormData(formData);
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("questions").update(input).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/questions");
  revalidatePath(`/questions/${id}/edit`);
  revalidatePath("/quiz");
  revalidatePath("/wrong-note");
  redirect("/questions");
}

export async function deleteQuestion(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("questions").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/questions");
  revalidatePath("/quiz");
  revalidatePath("/wrong-note");
}

export async function setQuestionWrong(id: string, isWrong: boolean) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("questions").update({ is_wrong: isWrong }).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/questions");
  revalidatePath("/quiz");
  revalidatePath("/wrong-note");
}
