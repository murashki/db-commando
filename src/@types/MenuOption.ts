import type { MenuItem } from './MenuItem.ts';

export type MenuOption<
  TMenuItem extends MenuItem = MenuItem,
> = {
  label: string;
  value: TMenuItem;
}
