import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

interface ParagraphProps {
  variant?: "lead" | "tiny";
}

const Paragraph = styled(Typography)<ParagraphProps>(({ theme, variant }) => ({
  fontSize: variant === "lead" ? "14px" : variant === "tiny" ? "12px" : "14px",
  fontWeight: variant === "lead" ? 400 : 300,
  lineHeight: "22px",
  letterSpacing: "0.1px",
}));

export default Paragraph;
