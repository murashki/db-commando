import c from 'chalk';
import { select } from 'proprompt';
import { text } from 'proprompt';
import type { DbColumnScalarValue } from '../@types/DbColumnScalarValue.ts';
import type { DbColumnValue } from '../@types/DbColumnValue.ts';
import type { EnterColumnValueProps } from './@types/EnterColumnValueProps.ts';
import { isNow } from './isNow.ts';

export async function enterColumnValue(props: EnterColumnValueProps): Promise<DbColumnValue> {
  if (props.columnType.isArray) {
    const arrayLength = await enterArrayLength(props);

    if (arrayLength == null) {
      return null;
    }
    else {
      const values: DbColumnScalarValue[] = [];
      for (let i = 0; i < arrayLength; i ++ ) {
        const memberType = props.columnType.memberType!;
        const defaultValue = ((props.defaultValue ?? []) as any[])[i] ?? null;

        values.push(await enterColumnScalarValue({
          ...props,
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
    return await enterColumnScalarValue(props);
  }
}

async function enterColumnScalarValue(props: EnterColumnValueProps): Promise<DbColumnScalarValue> {
  let message;
  if (props.arrayMemberIndex == null) {
    message = props.context === `value`
      ? `Enter a value for \`${props.columnName}\` column ${c.gray(`(${props.preparedLabelOut})`)}`
      : `Enter default value`;
  }
  else {
    message = `Enter a value for element #${props.arrayMemberIndex}`;
  }

  switch (props.columnType.editConfig?.controlType) {
    case `bigint`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to 0`],
        initialValue: isNull(props) ? null : props.defaultValue == null ? `0` : String(props.defaultValue),
        message,
        nullable: props.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : BigInt(defaultValueTextResult.value);
    }
    case `boolean`: {
      const defaultValueSelectResult = await select({
        initialValue: isNull(props) ? null : props.defaultValue == null ? true : Boolean(props.defaultValue),
        message,
        nullable: props.nullable,
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
        initialValue: isNull(props) ? null : props.defaultValue == null ? `` : isNow(props.defaultValue) ? `` : props.defaultValue instanceof Date ? props.defaultValue.toISOString() : String(props.defaultValue),
        message,
        nullable: props.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : (defaultValueTextResult.value || { type: `NOW` });
    }
    case `number`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to 0`],
        initialValue: isNull(props) ? null : props.defaultValue == null ? `0` : String(props.defaultValue),
        message,
        nullable: props.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : Number(defaultValueTextResult.value);
    }
    case `text`: {
      const defaultValueTextResult = await text({
        initialValue: isNull(props) ? null : props.defaultValue == null ? `` : String(props.defaultValue),
        message,
        nullable: props.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value;
    }
    case `time`: {
      const defaultValueTextResult = await text({
        hints: [`Empty string evaluates to \`NOW()\``],
        initialValue: isNull(props) ? null : props.defaultValue == null ? `` : isNow(props.defaultValue) ? `` : String(props.defaultValue),
        message,
        nullable: props.nullable,
        throwOnEsc: true,
      });
      return defaultValueTextResult.value == null ? null : (defaultValueTextResult.value || { type: `NOW` });
    }
    default: {
      throw new Error(`This shouldn't have happened`);
    }
  }
}

async function enterArrayLength(props: EnterColumnValueProps): Promise<null | number> {
  const message = props.context === `value`
    ? `Enter array length for \`${props.columnName}\` column ${c.gray(`(${props.preparedLabelOut})`)}`
    : `Enter default value array length`;
  const initialValue = isNull(props) ? null : String((props.defaultValue as any[]).length);

  const hints = [`Empty string evaluates to 0`];
  if (props.nullable) {
    hints.push(`\`null\` evaluates to \`NULL\` column value`);
  }

  const arrayLengthTextResult = await text({
    hints,
    initialValue,
    message,
    nullable: props.nullable,
    throwOnEsc: true,
  });
  return arrayLengthTextResult.value == null ? null : Number(arrayLengthTextResult.value);
}

function isNull(props: EnterColumnValueProps): boolean {
  return props.context === `default-value`
    ? props.nullable && props.defaultValue == null
    : props.defaultValue == null;
}
