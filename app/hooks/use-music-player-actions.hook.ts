import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {constants} from "~/constants";
import {api} from "~/providers/api";

export function useMusicPlayerActions(radioId: string) {
  const skipNextMutation = useMutation({
    mutationKey: ["radios", radioId, "next"],
    onError: (error) => {
      console.error(error);
      toast.error("Error skipping to next track");
    },
    mutationFn: async () => {
      return await api.post(`/radios/${radioId}/next`);
    },
  });

  const skipPreviousMutation = useMutation({
    mutationKey: ["radios", radioId, "previous"],
    onError: (error) => {
      console.error(error);
      toast.error("Error skipping to previous track");
    },
    mutationFn: async () => {
      return await api.post(`/radios/${radioId}/previous`);
    },
  });

  const togglePlayMutation = useMutation({
    mutationKey: ["radios", radioId, "toggle-play"],
    onError: (error) => {
      console.error(error);
      toast.error("Error toggling play/pause");
    },
    mutationFn: async () => {
      return await api.post(`/radios/${radioId}/toggle-play`);
    },
  });

  return {
    skipNextMutation,
    skipPreviousMutation,
    togglePlayMutation,
  }
}