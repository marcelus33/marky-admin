import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductById } from "../services/productService";
import { buildDuplicatedProduct } from "../utils/buildDuplicatedProduct";
import { ROUTES } from "../routes/paths";

// Fetches the full product (the Product Grid only holds a lightweight
// ProductGridItem), builds a duplicate via the shared helper, and navigates
// to the create form with it prefilled — mirrors the "Duplicar producto"
// flow already available from the product edit form.
const useDuplicateProduct = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: number) => {
      const product = await getProductById(id);
      return buildDuplicatedProduct(product);
    },
    onSuccess: (duplicatedProduct) => {
      navigate(ROUTES.PRODUCT_CREATE, { state: { duplicatedProduct } });
    },
    onError: (error) => {
      toast.error("No se pudo duplicar el producto");
      console.error("Error duplicating product:", error);
    },
  });
};

export default useDuplicateProduct;
