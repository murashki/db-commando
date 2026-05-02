import type { DbTableStringReplaceRender } from './@types/DbTableStringReplaceRender.ts';
import { __STRING_REPLACE_RENDER_SYMBOL__ } from './constants.ts';

export const isDbTableStringReplaceRender = (render: any): render is DbTableStringReplaceRender => {
  return render && render.type === __STRING_REPLACE_RENDER_SYMBOL__;
};
