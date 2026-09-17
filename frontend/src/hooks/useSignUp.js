import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";

const useSignUp = () => {

    const queryClient = useQueryClient();
    const { mutate: signupMutation, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Signed up successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    return { signupMutation, isPending, error };
}

export default useSignUp;