import { SvgIconComponent } from "@mui/icons-material";
import WifiRounded from "@mui/icons-material/WifiRounded";
import LocalParkingRounded from "@mui/icons-material/LocalParkingRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import LaptopRounded from "@mui/icons-material/LaptopRounded";
import DeliveryDiningRounded from "@mui/icons-material/DeliveryDiningRounded";
import DirectionsCarFilledRounded from "@mui/icons-material/DirectionsCarFilledRounded";

// Atributos sembrados en el backend (business/migrations/0005_populate_branch_attributes.py)
// mapeados a los íconos más cercanos de @mui/icons-material.
export const BUSINESS_ATTRIBUTE_ICON_MAP: Record<string, SvgIconComponent> = {
  Wifi: WifiRounded,
  Estacionamiento: LocalParkingRounded,
  "Pet friendly": PetsRounded,
  Coworking: LaptopRounded,
  Delivery: DeliveryDiningRounded,
  "Valet Parking": DirectionsCarFilledRounded,
};

export default BUSINESS_ATTRIBUTE_ICON_MAP;
