const ViewFragment = require('./ViewFragment');
const Timestamp = require('./Timestamp');

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

const ts3 = new Timestamp(1362350);
const ts4 = new Timestamp(1367350);
const vf2 = new ViewFragment('1', ts3, ts4);

const ts5 = new Timestamp(1360000);
const ts6 = new Timestamp(1360350);
const vf3 = new ViewFragment('1', ts5, ts6);

const ts7 = new Timestamp(1362350);
const ts8 = new Timestamp(1363350);
const vf4 = new ViewFragment('1', ts7, ts8);

test('`overlaps`', () => {
    expect(vf1.overlaps(vf2)).toBe(true);
    expect(vf1.overlaps(vf3)).toBe(false);
});

test('`getCommonFragment`', () => {
    expect(ViewFragment.getCommonFragment(vf1, vf2).duration).toEqual(3000);
    expect(ViewFragment.getCommonFragment(vf1, vf3)).toBeNull();
    expect(ViewFragment.getCommonFragment(vf1, vf4).duration).toEqual(1000);
});