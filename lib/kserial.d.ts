export interface KSerializable {
    readonly serializeLength: number;
    serialize(desc: Uint8Array): number;
}
export declare class KSerializableAny {
    id: string;
    value: KSerializable;
    constructor(id: string, value: KSerializable);
}
export declare function register(s: string, factory: (arg: Uint8Array) => KSerializable): void;
export declare function stringLength(s: string): number;
export declare function serialize(msg: KSerializable): Uint8Array;
export declare function serializeByte(dest: Uint8Array, baseOffset: number, value: number): void;
export declare function deserializeByte(src: Uint8Array, baseOffset: number): number;
export declare function serializeInt16(dest: Uint8Array, baseOffset: number, value: number): void;
export declare function deserializeInt16(dest: Uint8Array, baseOffset: number): number;
export declare function serializeUint16(dest: Uint8Array, baseOffset: number, value: number): void;
export declare function deserializeUint16(src: Uint8Array, baseOffset: number): number;
export declare function serializeInt32(dest: Uint8Array, baseOffset: number, value: number): void;
export declare function deserializeInt32(src: Uint8Array, baseOffset: number): number;
export declare function serializeUint32(dest: Uint8Array, baseOffset: number, value: number): void;
export declare function deserializeUint32(src: Uint8Array, baseOffset: number): number;
export declare function serializeString(dest: Uint8Array, baseOffset: number, varOffset: number, s: string): number;
export declare function deserializeString(src: Uint8Array, baseOffset: number): string;
export declare function anyLength(k: KSerializableAny | null): number;
export declare function subLength(k: KSerializable | null): number;
export declare function serializeAny(dest: Uint8Array, baseOffset: number, varOffset: number, k: KSerializableAny | null): number;
export declare function deserializeAny(src: Uint8Array, baseOffset: number): KSerializableAny | null;
export declare function serializeSub(dest: Uint8Array, baseOffset: number, varOffset: number, k: KSerializable | null): number;
export declare function deserializeSub(factory: (arg: Uint8Array) => KSerializable, src: Uint8Array, baseOffset: number): KSerializable | null;
export declare function subArrayLength(k: KSerializable[]): number;
export declare function serializeSubArray(dest: Uint8Array, baseOffset: number, varOffset: number, k: KSerializable[]): number;
export declare function deserializeSubArray(factory: (arg: Uint8Array) => KSerializable, src: Uint8Array, baseOffset: number): KSerializable[];
