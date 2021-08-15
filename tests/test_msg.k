
enum TestEnum : byte { X, Y, SOMETHING, Z };

table TestMsg : test {
  str: string;
  byte: byte;
  byteEnum: TestEnum;
  int32: int32;
  uint32: uint32;
  int16: int16;
  uint16: uint16;
  sub: TestMsg;
  subs: [TestMsg];
  any: any;
}

table TestMsgJustStr : tstr {
  str: string;
}

table TestMsgNoFlex : tnof {
  byte: byte;
  byteEnum: TestEnum;
  int32: int32;
  uint32: uint32;
  int16: int16;
  uint16: uint16;
}

table TestEmptyTable : t_mt {
}

table TestNineBools : tb09 {
  a: bool;
  b: bool;
  c: bool;
  d: bool;
  e: bool;
  f: bool;
  g: bool;
  h: bool;
  i: bool;
}

table TestTenBools : tb10 {
  a: bool;
  b: bool;
  c: bool;
  d: bool;
  e: bool;
  f: bool;
  g: bool;
  h: bool;
  i: bool;
  j: bool;
}

