import type { ColumnTypeSpec } from './ColumnTypeSpec.ts';
import type { EditConfig } from './EditConfig.ts';
import type { EditConfigOption } from './EditConfigOption.ts';
import type { ViewConfig } from './ViewConfig.ts';

export type ColumnType = {
  arrayEligible: boolean;
  desc?: string;

  /**
   * The control used for user input. Absent for arrays — use `memberType.editConfig` instead.
   */
  editConfig?: EditConfig | EditConfigOption[];

  isArray?: boolean;

  /**
   * Used when creating a column — the user selects from these values. Also referenced throughout
   * the codebase to distinguish column types from each other.
   */
  labelIn: string;

  /**
   * Used when displaying the column type in the table structure. May contain `#` replaced by a
   * number, e.g. `VARCHAR(#)` => `VARCHAR(255)`. May also contain `*` (for arrays), replaced by
   * the element type, e.g. `*[]` => `VARCHAR(255)[]`.
   */
  labelOut: string;

  /**
   * Present only when the data type is an array (`isArray === true`). During the column type
   * selection process, when the user has picked "array" but hasn't yet chosen the member type,
   * this property is omitted. Once the member type is selected, the property is set and stays
   * present.
   */
  memberType?: ColumnType;

  /**
   * SERIAL variants cannot be nullable. In PG, an `ARRAY` column itself can be nullable or not, but
   * its elements can always be null.
   */
  nullability: boolean;

  /**
   * Used when building a DB query (e.g. adding a column). May contain `#` replaced by a number,
   * e.g. `VARCHAR(#)` => `VARCHAR(255)`. May also contain `*` (for arrays), replaced by the
   * element type, e.g. `*[]` => `VARCHAR(255)[]`.
   */
  pgTypeIn: string;

  /**
   * Used to identify the data type — this is what the DB returns when querying table structure. May
   * contain `|` for aliases, e.g. `integer|int4`.
   */
  pgTypeOut: string;

  spec?: ColumnTypeSpec[];

  /**
   * Only for temporal types. Not currently used.
   */
  timezone?: boolean;

  viewConfig: ViewConfig;
};
