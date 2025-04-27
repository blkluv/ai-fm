import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {constants} from "~/constants";

export function useMusicPlayerActions(radioId: string) {
  const skipNextMutation = useMutation({
    mutationKey: ["radios", radioId, "next"],
    onError: (error) => {
      console.error(error);
      toast.error("Error skipping to next track");
    },
    mutationFn: async () => {
      return await fetch(`${constants.baseApiUrl}/radios/${radioId}/next`, {
        method: "POST",
      });
    },
  });

  const skipPreviousMutation = useMutation({
    mutationKey: ["radios", radioId, "previous"],
    onError: (error) => {
      console.error(error);
      toast.error("Error skipping to previous track");
    },
    mutationFn: async () => {
      return await fetch(`${constants.baseApiUrl}/radios/${radioId}/previous`, {
        method: "POST",
      });
    },
  });

  const togglePlayMutation = useMutation({
    mutationKey: ["radios", radioId, "toggle-play"],
    onError: (error) => {
      console.error(error);
      toast.error("Error toggling play/pause");
    },
    mutationFn: async () => {
      return await fetch(`${constants.baseApiUrl}/radios/${radioId}/toggle-play`, {
        method: "POST",
      });
    },
  });

  return {
    skipNextMutation,
    skipPreviousMutation,
    togglePlayMutation,
  }
}