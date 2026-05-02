import c from 'chalk';
import { getUnixTime } from 'date-fns/getUnixTime';
import { parseISO } from 'date-fns/parseISO';
import { select } from 'proprompt';
import { text } from 'proprompt';
import type { DbCommandoContext } from '../@types/DbCommandoContext.ts';

// TODO proper client types should be defined here
type ApiClient = any;
type DbClient = any;

export type TravelerProgram<
  TParams extends undefined | Record<string, any>,
  TResponse extends any,
> = {
  config: TravelerProgramConfig<TParams>,
  as: <
    TNextResponse extends any,
  >(cb: (data: TResponse, api: ApiClient, db: DbClient) => TNextResponse | Promise<TNextResponse>) => TravelerProgram<TParams, TNextResponse>;
  run: (context: DbCommandoContext) => Promise<symbol | TResponse>;
};

export type TravelerProgramApiRequest<
  TParams extends undefined | Record<string, any>,
  TResponse extends any,
> = {
  (params: TParams): Promise<TResponse>;
};

export type TravelerProgramDbRequest<
  TParams extends undefined | Record<string, any>,
  TResponse extends any,
> = {
  (db: DbClient, props: TParams): Promise<TResponse>;
};

export type TravelerProgramConfig<
  TParams extends undefined | Record<string, any>,
> = {
  name: string;
  namespace?: string;
  params: TravelerRequestParams<TParams>,
};

type TravelerParam =
  | TravelerProgramParam
  | TravelerSelectBooleanParam
  | TravelerSelectParam
  | TravelerTextDatetimeParam
  | TravelerTextParam;

export type TravelerRequestParams<
  TParams extends undefined | Record<string, any>,
> = { [TParamKey in keyof TParams]: TParamKey extends string
  ? TravelerProgram<any, TParams[TParamKey]> | (
    string[] extends TParams[TParamKey]
      ? (
        | TravelerProgramParam<string[]> & { as?: never }
        | TravelerProgramParam<string> & { as: typeof TRAVELER.PARAM.USE_AS.ARRAY }
        | TravelerSelectParam<string> & { as: typeof TRAVELER.PARAM.USE_AS.ARRAY }
        | TravelerTextParam<string> & { as: typeof TRAVELER.PARAM.USE_AS.ARRAY }
      ) & OptionalParam<TParams[TParamKey]>
      :
      string extends TParams[TParamKey]
        ? (
          | TravelerProgramParam<string> & { as?: never }
          | TravelerSelectParam<string> & { as?: never }
          | TravelerTextDatetimeParam & { as?: never }
          | TravelerTextParam<string> & { as?: never }
        ) & OptionalParam<TParams[TParamKey]>
        : number extends TParams[TParamKey]
          ? (
            | TravelerTextDatetimeParam & { as: typeof TRAVELER.PARAM.USE_AS.UNIX_TIME }
            | TravelerProgramParam<number> & { as?: never }
          ) & OptionalParam<TParams[TParamKey]>
          : boolean extends TParams[TParamKey]
            ? (
              | TravelerSelectBooleanParam & { as?: never }
            ) & OptionalParam<TParams[TParamKey]>
            : Extract<TParams[TParamKey], string> extends string
              ? (
                | TravelerProgramParam<Extract<TParams[TParamKey], string>> & { as?: never }
                | TravelerSelectParam<Extract<TParams[TParamKey], string>> & { as?: never }
                | TravelerTextParam<Extract<TParams[TParamKey], string>> & { as?: never }
              ) & OptionalParam<TParams[TParamKey]>
              : never
    )
  : never
};

export type TravelerProgramParam<
  TParamValue extends any = any,
> = {
  as?: typeof TRAVELER.PARAM.USE_AS.ARRAY;
  optional?: undefined | boolean;
  program: TravelerProgram<any, TParamValue>;
  type: typeof TRAVELER.PARAM.TYPE.PROGRAM;
};

export type TravelerSelectBooleanParam = {
  initialValue?: boolean;
  label?: string;
  labelHint?: string;
  optional?: undefined | boolean;
  type: typeof TRAVELER.PARAM.TYPE.SELECT.BOOLEAN;
};

export type TravelerSelectParam<
  TParamValue extends string = string,
> = {
  as?: typeof TRAVELER.PARAM.USE_AS.ARRAY;
  initialValue?: TParamValue;
  label?: string;
  labelHint?: string;
  optional?: undefined | boolean;
  options: { label: string, value: undefined | TParamValue }[];
  type: typeof TRAVELER.PARAM.TYPE.SELECT;
};

export type TravelerTextDatetimeParam = {
  as?: typeof TRAVELER.PARAM.USE_AS.UNIX_TIME;
  initialValue?: number | string | Date;
  label?: string;
  labelHint?: string;
  optional?: undefined | boolean;
  type: typeof TRAVELER.PARAM.TYPE.TEXT.DATETIME;
};

export type TravelerTextParam<
  TParamValue extends string = string,
> = {
  as?: typeof TRAVELER.PARAM.USE_AS.ARRAY;
  initialValue?: TParamValue;
  label?: string;
  labelHint?: string;
  optional?: undefined | boolean;
  type: typeof TRAVELER.PARAM.TYPE.TEXT;
};

type OptionalParam<
  TParamValue extends any,
> = undefined extends TParamValue
  ? {
    optional?: never | undefined | boolean;
  }
  : {
    optional?: never | undefined;
  };

export const TRAVELER = {
  PARAM: {
    TYPE: {
      // To implement:
      // - CHECKBOX — MULTISELECT in terminal
      // DATE_PICKER
      // DATE_RANGE
      // DATETIME_PICKER
      // DATETIME_RANGE
      // MULTISELECT
      // + PROGRAM
      // - RADIO — SELECT in terminal
      // - RADIO.BOOLEAN — SELECT.BOOLEAN in terminal
      // + SELECT
      // SELECT.BOOLEAN
      // - SWITCHER — SELECT in terminal
      // - SWITCHER.BOOLEAN — SELECT.BOOLEAN in terminal
      // + TEXT
      // TEXT.DATE
      // + TEXT.DATETIME
      // TEXT.TIME
      // TEXT.EMAIL
      // TIME_PICKER
      // TIME_RANGE
      PROGRAM: `PARAM.TYPE.PROGRAM`,
      SELECT: {
        BOOLEAN: `PARAM.TYPE.SELECT.BOOLEAN`,
      },
      TEXT: {
        DATETIME: `PARAM.TYPE.TEXT.DATETIME`,
      },
    },
    USE_AS: {
      ARRAY: `PARAM.USE_AS.ARRAY`,
      UNIX_TIME: `PARAM.USE_AS.UNIX_TIME`,
    },
  },
} as const;

export const BREAK = Symbol(`TRAVELER_BREAK`);

export async function traveler<
  TParams extends undefined | Record<string, any>,
>(context: DbCommandoContext, config: TravelerProgramConfig<TParams>): Promise<symbol | TParams> {
  const params: Record<string, any> = {};

  for (const paramName in config.params) {
    const param = config.params[paramName];

    if (`run` in param) {
      Object.assign(params, await param.run(context));
    }
    else {
      switch (param.type) {
        case TRAVELER.PARAM.TYPE.PROGRAM: {
          const programValue = await param.program.run(context);

          if (programValue === BREAK) {
            return programValue;
          }
          else {
            if (param.as === TRAVELER.PARAM.USE_AS.ARRAY) {
              params[paramName] = [programValue];
            }
            else {
              params[paramName] = programValue;
            }
          }

          break;
        }
        case TRAVELER.PARAM.TYPE.SELECT: {
          const valueSelectResult = await select({
            message: getStepMessage(config.name, paramName, param),
            options: param.options,
            initialValue: param.initialValue,
          });

          if (valueSelectResult.canceled) {
            return BREAK;
          }

          if (param.as === TRAVELER.PARAM.USE_AS.ARRAY) {
            params[paramName] = [valueSelectResult.value];
          }
          else {
            params[paramName] = valueSelectResult.value;
          }

          break;
        }
        case TRAVELER.PARAM.TYPE.SELECT.BOOLEAN: {
          const valueSelectResult = await select({
            message: getStepMessage(config.name, paramName, param),
            options: [{ label: `TRUE`, value: true }, { label: `FALSE`, value: false }],
            initialValue: param.initialValue,
          });

          if (valueSelectResult.canceled) {
            return BREAK;
          }

          params[paramName] = valueSelectResult.value;

          break;
        }
        case TRAVELER.PARAM.TYPE.TEXT: {
          const valueTextResult = await text({
            message: getStepMessage(config.name, paramName, param),
            initialValue: param.initialValue,
          });

          if (valueTextResult.canceled) {
            return BREAK;
          }

          if (param.as === TRAVELER.PARAM.USE_AS.ARRAY) {
            params[paramName] = [valueTextResult.value];
          }
          else {
            params[paramName] = valueTextResult.value;
          }

          break;
        }
        case TRAVELER.PARAM.TYPE.TEXT.DATETIME: {
          // TODO rewrite using date-fns
          const defaultDatetime = new Date();
          defaultDatetime.setMinutes(0);
          defaultDatetime.setSeconds(0);
          defaultDatetime.setMilliseconds(0);

          const initialValue = typeof param.initialValue === `number` || typeof param.initialValue === `string`
            ? new Date(param.initialValue).toISOString()
            : param.initialValue
              ? param.initialValue.toISOString()
              : defaultDatetime.toISOString();

          const valueTextResult = await text({
            message: getStepMessage(config.name, paramName, param),
            initialValue,
          });

          if (valueTextResult.canceled) {
            return BREAK;
          }

          if (param.as === TRAVELER.PARAM.USE_AS.UNIX_TIME) {
            params[paramName] = getUnixTime(parseISO(valueTextResult.value));
          }
          else {
            params[paramName] = valueTextResult.value;
          }

          break;
        }
        default: {
          throw new Error(`Unexpected traveler program parameter type`);
        }
      }
    }
  }

  return params as TParams;
}

function getStepMessage(programName: string, paramName: string, param: TravelerParam) {
  const hints = [];
  if ((`labelHint` in param) && param.labelHint) {
    hints.push(param.labelHint);
  }
  if (param.optional) {
    hints.push(`optional`);
  }
  const label = (`label` in param ? param.label : ``) || paramName;
  const hintText = hints.length ? ` ${c.dim(`(${hints.join(`, `)})`)}` : ``;
  return `${programName} param: ${c.cyan(`${label}${hintText}`)}`;
}

export function createProgram<
  TParams extends undefined | Record<string, any>,
  TResponse extends any,
>(cb: (api: ApiClient, db: DbClient, params: TParams) => Promise<TResponse>) {
  return {
    config: (config: TravelerProgramConfig<TParams>): TravelerProgram<TParams, TResponse> => {
      const createProgram = <
        TResponse extends any,
      >(config: TravelerProgramConfig<TParams>, cb: (api: ApiClient, db: DbClient, params: TParams) => Promise<TResponse>) => {
        return {
          config,
          as: <
            TNextResponse extends any
          >(nextCb: (data: TResponse, api: ApiClient, db: DbClient) => TNextResponse | Promise<TNextResponse>) => {
            return createProgram<TNextResponse>(config, async (api, db, params) => {
              const data = await cb(api, db, params);
              return nextCb(data, api, db);
            });
          },
          run: async (context: DbCommandoContext): Promise<symbol | TResponse> => {
            const params = await traveler(context, config);
            if (typeof params === `symbol`) {
              return BREAK;
            }
            else {
              // TODO
              return cb((context as any).api, (context as any).db, params);
            }
          },
        };
      };

      return createProgram<TResponse>(config, cb);
    },
  };
}

export function createApiProgram<
  TParams extends undefined | Record<string, any>,
  TResponse extends any,
>(getApiMethod: (api: ApiClient) => TravelerProgramApiRequest<TParams, TResponse>) {
  return createProgram<TParams, TResponse>((api, db, params) => getApiMethod(api)(params));
}

export function createDbProgram<
  TParams extends undefined | Record<string, any>,
  TResponse extends any,
>(dbMethod: TravelerProgramDbRequest<TParams, TResponse>) {
  return createProgram<TParams, TResponse>((api, db, params) => dbMethod(db, params));
}
