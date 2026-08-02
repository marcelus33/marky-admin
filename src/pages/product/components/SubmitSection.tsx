import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import React from "react";
import Link from "../../../components/Link";

const options = [
  "Producto",
  "Variaciones",
  "Adicionales o extras",
  "Destacar producto",
];

interface SubmitSectionProps {
  onSectionSelect: (section: string) => void;
  // True while the create/update mutation is in flight. Disables the
  // "Publicar" button (and the split-button dropdown) so impatient repeated
  // clicks while waiting for the response don't fire multiple submissions
  // and create duplicate products.
  isSubmitting?: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  onSectionSelect,
  isSubmitting = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    option: string
  ) => {
    onSectionSelect(option);
    setOpen(false);
  };

  return (
    <Box
      sx={{
        p: 2,
        pt: 4,
        borderTop: "1px solid",
        borderColor: "grey.100",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        bottom: 0,
        left: { md: 330 },
        right: 0,
        bgcolor: "white",
        width: {
          xs: "100%",
          md: `calc(100% - 240px)`,
          lg: "74%",
        },
      }}
    >
      <Box display={"flex"} justifyContent={"center"} width={"100%"}>
        <Typography variant="body2" color="textSecondary">
          Al hacer click en "Publicar", aceptas los {/* @ts-ignore */}
          <Link target={"_blank"}>Términos y Condiciones</Link> de visualización
          de productos en Marky.
        </Typography>
      </Box>
      <Box>
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="split button"
          sx={{ display: "flex", gap: 0.5 }}
        >
          <Button
            type="submit"
            sx={{ px: 3 }}
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
          <Button
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
            disabled={isSubmitting}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option) => (
                      <MenuItem
                        key={option}
                        onClick={(event) => handleMenuItemClick(event, option)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  );
};

export default SubmitSection;
