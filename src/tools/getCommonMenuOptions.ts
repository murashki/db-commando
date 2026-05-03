import type { MenuItem } from '../@types/MenuItem.ts';
import type { MenuOption } from '../@types/MenuOption.ts';

export function getCommonMenuOptions<
  TMenuItem extends MenuItem = MenuItem,
>(options: TMenuItem[]): MenuOption<TMenuItem>[] {
  return options.map((option) => {
    return {
      label: option.label,
      value: option,
    };
  });
}
