import { useToast } from "vue-toastification";
export const useLoginWithProvider = async (provider) => {
    const toast = useToast();
    try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });
    } catch (error) {
        toast.error(error.error_description || error.message);
    }
    return { data, error };
};
