const UserInteraction = require('./UserInteraction');
const ViewFragment = require('./ViewFragment');
const Timestamp = require('./Timestamp');

const friendly_start = '00:22:40.350';
const friendly_end = '00:22:45.350';

const ui1 = new UserInteraction('1', friendly_start, friendly_end, 'jake');

test('`constructor` fails with invalid timestamps', () => {
    expect(() => new UserInteraction('1', 'foo', 'bar')).toThrow();
});

test('`videoId`', () => {
    expect(ui1.videoId).toBe('1');
});

test('`playback`', () => {
    expect(ui1.playback).toEqual(new ViewFragment('1', new Timestamp(1360350), new Timestamp(1365350), 'jake'));
});

test('`userId`', () => {
    expect(ui1.userId).toBe('jake');
});