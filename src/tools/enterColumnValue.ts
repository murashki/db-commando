import c from 'chalk';
import { select } from 'proprompt';
import { text } from 'proprompt';
import type { DbColumnScalarValue } from '../@types/DbColumnScalarValue.ts';
import type { DbColumnValue } from '../@types/DbColumnValue.ts';
import type { EnterColumnValueOpts } from './@types/EnterColumnValueOpts.ts';
import { isNow } from './isNow.ts';

export async function enterColumnValue(opts: EnterColumnValueOpts): Promise<DbColumnValue> {
  if (opts.columnType.isArray) {
    const arrayLength = await enterArrayLength(opts);

    if (arrayLength == null) {
      return null;
    }
    else {
      const values: DbColumnScalarValue[] = [];
      for (let i = 0; i < arrayLength; i ++ ) {
        const memberType = opts.columnType.memberType!;
        const defaultValue = ((opts.defaultValue ?? []) as any[])[i] ?? null;

        values.push(await enterColumnScalarValue({
          ...opts,
          arrayMemberIndex: i,
          columnType: memberType,
          defaultValue,
          nullable: true,
        }));
      }
      return values;
    }
  }
  else {
    return await enterColumnScalarValue(opts);
  }
}

async function enterColumnScalarValue(opts: EnterColumnValueOpts): Promise<DbColumnScalarValue> {
  let message;
  if (opts.arrayMemberIndex == null) {
    message = opts.context === `value`
      ? `Enter a value for \`${opts.columnName}\` column ${c.gray(`(${opts.preparedLabelOut})`)}`
      : `Enter default value`;
  }
  else {
    message = `Enter a value for element #${opts.arrayMemberIndex}`;
  }

  switch (opts.columnType.editConfig?.controlType) {
    case `bigint`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to 0`],
        initialValue: isNull(opts) ? null : opts.defaultValue == null ? `0` : String(opts.defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : BigInt(defaultValueTextResult.value);
    }
    case `boolean`: {
      const defaultValueSelectResult = await select({
        initialValue: isNull(opts) ? null : opts.defaultValue == null ? true : Boolean(opts.defaultValue),
        message,
        nullable: opts.nullable,
        options: [
          { label: `TRUE`, value: true },
          { label: `FALSE`, value: false },
        ],
        throwOnEsc: true,
      });
      return defaultValueSelectResult.value;
    }
    case `date`:
    case `datetime`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to \`NOW()\``],
        initialValue: isNull(opts) ? null : opts.defaultValue == null ? `` : isNow(opts.defaultValue) ? `` : opts.defaultValue instanceof Date ? opts.defaultValue.toISOString() : String(opts.defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : (defaultValueTextResult.value || { type: `NOW` });
    }
    case `number`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to 0`],
        initialValue: isNull(opts) ? null : opts.defaultValue == null ? `0` : String(opts.defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : Number(defaultValueTextResult.value);
    }
    case `text`: {
      const defaultValueTextResult = await text({
        initialValue: isNull(opts) ? null : opts.defaultValue == null ? `` : String(opts.defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value;
    }
    case `time`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to \`NOW()\``],
        initialValue: isNull(opts) ? null : opts.defaultValue == null ? `` : isNow(opts.defaultValue) ? `` : String(opts.defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : (defaultValueTextResult.value || { type: `NOW` });
    }
    default: {
      throw new Error(`This shouldn't have happened`);
    }
  }
}

async function enterArrayLength(opts: EnterColumnValueOpts): Promise<null | number> {
  const message = opts.context === `value`
    ? `Enter array length for \`${opts.columnName}\` column ${c.gray(`(${opts.preparedLabelOut})`)}`
    : `Enter default value array length`;
  const initialValue = isNull(opts) ? null : String((opts.defaultValue as any[]).length);

  const hints = [`Empty string evaluates to 0`];
  if (opts.nullable) {
    hints.push(`\`null\` evaluates to \`NULL\` column value`);
  }

  const arrayLengthTextResult = await text({
    hints,
    initialValue,
    message,
    nullable: opts.nullable,
    throwOnEsc: true,
  });
  return arrayLengthTextResult.value == null ? null : Number(arrayLengthTextResult.value);
}

function isNull(opts: EnterColumnValueOpts): boolean {
  return opts.context === `default-value`
    ? opts.nullable && opts.defaultValue == null
    : opts.defaultValue == null;
}
