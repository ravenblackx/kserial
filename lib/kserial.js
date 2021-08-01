"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeSubArray = exports.serializeSubArray = exports.subArrayLength = exports.deserializeSub = exports.serializeSub = exports.deserializeAny = exports.serializeAny = exports.subLength = exports.anyLength = exports.deserializeString = exports.serializeString = exports.deserializeUint32 = exports.serializeUint32 = exports.deserializeInt32 = exports.serializeInt32 = exports.deserializeUint16 = exports.serializeUint16 = exports.deserializeInt16 = exports.serializeInt16 = exports.deserializeByte = exports.serializeByte = exports.serialize = exports.stringLength = exports.register = exports.KSerializableAny = void 0;
let measuringBuffer = new Uint8Array(10 * 1024);
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
class KSerializableAny {
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }
}
exports.KSerializableAny = KSerializableAny;
const _factories = {};
function register(s, factory) {
    if (_factories[s])
        throw new TypeError(`attempted to register ${s} twice`);
    _factories[s] = factory;
}
exports.register = register;
function stringLength(s) {
    if (s === '')
        return 0;
    if (s.length === 0)
        return 4;
    if (measuringBuffer.byteLength < s.length * 3)
        measuringBuffer = new Uint8Array(s.length * 3);
    const { read, written } = textEncoder.encodeInto(s, measuringBuffer);
    return written + 4;
}
exports.stringLength = stringLength;
function serialize(msg) {
    const sz = msg.serializeLength;
    const ret = new Uint8Array(sz);
    msg.serialize(ret);
    return ret;
}
exports.serialize = serialize;
function serializeByte(dest, baseOffset, value) {
    dest[baseOffset] = value;
}
exports.serializeByte = serializeByte;
function deserializeByte(src, baseOffset) {
    return src[baseOffset];
}
exports.deserializeByte = deserializeByte;
function serializeInt16(dest, baseOffset, value) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    view.setInt16(baseOffset, value);
}
exports.serializeInt16 = serializeInt16;
function deserializeInt16(dest, baseOffset) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    return view.getInt16(baseOffset);
}
exports.deserializeInt16 = deserializeInt16;
function serializeUint16(dest, baseOffset, value) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    view.setUint16(baseOffset, value);
}
exports.serializeUint16 = serializeUint16;
function deserializeUint16(src, baseOffset) {
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    return view.getUint16(baseOffset);
}
exports.deserializeUint16 = deserializeUint16;
function serializeInt32(dest, baseOffset, value) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    view.setInt32(baseOffset, value);
}
exports.serializeInt32 = serializeInt32;
function deserializeInt32(src, baseOffset) {
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    return view.getInt32(baseOffset);
}
exports.deserializeInt32 = deserializeInt32;
function serializeUint32(dest, baseOffset, value) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    view.setUint32(baseOffset, value);
}
exports.serializeUint32 = serializeUint32;
function deserializeUint32(src, baseOffset) {
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    return view.getUint32(baseOffset);
}
exports.deserializeUint32 = deserializeUint32;
function serializeString(dest, baseOffset, varOffset, s) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    if (s === '') {
        view.setUint32(baseOffset, 0);
        return 0;
    }
    view.setUint32(baseOffset, varOffset);
    const { read, written } = textEncoder.encodeInto(s, dest.subarray(varOffset + 4));
    view.setUint32(varOffset, written);
    return written + 4;
}
exports.serializeString = serializeString;
function deserializeString(src, baseOffset) {
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    const offset = view.getUint32(baseOffset);
    if (offset == 0)
        return '';
    const length = view.getUint32(offset);
    return textDecoder.decode(src.subarray(offset + 4, offset + 4 + length));
}
exports.deserializeString = deserializeString;
function anyLength(k) {
    if (k === null)
        return 0;
    return k.value.serializeLength + 8;
}
exports.anyLength = anyLength;
function subLength(k) {
    if (k === null)
        return 0;
    return k.serializeLength + 4;
}
exports.subLength = subLength;
function serializeAny(dest, baseOffset, varOffset, k) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    if (k === null) {
        view.setUint32(baseOffset, 0);
        return 0;
    }
    view.setUint32(baseOffset, varOffset);
    view.setUint32(varOffset, (k.id.charCodeAt(0) << 24) + (k.id.charCodeAt(1) << 16) + (k.id.charCodeAt(2) << 8) + k.id.charCodeAt(3));
    const written = k.value.serialize(dest.subarray(varOffset + 8));
    view.setUint32(varOffset + 4, written);
    return written + 8;
}
exports.serializeAny = serializeAny;
function deserializeAny(src, baseOffset) {
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    const offset = view.getUint32(baseOffset);
    if (offset == 0)
        return null;
    const idNum = view.getUint32(offset);
    const id = String.fromCharCode(idNum >> 24, (idNum >> 16) & 255, (idNum >> 8) & 255, idNum & 255);
    const length = view.getUint32(offset + 4);
    const factory = _factories[id];
    if (factory === undefined)
        throw new TypeError(`${id} was not registered for deserialize`);
    return new KSerializableAny(id, factory(src.subarray(offset + 8, offset + 8 + length)));
}
exports.deserializeAny = deserializeAny;
function serializeSub(dest, baseOffset, varOffset, k) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    if (k === null) {
        view.setUint32(baseOffset, 0);
        return 0;
    }
    view.setUint32(baseOffset, varOffset);
    const written = k.serialize(dest.subarray(varOffset + 4));
    view.setUint32(varOffset, written);
    return written + 4;
}
exports.serializeSub = serializeSub;
function deserializeSub(factory, src, baseOffset) {
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    const offset = view.getUint32(baseOffset);
    if (offset == 0)
        return null;
    const length = view.getUint32(offset);
    return factory(src.subarray(offset + 4, offset + 4 + length));
}
exports.deserializeSub = deserializeSub;
function subArrayLength(k) {
    if (k.length === 0)
        return 0;
    return 8 + k.length * 4 + k.map((e) => e.serializeLength).reduce((sum, next) => sum + next);
}
exports.subArrayLength = subArrayLength;
function serializeSubArray(dest, baseOffset, varOffset, k) {
    const view = new DataView(dest.buffer, dest.byteOffset, dest.byteLength);
    if (k.length === 0) {
        view.setUint32(baseOffset, 0);
        return 0;
    }
    view.setUint32(baseOffset, varOffset);
    let secondVarOffset = varOffset + 8 + k.length * 4;
    view.setUint32(varOffset, k.length);
    for (let i = 0; i < k.length; i++) {
        view.setUint32(varOffset + 4 + i * 4, secondVarOffset);
        secondVarOffset += k[i].serialize(dest.subarray(secondVarOffset));
    }
    view.setUint32(varOffset + 4 + k.length * 4, secondVarOffset);
    return secondVarOffset - varOffset;
}
exports.serializeSubArray = serializeSubArray;
function deserializeSubArray(factory, src, baseOffset) {
    const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
    const offset = view.getUint32(baseOffset);
    if (offset == 0)
        return [];
    const count = view.getUint32(offset);
    const ret = new Array(count);
    let start = view.getUint32(offset + 4);
    for (let i = 0; i < count; i++) {
        if (start === 0)
            throw RangeError('bad offset deserializing array');
        let end = view.getUint32(offset + 8 + i * 4);
        ret[i] = factory(src.subarray(start, end));
        start = end;
    }
    return ret;
}
exports.deserializeSubArray = deserializeSubArray;
