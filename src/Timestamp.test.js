const Timestamp = require('./Timestamp');

const ts1 = new Timestamp(1360350);
const ts2 = new Timestamp(1360500);
const ts3 = new Timestamp(1360350);

const friendly_timestamp = '00:22:40.350';

test('`gte`', () => {
    expect(ts1.gte(ts2)).toBe(false);
    expect(ts2.gte(ts1)).toBe(true);
    expect(ts1.gte(ts3)).toBe(true);
});

test('`gt`', () => {
    expect(ts1.gt(ts2)).toBe(false);
    expect(ts2.gt(ts1)).toBe(true);
    expect(ts1.gt(ts3)).toBe(false);
});

test('`lt`', () => {
    expect(ts1.lt(ts2)).toBe(true);
    expect(ts2.lt(ts1)).toBe(false);
    expect(ts1.lt(ts3)).toBe(false);
});

test('`lte`', () => {
    expect(ts1.lte(ts2)).toBe(true);
    expect(ts2.lte(ts1)).toBe(false);
    expect(ts1.lte(ts3)).toBe(true);
});

test('`eq`', () => {
    expect(ts1.eq(ts2)).toBe(false);
    expect(ts1.eq(ts3)).toBe(true);
});

test('`diff`', () => {
    expect(ts2.diff(ts1)).toBe(150);
});

test('`sum`', () => {
    expect(ts1.sum(ts2)).toBe(2720850);
});

test('`fromString` produces the same results as constructor', () => {
    expect(ts1.eq(Timestamp.fromString(friendly_timestamp))).toBe(true);
});

test('`parse` is an alias of `fromString`', () => {
    expect(Timestamp.parse(friendly_timestamp).eq(Timestamp.fromString(friendly_timestamp))).toBe(true);
});

test('`toParts`', () => {
    expect(Timestamp.toParts(1360350)).toEqual({ hours: 0, minutes: 22, seconds: 40, milliseconds: 350});
});

test('`getMilliseconds`', () => {
    expect(Timestamp.getMilliseconds(.350, 40, 22, 0)).toBe(1360350);
});

test('`toString`', () => {
    expect(ts1.toString(false)).toBe('1360350');
    expect(ts1.toString(true)).toBe('00:22:40.350');
});
