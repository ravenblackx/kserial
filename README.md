# kserial
This is a lightweight typescript library for serializing and deserializing binary data.

`kserialc` is the companion project that generates serializable classes from a schema.

## Installation

```
npm install kserial
```

## Usage

```typescript
import * as kserial from 'kserial';
import {MyMsg, MyEnum} from './my_generated_messages';

// You can initialize a whole message in one go.
const outgoingMsg = new MyMsg({
  someEnum: MyEnum.SOME_VALUE,
  someInt: 32, 
  someString: 'hello',
});

// Or you can edit messages in place, including submessages.
outgoingMsg.someMyMsg = new MyMsg({someString: 'a submessage'});

// Also encapsulate submessages without a fixed type.
outgoingMsg.someAnyMsg = kserial.KSerializableAny(MyMsg.id, new MyMsg({someString: 'goodbye'}));

// Serializing occurs on demand; a Uint8Array is allocated of the correct size
// for the message.
const serializedBinary = kserial.serialize(x);

// You can also choose to serialize into an existing buffer.
outgoingMsg.serialize(existingUint8Array);

// And measure.
console.log(outgoingMsg.serializeLength);

// And deserializing is just as easy.
const incomingBinary = new Uint8List(someDataFromAFileOrSomething);
const incomingMsg = MyMsg.deserialize(incomingBinary);
console.log(incomingMsg.someString);

// Deserialize will throw a TypeError if an 'any' field with an unrecognized
// type is received, and may throw other errors if bad data (e.g. with
// offsets pointing to outside the message length) is received. For safety,
// deserialize should be wrapped in try/catch if the source data is untrusted.

// 'any' fields deserialize automatically if you have the required message
// type set up.
switch (incomingMsg.someAnyMsg.id) {
  case MyMsg.id:
    const msg = incomignMsg.someAnyMsg.value as MyMsg;
    console.log(msg.someString);
  default:
    console.log(`received some other type: ${incomingMsg.someAnyMsg.id}`);
}
```

## Why?

Flatbuffers changed interface forcing me to redo stuff, and the interface was generally frustrating to use. Protobuffers also has an awful interface for Javascript and Typescript. JSON with mixed data types plays pretty poorly with type-safety, and tends to bloat the data with field names. I wanted something I can rely on to not change interface, and with minimal stuff to install.

Striking a balance between a user-friendly interface and decent performance is a little bit tricky. Compromises I made were:
* Serializing serializes strings twice, once into a temporary buffer to measure the utf8 size in bytes, then a second time during actual serialization.
* Serializing and deserializing is on-demand; the 'live' message is made of objects. This makes it easier to work with than flatbuffers' builder pattern, but if you're creating a message solely to send, it's a little less performant.
* The message structure is a fixed shape like a struct.
  * This is *not* cross-version compatible like protobuffers - all clients must be using the same version or they'll get unreadable data.
  * This is oversized for sparse messages with many possible fields.
  * This is fast to serialize and deserialize, and smaller for heavily populated messages.
  * The format is relatively simple.

