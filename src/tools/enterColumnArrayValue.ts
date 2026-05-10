import c from 'chalk';
import { select } from 'proprompt';
import { text } from 'proprompt';
import type { DbColumnScalarValue } from '../@types/DbColumnScalarValue.ts';
import type { EditConfigOption } from '../@types/EditConfigOption.ts';
import type { EditControlType } from '../@types/EditControlType.ts';
import type { EnterColumnArrayValueOpts } from './@types/EnterColumnArrayValueOpts.ts';
import type { EnterColumnValueContext } from './@types/EnterColumnValueContext.ts';
import { acceptsNullInput } from './acceptsNullInput';
import { enterColumnScalarValue } from './enterColumnScalarValue';
import { isNow } from './isNow.ts';

export async function enterColumnArrayValue(opts: EnterColumnArrayValueOpts): Promise<null | (null | DbColumnScalarValue)[]> {
  const arrayLength = await enterArrayLength(opts.context, opts.columnName, opts.nullable, opts.defaultValue, opts.preparedLabelOut);

  if (arrayLength == null) {
    return null;
  }
  else {
    const values: (null | DbColumnScalarValue)[] = [];
    for (let i = 0; i < arrayLength; i ++ ) {
      const defaultValue = ((opts.defaultValue ?? []) as any[])[i] ?? null;

      const value = await enterColumnScalarValue({
        ...opts,
        arrayMemberIndex: i,
        defaultValue,
        nullable: true,
      });

      values.push(value);
    }
    return values;
  }
}

async function enterArrayLength(context: EnterColumnValueContext, columnName: undefined | string, nullable: boolean, defaultValue: null | (null | DbColumnScalarValue)[], preparedLabelOut: string): Promise<null | number> {
  const message = context === `value`
    ? `Enter array length for ${c.italic(columnName)} column ${c.gray(`(${c.italic(preparedLabelOut)})`)}`
    : `Enter default value array length`;
  const initialValue = acceptsNullInput(context, nullable, defaultValue) ? null : String((defaultValue as any[]).length);

  const hints = [`Empty string evaluates to 0`];
  if (nullable) {
    hints.push(`${c.italic(`null`)} evaluates to ${c.italic(`NULL`)} column value`);
  }

  const arrayLengthTextResult = await text({
    hints,
    initialValue,
    message,
    nullable,
    throwOnEsc: true,
  });
  return arrayLengthTextResult.value == null ? null : Number(arrayLengthTextResult.value);
}
