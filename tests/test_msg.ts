import {KSerializableAny,KSerializable,register,
subLength,anyLength,subArrayLength,stringLength,
serializeSub,serializeSubArray,serializeInt32,serializeInt16,serializeUint32,serializeUint16,serializeByte,serializeString,serializeAny,
deserializeSub,deserializeSubArray,deserializeInt32,deserializeInt16,deserializeUint32,deserializeUint16,deserializeByte,deserializeString,deserializeAny
} from '../src/kserial';
// The import has been changed manually from the generated file, to
// facilitate testing of the local version.

export enum TestEnum {
  X,
  Y,
  SOMETHING,
  Z,
}

export class TestMsg {
  static readonly id:string = 'test';
  str: string;
  byte: number;
  byteEnum: TestEnum;
  int32: number;
  uint32: number;
  int16: number;
  uint16: number;
  sub: TestMsg|null;
  subs: TestMsg[];
  any: KSerializableAny|null;
  constructor({str='',byte=0,byteEnum=TestEnum.X,int32=0,uint32=0,int16=0,uint16=0,sub=null,subs=[],any=null}:{str?:string,byte?:number,byteEnum?:TestEnum,int32?:number,uint32?:number,int16?:number,uint16?:number,sub?:TestMsg|null,subs?:TestMsg[],any?:KSerializableAny|null}={}) {this.str=str; this.byte=byte; this.byteEnum=byteEnum; this.int32=int32; this.uint32=uint32; this.int16=int16; this.uint16=uint16; this.sub=sub; this.subs=subs; this.any=any;}
  get serializeLength(): number { return 30+stringLength(this.str)+subLength(this.sub)+subArrayLength(this.subs)+anyLength(this.any); }
  serialize(dest: Uint8Array): number {
    let offset = 30;
    offset += serializeString(dest, 0, offset, this.str);
    serializeByte(dest, 4, this.byte);
    serializeByte(dest, 5, this.byteEnum);
    serializeInt32(dest, 6, this.int32);
    serializeUint32(dest, 10, this.uint32);
    serializeInt16(dest, 14, this.int16);
    serializeUint16(dest, 16, this.uint16);
    offset += serializeSub(dest, 18, offset, this.sub);
    offset += serializeSubArray(dest, 22, offset, this.subs);
    offset += serializeAny(dest, 26, offset, this.any);
    return offset;
  }
  static deserialize(src: Uint8Array): TestMsg {
    return new TestMsg({
      str: deserializeString(src, 0),
      byte: deserializeByte(src, 4),
      byteEnum: deserializeByte(src, 5) as TestEnum,
      int32: deserializeInt32(src, 6),
      uint32: deserializeUint32(src, 10),
      int16: deserializeInt16(src, 14),
      uint16: deserializeUint16(src, 16),
      sub: deserializeSub(TestMsg.deserialize, src, 18) as TestMsg,
      subs: deserializeSubArray(TestMsg.deserialize, src, 22) as TestMsg[],
      any: deserializeAny(src, 26),
    });
  }
}
register('test', TestMsg.deserialize);

export class TestMsgJustStr {
  static readonly id:string = 'tstr';
  str: string;
  constructor({str=''}:{str?:string}={}) {this.str=str;}
  get serializeLength(): number { return 4+stringLength(this.str); }
  serialize(dest: Uint8Array): number {
    let offset = 4;
    offset += serializeString(dest, 0, offset, this.str);
    return offset;
  }
  static deserialize(src: Uint8Array): TestMsgJustStr {
    return new TestMsgJustStr({
      str: deserializeString(src, 0),
    });
  }
}
register('tstr', TestMsgJustStr.deserialize);

export class TestMsgNoFlex {
  static readonly id:string = 'tnof';
  byte: number;
  byteEnum: TestEnum;
  int32: number;
  uint32: number;
  int16: number;
  uint16: number;
  constructor({byte=0,byteEnum=TestEnum.X,int32=0,uint32=0,int16=0,uint16=0}:{byte?:number,byteEnum?:TestEnum,int32?:number,uint32?:number,int16?:number,uint16?:number}={}) {this.byte=byte; this.byteEnum=byteEnum; this.int32=int32; this.uint32=uint32; this.int16=int16; this.uint16=uint16;}
  get serializeLength(): number { return 14; }
  serialize(dest: Uint8Array): number {
    serializeByte(dest, 0, this.byte);
    serializeByte(dest, 1, this.byteEnum);
    serializeInt32(dest, 2, this.int32);
    serializeUint32(dest, 6, this.uint32);
    serializeInt16(dest, 10, this.int16);
    serializeUint16(dest, 12, this.uint16);
    return 14;
  }
  static deserialize(src: Uint8Array): TestMsgNoFlex {
    return new TestMsgNoFlex({
      byte: deserializeByte(src, 0),
      byteEnum: deserializeByte(src, 1) as TestEnum,
      int32: deserializeInt32(src, 2),
      uint32: deserializeUint32(src, 6),
      int16: deserializeInt16(src, 10),
      uint16: deserializeUint16(src, 12),
    });
  }
}
register('tnof', TestMsgNoFlex.deserialize);

export class TestEmptyTable {
  static readonly id:string = 't_mt';
  get serializeLength(): number { return 0; }
  serialize(dest: Uint8Array): number {
    return 0;
  }
  static deserialize(src: Uint8Array): TestEmptyTable {
    return new TestEmptyTable();
  }
}
register('t_mt', TestEmptyTable.deserialize);

export class TestNineBools {
  static readonly id:string = 'tb09';
  a: boolean;
  b: boolean;
  c: boolean;
  d: boolean;
  e: boolean;
  f: boolean;
  g: boolean;
  h: boolean;
  i: boolean;
  constructor({a=false,b=false,c=false,d=false,e=false,f=false,g=false,h=false,i=false}:{a?:boolean,b?:boolean,c?:boolean,d?:boolean,e?:boolean,f?:boolean,g?:boolean,h?:boolean,i?:boolean}={}) {this.a=a; this.b=b; this.c=c; this.d=d; this.e=e; this.f=f; this.g=g; this.h=h; this.i=i;}
  get serializeLength(): number { return 2; }
  serialize(dest: Uint8Array): number {
    serializeByte(dest, 1, ((this.a?1:0))+((this.b?1:0)<<1)+((this.c?1:0)<<2)+((this.d?1:0)<<3)+((this.e?1:0)<<4)+((this.f?1:0)<<5)+((this.g?1:0)<<6)+((this.h?1:0)<<7));
    serializeByte(dest, 0, ((this.i?1:0)));
    return 2;
  }
  static deserialize(src: Uint8Array): TestNineBools {
    const bools0 = deserializeByte(src, 1);
    return new TestNineBools({
      a: !!((bools0>>0)&1),
      b: !!((bools0>>1)&1),
      c: !!((bools0>>2)&1),
      d: !!((bools0>>3)&1),
      e: !!((bools0>>4)&1),
      f: !!((bools0>>5)&1),
      g: !!((bools0>>6)&1),
      h: !!((bools0>>7)&1),
      i: !!deserializeByte(src, 0),
    });
  }
}
register('tb09', TestNineBools.deserialize);

export class TestTenBools {
  static readonly id:string = 'tb10';
  a: boolean;
  b: boolean;
  c: boolean;
  d: boolean;
  e: boolean;
  f: boolean;
  g: boolean;
  h: boolean;
  i: boolean;
  j: boolean;
  constructor({a=false,b=false,c=false,d=false,e=false,f=false,g=false,h=false,i=false,j=false}:{a?:boolean,b?:boolean,c?:boolean,d?:boolean,e?:boolean,f?:boolean,g?:boolean,h?:boolean,i?:boolean,j?:boolean}={}) {this.a=a; this.b=b; this.c=c; this.d=d; this.e=e; this.f=f; this.g=g; this.h=h; this.i=i; this.j=j;}
  get serializeLength(): number { return 2; }
  serialize(dest: Uint8Array): number {
    serializeByte(dest, 1, ((this.a?1:0))+((this.b?1:0)<<1)+((this.c?1:0)<<2)+((this.d?1:0)<<3)+((this.e?1:0)<<4)+((this.f?1:0)<<5)+((this.g?1:0)<<6)+((this.h?1:0)<<7));
    serializeByte(dest, 0, ((this.i?1:0))+((this.j?1:0)<<1));
    return 2;
  }
  static deserialize(src: Uint8Array): TestTenBools {
    const bools0 = deserializeByte(src, 1);
    const bools1 = deserializeByte(src, 0);
    return new TestTenBools({
      a: !!((bools0>>0)&1),
      b: !!((bools0>>1)&1),
      c: !!((bools0>>2)&1),
      d: !!((bools0>>3)&1),
      e: !!((bools0>>4)&1),
      f: !!((bools0>>5)&1),
      g: !!((bools0>>6)&1),
      h: !!((bools0>>7)&1),
      i: !!((bools1>>0)&1),
      j: !!((bools1>>1)&1),
    });
  }
}
register('tb10', TestTenBools.deserialize);

