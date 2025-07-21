import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

// Shows a loading toast and returns its ID
export const showLoadingToast = (message) => {
    return toast.loading(message || "Loading...");
};

// Shows a success toast. If an ID is provided, it updates the existing toast.
export const showSuccessToast = (message, id) => {
    toast.success(message || "Success!", { id });
};

// Your error toast function remains useful
export const showErrorToast = (error) => {
    const message = error?.response?.data?.message || error?.message || "An error occurred.";
    toast.error("Error", {
        description: message,
        icon: <CircleAlert className="h-5 w-5" />,
    });
};