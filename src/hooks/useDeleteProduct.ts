import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../services/productService";
import { ROUTES } from "../routes/paths";
import { toast } from "react-toastify";

const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    void,
    any,
    number,
    { snapshots: Array<{ queryKey: any; previousData: any }> }
  >({
    mutationFn: (id: number) => deleteProduct(id),
    // optimistic update: snapshot cache, remove product immediately
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: ["productCategoriesWithProducts"],
      });

      // snapshot all relevant queries
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["productCategoriesWithProducts"] });
      const snapshots: Array<{ queryKey: any; previousData: any }> =
        queries.map((q) => ({
          queryKey: q.queryKey,
          previousData: q.state.data,
        }));

      // apply optimistic update
      queries.forEach((q) => {
        const current = q.state.data as any;
        if (!current) return;
        const updated: any = { ...current };

        if (Array.isArray(updated.results)) {
          updated.results = updated.results.map((cat: any) => {
            if (!Array.isArray(cat.products)) return cat;
            const filtered = cat.products.filter(
              (p: any) => Number(p.id) !== Number(id),
            );
            return { ...cat, products: filtered };
          });
        }

        if (typeof updated.products_count === "number") {
          updated.products_count = Math.max(
            0,
            (updated.products_count || 0) - 1,
          );
        }

        queryClient.setQueryData(q.queryKey, updated);
      });

      return { snapshots };
    },
    onError: (error, id, context: any) => {
      // rollback using snapshots
      try {
        if (context?.snapshots) {
          context.snapshots.forEach((s: any) => {
            queryClient.setQueryData(s.queryKey, s.previousData);
          });
        }
      } catch (e) {
        console.error("Error rolling back optimistic update:", e);
      }

      toast.error("Error al eliminar el producto");
      console.error("Error deleting product:", error);
    },
    onSuccess: () => {
      toast.success("El producto fue eliminado con exito");
      navigate(ROUTES.HOME);
    },
  });
};

export default useDeleteProduct;
