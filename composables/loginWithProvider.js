const supabase = useSupabaseClient();
export const useLoginWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
    });
    return { data, error };
};
