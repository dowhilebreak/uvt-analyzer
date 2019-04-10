const ViewFragment = require('./ViewFragment');
const Timestamp = require('./Timestamp');

const friendly_start = '00:22:40.350';
const friendly_end = '00:22:45.350';

const ts1 = new Timestamp(1360350);
const ts2 = new Timestamp(1365350);

const vf1 = new ViewFragment('1', ts1, ts2);

test('`constructor` invalid arguments', () => {
    expect(() => new ViewFragment('1', 'foo', 'bar')).toThrow();
});

test('`videoId`', () => {
    expect(vf1.videoId).toBe('1');
});

test('`start`', () => {
    expect(vf1.start).toEqual(ts1);
});

test('`end`', () => {
    expect(vf1.end).toEqual(ts2);
});

test('`duration`', () => {
    expect(vf1.duration).toEqual(5000);
});