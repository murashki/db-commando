import type { DbTableStringReplaceMapRender } from './@types/DbTableStringReplaceMapRender.ts';
import { __STRING_REPLACE_MAP_RENDER_SYMBOL__ } from './constants.ts';

export const isDbTableStringReplaceMapRender = (render: any): render is DbTableStringReplaceMapRender => {
  return render && render.type === __STRING_REPLACE_MAP_RENDER_SYMBOL__;
};
