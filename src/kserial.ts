
let measuringBuffer = new Uint8Array(10*1024);
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export interface KSerializable {
  readonly serializeLength: number;
  serialize(desc: Uint8Array): number;
}

export class KSerializableAny {
  constructor(public id: string, public value: KSerializable) {}
}

const _factories:Record<string, (arg: Uint8Array)=>KSerializable> = {};

export function register(s: string, factory: (arg: Uint8Array)=>KSerializable): void {
  if (_factories[s]) throw new TypeError(`attempted to register ${s} twice`);
  _factories[s] = factory;
}

export function stringLength(s: string): number {
  if (s==='') return 0;
  if (s.length === 0) return 4;
  if (measuringBuffer.byteLength < s.length*3) measuringBuffer = new Uint8Array(s.length*3);
  const {read, written} = textEncoder.encodeInto(s, measuringBuffer);
  return (written as number) + 4;
}

export function serialize(msg: KSerializable): Uint8Array {
  const sz = msg.serializeLength;
  const ret = new Uint8Array(sz);
  msg.serialize(ret);
  return ret;
}

export function serializeByte(dest: Uint8Array, baseOffset: number, value: number): void {
  dest[baseOffset] = value;
}

export function deserializeByte(src: Uint8Array, baseOffset: number): number {
  return src[baseOffset];
}

export function serializeInt16(dest: Uint8Array, baseOffset: number, value: number): void {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  view.setInt16(baseOffset, value);
}

export function deserializeInt16(dest: Uint8Array, baseOffset: number): number {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  return view.getInt16(baseOffset);
}

export function serializeUint16(dest: Uint8Array, baseOffset: number, value: number): void {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  view.setUint16(baseOffset, value);
}

export function deserializeUint16(src: Uint8Array, baseOffset: number): number {
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  return view.getUint16(baseOffset);
}

export function serializeInt32(dest: Uint8Array, baseOffset: number, value: number): void {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  view.setInt32(baseOffset, value);
}

export function deserializeInt32(src: Uint8Array, baseOffset: number): number {
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  return view.getInt32(baseOffset);
}

export function serializeUint32(dest: Uint8Array, baseOffset: number, value: number): void {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  view.setUint32(baseOffset, value);
}

export function deserializeUint32(src: Uint8Array, baseOffset: number): number {
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  return view.getUint32(baseOffset);
}

export function serializeString(dest: Uint8Array, baseOffset: number, varOffset: number, s: string): number {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  if (s==='') {view.setUint32(baseOffset, 0); return 0;}
  view.setUint32(baseOffset, varOffset);
  const {read, written} = textEncoder.encodeInto(s, dest.subarray(varOffset+4));
  view.setUint32(varOffset, written as number);
  return (written as number)+4;
}

export function deserializeString(src: Uint8Array, baseOffset: number): string {
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  const offset = view.getUint32(baseOffset);
  if (offset == 0) return '';
  const length = view.getUint32(offset);
  return textDecoder.decode(src.subarray(offset+4, offset+4+length));
}

export function anyLength(k: KSerializableAny|null): number {
  if (k===null) return 0;
  return k.value.serializeLength+8;
}

export function subLength(k: KSerializable|null): number {
  if (k===null) return 0;
  return k.serializeLength+4;
}

export function serializeAny(dest: Uint8Array, baseOffset: number, varOffset: number, k: KSerializableAny|null): number {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  if (k===null) {view.setUint32(baseOffset, 0); return 0;}
  view.setUint32(baseOffset, varOffset);
  view.setUint32(varOffset, (k.id.charCodeAt(0)<<24)+(k.id.charCodeAt(1)<<16)+(k.id.charCodeAt(2)<<8)+k.id.charCodeAt(3));
  const written = k.value.serialize(dest.subarray(varOffset+8));
  view.setUint32(varOffset+4, written);
  return written+8;
}

export function deserializeAny(src: Uint8Array, baseOffset: number): KSerializableAny|null {
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  const offset = view.getUint32(baseOffset);
  if (offset == 0) return null;
  const idNum = view.getUint32(offset);
  const id = String.fromCharCode(idNum>>24,(idNum>>16)&255,(idNum>>8)&255, idNum&255);
  const length = view.getUint32(offset+4);
  const factory = _factories[id];
  if (factory===undefined) throw new TypeError(`${id} was not registered for deserialize`);
  return new KSerializableAny(id, factory!(src.subarray(offset+8, offset+8+length)));
}

export function serializeSub(dest: Uint8Array, baseOffset: number, varOffset: number, k: KSerializable|null): number {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  if (k===null) {view.setUint32(baseOffset, 0); return 0;}
  view.setUint32(baseOffset, varOffset);
  const written = k.serialize(dest.subarray(varOffset+4));
  view.setUint32(varOffset, written);
  return written+4;
}

export function deserializeSub(factory: (arg: Uint8Array) => KSerializable, src: Uint8Array, baseOffset: number): KSerializable|null {
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  const offset = view.getUint32(baseOffset);
  if (offset == 0) return null;
  const length = view.getUint32(offset);
  return factory(src.subarray(offset+4, offset+4+length));
}

export function subArrayLength(k: KSerializable[]): number {
  if (k.length===0) return 0;
  return 8+k.length*4+k.map((e) => e.serializeLength).reduce((sum, next) => sum+next);
}

export function serializeSubArray(dest: Uint8Array, baseOffset: number, varOffset: number, k: KSerializable[]): number {
  const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
  if (k.length===0) {view.setUint32(baseOffset, 0); return 0;}
  view.setUint32(baseOffset, varOffset);
  let secondVarOffset = varOffset + 8 + k.length*4;
  view.setUint32(varOffset, k.length);
  for (let i = 0; i < k.length; i++) {
    view.setUint32(varOffset+4+i*4, secondVarOffset);
    secondVarOffset += k[i].serialize(dest.subarray(secondVarOffset));
  }
  view.setUint32(varOffset+4+k.length*4, secondVarOffset);
  return secondVarOffset - varOffset;
}

export function deserializeSubArray(factory: (arg: Uint8Array) => KSerializable, src: Uint8Array, baseOffset: number): KSerializable[] {
  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  const offset = view.getUint32(baseOffset);
  if (offset == 0) return [];
  const count = view.getUint32(offset);
  const ret = new Array(count);
  let start = view.getUint32(offset+4);
  for (let i = 0; i < count; i++) {
    if (start === 0) throw RangeError('bad offset deserializing array');
    let end = view.getUint32(offset+8+i*4);
    ret[i] = factory(src.subarray(start,end));
    start = end;
  }
  return ret;
}

