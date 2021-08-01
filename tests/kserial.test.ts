import {expect} from 'chai';
import * as kserial from '../src/kserial';
import {KSerializableAny} from '../src/kserial';
import {TestMsg, TestMsgJustStr, TestMsgNoFlex, TestEnum} from './test_msg';

describe('kserial', function() {
  it('serializes and deserializes a TestMsgJustStr', function() {
    const input = new TestMsgJustStr({str: 'hello'});
    const binary = kserial.serialize(input);
    const out = TestMsgJustStr.deserialize(binary);
    expect(out.str).equal(input.str);
  });

  it('throws an exception if you deserialize a too small buffer', function() {
    const badBuffer = new Uint8Array(10);
    expect(() => TestMsg.deserialize(badBuffer)).to.throw(RangeError);
  });

  it('throws an exception if an array entry points at zero', function() {
    const start = new TestMsg({
      subs: [new TestMsg({byte: 123})],
    });
    const buffer = kserial.serialize(start);
    // Corrupt the pointer to try to make a loop.
    buffer[37]=0;
    expect(() => TestMsg.deserialize(buffer)).to.throw(RangeError);
  });

  it('serializes a TestMsgJustStr with no str without allocs', function() {
    const input = new TestMsgJustStr({});
    const binary = kserial.serialize(input);
    const out = TestMsgJustStr.deserialize(binary);
    expect(out.str).to.equal('');
    expect(Array.from(binary)).deep.equal([0,0,0,0]);
  });

  it('serializes and deserializes a TestMsg', function() {
    const input = new TestMsg({
      str: 'hello',
      byte: 32,
      int16: -5,
      uint16: 65535,
      int32: -99999,
      uint32: 65535*65535,
      byteEnum: TestEnum.SOMETHING,
      sub: new TestMsg({str: 'subhello'}),
      subs: [new TestMsg({str: 'subhellolist1'}), new TestMsg({str: 'subhellolist2'})],
      any: new KSerializableAny(TestMsg.id, new TestMsg({str: 'any'})),
    });
    const binary = kserial.serialize(input);
    const out = TestMsg.deserialize(binary);
    expect(out.str).equal(input.str);
    expect(out.byte).equal(input.byte);
    expect(out.int16).equal(input.int16);
    expect(out.uint16).equal(input.uint16);
    expect(out.int32).equal(input.int32);
    expect(out.uint32).equal(input.uint32);
    expect(out.byteEnum).equal(input.byteEnum);
    expect(out.sub!.str).equal(input.sub!.str);
    expect(out.subs!.length).equal(input.subs!.length);
    expect(out.subs![0].str).equal(input.subs![0].str);
    expect(out.subs![1].str).equal(input.subs![1].str);
    expect(out.any!.id).equal(input.any!.id);
    expect((out.any!.value as TestMsg).str).equal((input.any!.value as TestMsg).str);
  });

  it(`serializes and deserializes an empty TestMsg`, function() {
    const input = new TestMsg({});
    const binary = kserial.serialize(input);
    const out = TestMsg.deserialize(binary);
    expect(out.str).equal('');
    expect(out.byte).equal(0);
    expect(out.int16).equal(0);
    expect(out.uint32).equal(0);
    expect(out.sub).equal(null);
    expect(out.subs).is.empty;
    expect(out.any).equal(null);
    expect(binary.length).equal(30);
  });
});
