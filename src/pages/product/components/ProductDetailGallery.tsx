import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import defaultImage from "../../../assets/images/default-product.png";
import { Product } from "../../../types/product";
import { VideoThumbnail } from "./VideoThumbnail";

const ProductDetailGallery: React.FC<{ product: Product }> = ({ product }) => {
  const media = product.media?.filter((m) => !m._delete) ?? [];
  const [mainIndex, setMainIndex] = React.useState(0);
  const mainMedia = media.length > 0 ? media[mainIndex] : null;

  // Normalize url or file to string safely
  const resolveUrl = (file: any) => {
    try {
      if (!file) return "";
      if (typeof file === "string") return file;
      if (file instanceof File) return URL.createObjectURL(file);
      // fallback
      return String(file);
    } catch (e) {
      return "";
    }
  };

  const theme = useTheme();
  // Prepare formatted discount string: hide ".00" when discount is an integer
  const _rawDiscount = Number(product.discountPercentage ?? 0);
  const numericDiscount = Number.isFinite(_rawDiscount) ? _rawDiscount : 0;
  const formattedDiscount = Number.isInteger(numericDiscount)
    ? numericDiscount.toString()
    : parseFloat(numericDiscount.toFixed(2)).toString();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            {media.map((item: any, idx: number) => (
              <Box
                key={item.id || idx}
                onClick={() => setMainIndex(idx)}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 1,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: idx === mainIndex ? "2px solid" : "1px solid",
                  borderColor: idx === mainIndex ? "primary.main" : "grey.300",
                }}
              >
                {item.media_type === "video" ? (
                  <VideoThumbnail
                    url={resolveUrl(item.file)}
                    width={64}
                    height={64}
                  />
                ) : (
                  <img
                    src={resolveUrl(item.file)}
                    alt={item.name || "thumb"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 2,
              padding: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 480,
              position: "relative",
            }}
          >
            {/* Discount badge overlay if product has discount */}
            {numericDiscount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  top: 16,
                  bgcolor: theme.palette.error.main,
                  color: theme.palette.common.white,
                  p: 2,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                }}
              >
                <Typography color="white" fontWeight={500}>
                  -{formattedDiscount}%
                </Typography>
              </Box>
            )}

            {mainMedia?.media_type === "video" ? (
              <video
                src={resolveUrl(mainMedia.file)}
                controls
                style={{
                  maxWidth: "100%",
                  maxHeight: 420,
                  borderRadius: 10,
                }}
              />
            ) : (
              <img
                src={resolveUrl(mainMedia ? mainMedia.file : defaultImage)}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 420,
                  objectFit: "contain",
                  borderRadius: 10,
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetailGallery;
