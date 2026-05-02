import c from 'chalk';
import pg from 'pg';
import { exception } from 'proprompt';
import { message } from 'proprompt';
import { select } from 'proprompt';
import { TerminatedByEsc } from 'proprompt';
import { text } from 'proprompt';
import type { ColumnType } from '../../../../@types/ColumnType.ts';
import type { DbColumnValue } from '../../../../@types/DbColumnValue.ts';
import type { DbCommandoContext } from '../../../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { columnTypes } from '../../../../tools/columnTypes.ts';
import { confirmDbQuery } from '../../../../tools/confirmDbQuery.ts';
import { enterColumnValue } from '../../../../tools/enterColumnValue.ts';
import { getArraySafeColumnType } from '../../../../tools/getArraySafeColumnType.ts';
import { printDbTableSchema } from '../../../../tools/printDbTableSchema.ts';
import { querifyValue } from '../../../../tools/querifyValue.ts';
import { updateExecutedDbQueryLogFile } from '../../../../tools/updateExecutedDbQueryLogFile.ts';

// TODO SERIAL and similar types cannot be created yet
// TODO For TIMESTAMP and TIMESTAMPTZ the default datetime precision is 6.
//   Specifying TIMESTAMP(7) will still produce TIMESTAMP(6) since 6 is the max.
//   Both points should be reflected in the field hint.

export async function handleAddColumnModule(context: DbCommandoContext, table: DbTable): Promise<void> {
  type SpecResult = {
    key: string;
    value: string;
  };

  try {
    const { value: columnName } = await text({
      message: `Enter column name`,
      throwOnEsc: true,
    });

    const columnType = await enterColumnType();
    const arraySafeColumnType = getArraySafeColumnType(columnType);

    const specResults: SpecResult[] = [];
    if (arraySafeColumnType.spec) {
      for (const spec of arraySafeColumnType.spec) {
        const skip = spec.key === `scale-typmods` && ! specResults.find((spec) => spec.key === `precision-typmods`);

        if ( ! skip) {
          const textResult = await text({
            hints: spec.hints,
            message: spec.prompt,
            throwOnEsc: true,
          });

          if (textResult.value) {
            specResults.push({ key: spec.key, value: textResult.value });
          }
        }
      }
    }

    const typeMods = specResults.map((spec) => Number(spec.value));
    const typeModsPart = typeMods.length > 0 ? `(${typeMods.join(`, `)})` : ``;

    let nullable = false;
    if (columnType.nullability) {
      const nullableSelectResult = await select({
        message: `Specify nullability`,
        options: [
          { label: `NULL ${c.gray(`Value is optional (PG default)`)}`, value: true },
          { label: `NOT NULL ${c.gray(`Value is required`)}`, value: false },
        ],
        throwOnEsc: true,
      });
      nullable = nullableSelectResult.value;
    }

    const preparedLabelOut = getDataTypeAttributes({
      columnType,
      dataDefinitionProp: `labelOut`,
      typeModsPart,
    });
    const preparedPgTypeIn = getDataTypeAttributes({
      columnType,
      dataDefinitionProp: `pgTypeIn`,
      typeModsPart,
    });

    let defaultValue: undefined | DbColumnValue;
    if (columnType.editConfig?.controlType) {
      defaultValue = await enterColumnValue({
        columnType,
        context: `default-value`,
        defaultValue: columnType.isArray ? [] : columnType.editConfig.defaultValue,
        nullable,
        preparedLabelOut,
      });
    }
    else if (columnType.editConfig?.defaultValue) {
      defaultValue = columnType.editConfig.defaultValue;
    }

    const query = buildQuery({
      columnName,
      columnType,
      defaultValue,
      nullable,
      preparedPgTypeIn,
      tableName: table.name,
    });

    const queryConfirmed = await confirmDbQuery(query, context);

    if (queryConfirmed) {
      try {
        await context.dbClient.query(query);
      }
      catch (error) {
        await updateExecutedDbQueryLogFile(context, {
          query,
          status: `error`,
        });
        await exception(error, { message: `There was a problem during the query execution:` });

        return;
      }

      await message(`Successfully executed`, { as: `success` });
      await updateExecutedDbQueryLogFile(context, {
        query,
        status: `success`,
      });
      await printDbTableSchema(context, table.name);

      return;
    }
  }
  catch (error) {
    if (error instanceof TerminatedByEsc) {
      return;
    }
    else {
      throw error;
    }
  }
}

async function enterColumnType(isArrayMemberType?: boolean): Promise<ColumnType> {
  const message = isArrayMemberType ? `Select array member data type` : `Select column data type`;
  const { value: columnType } = await select({
    contentOverflow: `word-wrap`,
    message,
    options: columnTypes
      .filter((columnType) => {
        return isArrayMemberType ? columnType.arrayEligible : true;
      })
      .map((columnType) => {
        const label = columnType.desc ? `${columnType.labelIn} ${c.gray(columnType.desc)}` : columnType.labelIn;
        return {
          label: label,
          value: columnType,
        };
      }),
    throwOnEsc: true,
  });

  if (columnType.isArray) {
    const memberType = await enterColumnType(true);

    return {
      ...columnType,
      memberType,
    };
  }
  else {
    return columnType;
  }
}

type BuildQueryParams = {
  columnName: string;
  columnType: ColumnType;
  defaultValue?: DbColumnValue;
  nullable: boolean;
  preparedPgTypeIn: string;
  tableName: string;
};

function buildQuery(params: BuildQueryParams): string {
  const nullPart = params.nullable ? `NULL` : `NOT NULL`;

  let defaultValuePart: undefined | string;
  if (params.defaultValue !== undefined) {
    defaultValuePart = querifyValue(params.defaultValue, params.preparedPgTypeIn);
    defaultValuePart = defaultValuePart ? `DEFAULT ${defaultValuePart}` : ``;
  }

  return `
    ALTER TABLE "public".${pg.escapeIdentifier(params.tableName)}
    ADD COLUMN ${[pg.escapeIdentifier(params.columnName), params.preparedPgTypeIn, nullPart, defaultValuePart].filter(Boolean).join(` `)};
  `;
}

type GetPreparedDataDefinitionParams = {
  columnType: ColumnType;
  dataDefinitionProp: `pgTypeIn` | `labelOut`;
  typeModsPart: string;
};

function getDataTypeAttributes(params: GetPreparedDataDefinitionParams): string {
  if (params.columnType.isArray) {
    const dataTypeAttributes = getDataTypeAttributes({
      columnType: params.columnType.memberType!,
      dataDefinitionProp: params.dataDefinitionProp,
      typeModsPart: params.typeModsPart
    });
    return `${dataTypeAttributes}[]`;
  }
  else {
    return params.columnType[params.dataDefinitionProp].replace(`#`, params.typeModsPart);
  }
}
