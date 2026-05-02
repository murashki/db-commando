{
  function unquote(str) {
    return str.slice(1, -1)
      .replace(/\\'/g, '\'')
      .replace(/\\\\/g, '\\');
  }
}

start = Entry

i_array
  = "array"i

i_booleanCast
  // Easier to list entries in reverse alphabetical order — first match wins
  = "boolean"i
  / "bool"i

i_comma
  = ","

i_digit
  = [0-9\.]

i_doubleColon
  = "::"

i_doubleQuote
  = "\""

i_escape
  = "\\"

i_false
  = "false"i
  {
    return false;
  }

i_now
  = "now"i

i_null
  = "null"i

i_numberCast
  // Easier to list entries in reverse alphabetical order — first match wins
  = "smallint"i
  / "real"i
  / "numeric"i (i_parenL i_digit+ (i_comma i_digit+)? i_parenR)?
  / "integer"i
  / "int8"i
  / "int4"i
  / "int2"i
  / "double precision"i
  / "bigint"i

i_parenL
  = "("

i_parenR
  = ")"

i_quote
  = "'"

i_space
  = " "

i_sqBracketL
  = "["

i_sqBracketR
  = "]"

i_textCast
  // Easier to list entries in reverse alphabetical order — first match wins
  = "varchar"i (i_parenL i_digit+ i_parenR)?
  / "timestamptz"i (i_parenL i_digit+ i_parenR)?
  / "timestamp"i (i_parenL i_digit+ i_parenR)? i_space "without time zone"i
  / "timestamp"i (i_parenL i_digit+ i_parenR)? i_space "with time zone"i
  / "timestamp"i (i_parenL i_digit+ i_parenR)?
  / "timetz"i (i_parenL i_digit+ i_parenR)?
  / "time"i (i_parenL i_digit+ i_parenR)? i_space "without time zone"i
  / "time"i (i_parenL i_digit+ i_parenR)? i_space "with time zone"i
  / "time"i (i_parenL i_digit+ i_parenR)?
  / "text"i
  / "gen_random_uuid"i (i_parenL i_parenR)?
  / "date"i
  / "character varying"i (i_parenL i_digit+ i_parenR)?
  / "character"i (i_parenL i_digit+ i_parenR)?
  / "bpchar"i

i_true
  = "true"i
  {
    return true;
  }

i_unsafeChar
  = i_quote
  / i_escape

Array
  = array: ArrayContent (i_doubleColon ArrayCast)?
  {
    return array;
  }

ArrayCast
  = (i_booleanCast / i_numberCast / i_textCast) "[]"

ArrayContent
  = i_array i_sqBracketL i_sqBracketR
  {
    return [];
  }
  / i_array i_sqBracketL member: ArrayMember i_sqBracketR
  {
    return [member];
  }
  / i_array i_sqBracketL member: ArrayMember separatedMembers: ArraySeparatedMember+ i_sqBracketR
  {
    return [member].concat(...separatedMembers);
  }
  / i_parenL content: Array i_parenR
  {
    return content;
  }

ArrayMember
  = Entry

ArraySeparatedMember
  = i_comma i_space entry: Entry
  {
    return entry;
  }

AutoIncrement
  = "nextval"i i_parenL i_quote i_doubleQuote [a-z-_]i+ i_doubleQuote i_quote i_doubleColon "regclass"i i_parenR
  {
    return { type: "AUTO_INCREMENT" }
  }

GenRandomUuid
  = "gen_random_uuid"i i_parenL i_parenR
  {
    return { type: "UUID()" }
  }

Boolean
  = boolean: BooleanContent (i_doubleColon i_booleanCast)?
  {
    return boolean;
  }

BooleanContent
  = i_true
  / i_false
  / i_parenL content: Boolean i_parenR
  {
    return content;
  }

Char
  = i_escape sequence: i_unsafeChar
  {
      return sequence;
  }
  / [^'\\]

Entry
  = Array
  / AutoIncrement
  / Boolean
  / GenRandomUuid
  / Now
  / Null
  / Number
  / Text

Now
  = NowContent (i_doubleColon i_textCast)?
  {
    return { type: "NOW()" };
  }

NowContent
  = i_now i_parenL i_parenR
  / i_parenL content: Now i_parenR
  {
    return content;
  }

Null
  = i_null (i_doubleColon (i_booleanCast / i_numberCast / i_textCast))?
  {
    return null;
  }

Number
  = number: NumberContent (i_doubleColon i_numberCast)?
  {
    return number;
  }

NumberContent
  = $(i_digit+)
  / i_parenL content: Number i_parenR
  {
    return content;
  }

Text
  = text: TextContent (i_doubleColon i_textCast)?
  {
    return text;
  }

TextContent
  = i_quote chars: Char* i_quote
  {
    return unquote(text());
  }
  / i_parenL content: Text i_parenR
  {
    return content;
  }
