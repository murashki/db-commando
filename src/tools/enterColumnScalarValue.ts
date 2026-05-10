import c from 'chalk';
import { select } from 'proprompt';
import { text } from 'proprompt';
import type { DbColumnScalarValue } from '../@types/DbColumnScalarValue.ts';
import type { DbColumnValue } from '../@types/DbColumnValue.ts';
import type { EditConfigOption } from '../@types/EditConfigOption.ts';
import type { EditControlType } from '../@types/EditControlType.ts';
import type { EnterColumnValueContext } from './@types/EnterColumnValueContext.ts';
import type { EnterColumnScalarValueOpts } from './@types/EnterColumnScalarValueOpts.ts';
import { acceptsNullInput } from './acceptsNullInput';
import { isNow } from './isNow.ts';

export async function enterColumnScalarValue(opts: EnterColumnScalarValueOpts): Promise<null | DbColumnScalarValue> {
  let message;
  if (opts.arrayMemberIndex == null) {
    message = opts.context === `value`
      ? `Enter a value for ${c.italic(opts.columnName)} column ${c.gray(`(${c.italic(opts.preparedLabelOut)})`)}`
      : `Enter default value`;
  }
  else {
    message = `Enter a value for element #${opts.arrayMemberIndex}`;
  }

  const context = opts.context;
  const nullable = opts.nullable;
  let controlType: undefined | EditControlType;
  let defaultValue: null | DbColumnScalarValue;

  if (Array.isArray(opts.columnType.editConfig)) {
    const options = opts.columnType.editConfig.map((editConfig) => {
      return {
        label: editConfig.label,
        value: { defaultValue: editConfig.defaultValue, controlType: editConfig.controlType },
      };
    })
    const { value: editConfig } = await select({
      message: `Provide value as`,
      options,
      throwOnEsc: true,
    });
    controlType = editConfig.controlType;
    defaultValue = editConfig.defaultValue;
  }
  else {
    controlType = opts.columnType.editConfig!.controlType;
    defaultValue = opts.columnType.editConfig!.defaultValue;
  }

  if ( ! controlType) {
    return defaultValue;
  }

  switch (controlType) {
    case `bigint`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to 0`],
        initialValue: acceptsNullInput(context, nullable, defaultValue) ? null : defaultValue == null ? `0` : String(defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : BigInt(defaultValueTextResult.value);
    }
    case `boolean`: {
      const defaultValueSelectResult = await select({
        initialValue: acceptsNullInput(context, nullable, defaultValue) ? null : defaultValue == null ? true : Boolean(defaultValue),
        message,
        nullable: opts.nullable,
        options: [
          { label: c.italic(`TRUE`), value: true },
          { label: c.italic(`FALSE`), value: false },
        ],
        throwOnEsc: true,
      });
      return defaultValueSelectResult.value;
    }
    case `date`:
    case `datetime`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to \`NOW()\``],
        initialValue: acceptsNullInput(context, nullable, defaultValue) ? null : defaultValue == null ? `` : isNow(defaultValue) ? `` : defaultValue instanceof Date ? defaultValue.toISOString() : String(defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : (defaultValueTextResult.value || { type: `NOW` });
    }
    case `number`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to 0`],
        initialValue: acceptsNullInput(context, nullable, defaultValue) ? null : defaultValue == null ? `0` : String(defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : Number(defaultValueTextResult.value);
    }
    case `text`: {
      const defaultValueTextResult = await text({
        initialValue: acceptsNullInput(context, nullable, defaultValue) ? null : defaultValue == null ? `` : String(defaultValue),
        message,
        nullable: opts.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value;
    }
    case `time`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to \`NOW()\``],
        initialValue: acceptsNullInput(context, nullable, defaultValue) ? null : defaultValue == null ? `` : isNow(defaultValue) ? `` : String(defaultValue),
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
