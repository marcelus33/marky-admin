// src/assets/icons/category/icons.ts
import { ReactComponent as AsadoIcon } from "./asado.svg";
import { ReactComponent as BagetteIcon } from "./bagette.svg";
import { ReactComponent as BebidaIcon } from "./bebida.svg";
import { ReactComponent as CafeIcon } from "./cafe.svg";
import { ReactComponent as CaldoIcon } from "./caldo.svg";
import { ReactComponent as CervezaIcon } from "./cerveza.svg";
import { ReactComponent as CocinaIcon } from "./cocina.svg";
import { ReactComponent as CoctelesIcon } from "./cocteles.svg";
import { ReactComponent as CombosIcon } from "./combos.svg";
// For file names with dashes, use camelCase variable names:
import { ReactComponent as ComodaRapidaIcon } from "./comoda-rapida.svg";
import { ReactComponent as CroissantIcon } from "./croissant.svg";
import { ReactComponent as GalletaIcon } from "./galleta.svg";
import { ReactComponent as HeladoIcon } from "./helado.svg";
import { ReactComponent as HotdogIcon } from "./hotdog.svg";
import { ReactComponent as HuevoIcon } from "./huevo.svg";
import { ReactComponent as ManzanaIcon } from "./manzana.svg";
import { ReactComponent as PanIcon } from "./pan.svg";
import { ReactComponent as PescadoIcon } from "./pescado.svg";
import { ReactComponent as PizzaIcon } from "./pizza.svg";
import { ReactComponent as PolloIcon } from "./pollo.svg";
import { ReactComponent as QuesoIcon } from "./queso.svg";
import { ReactComponent as SushiIcon } from "./sushi.svg";
import { ReactComponent as TeIcon } from "./te.svg";
import { ReactComponent as TortaIcon } from "./torta.svg";

export const categoryIcons: {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  asado: AsadoIcon,
  bagette: BagetteIcon,
  bebida: BebidaIcon,
  cafe: CafeIcon,
  caldo: CaldoIcon,
  cerveza: CervezaIcon,
  cocina: CocinaIcon,
  cocteles: CoctelesIcon,
  combos: CombosIcon,
  comodaRapida: ComodaRapidaIcon,
  croissant: CroissantIcon,
  galleta: GalletaIcon,
  helado: HeladoIcon,
  hotdog: HotdogIcon,
  huevo: HuevoIcon,
  manzana: ManzanaIcon,
  pan: PanIcon,
  pescado: PescadoIcon,
  pizza: PizzaIcon,
  pollo: PolloIcon,
  queso: QuesoIcon,
  sushi: SushiIcon,
  te: TeIcon,
  torta: TortaIcon,
};

export default categoryIcons;
