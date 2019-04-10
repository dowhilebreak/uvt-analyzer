const UvtAnalyzer = require('./UniqueViewTimeAnalyzer');

const input = `
    1,00:32.052,00:47.179
    1,00:10.15,00:15.552
    1,00:12.375,00:14.0
    1,00:45.0,00:60.758
`; /* UVT = 34108 */


test('`constructor`', () => {
    let uvta = new UvtAnalyzer('');
    expect(uvta.interactions).toHaveLength(0);
    expect(uvta._users).toBeNull();
});

test('`analysis`', () => {
    let uvta = new UvtAnalyzer(input);
    expect(uvta._users).toBeNull();
    let analysis = uvta.analysis;
    expect(uvta._users).toEqual(analysis);
});

test('`interactions`', () => {
    expect((new UvtAnalyzer(input)).interactions).toHaveLength(4);
});

test('`parseInput`', () => {
    let uvta = new UvtAnalyzer('');
    let parsed = uvta.parseInput(input);
    expect(parsed).toHaveLength(4);
});

test('`generateReport`', () => {
    let uvta = UvtAnalyzer.analyze(input);
    let output = uvta.generateReport();
    let expected = `user: unnamed\n    video: 1\n        UVT: 34108`;
    expect(output.join('\n')).toBe(expected);
});

test('`runAnalysis`', () => {
    let uvta = new UvtAnalyzer(input);
    expect(uvta.interactions).toHaveLength(4);
    expect(uvta.runAnalysis()).toBeDefined();
    expect(uvta._users['unnamed'].videos).toBeDefined();
    expect(uvta._users['unnamed'].videos['1'].uvt.milliseconds).toBe(34108);
    expect(uvta._users['unnamed'].videos['1'].viewed).toHaveLength(2);
    expect(uvta.interactions).toHaveLength(4); /* We didn't accidentally empty the interactions array. */
});

test('`UniqueViewTimeAnalyzer.analyze`', () => {
    let uvta = UvtAnalyzer.analyze(input);
    expect(uvta).toBeInstanceOf(UvtAnalyzer);
    expect(uvta._users).not.toBeNull();
    expect(uvta.interactions).toHaveLength(4);
});

/* The following are a bunch of value tests to sanity check UVT calculations against a variety of configurations.
 * This is admittedly not a conceptually great test, but it was very helpful to identify when values shifted
 * unexpectedly. */

const input2 = `
    2, 00:45, 00:60.758
    2, 00:32.052, 00:47.179
    2, 00:12.375, 00:14
    2, 00:10.15, 00:15.552
`; /* UVT = 34108 */

const input5 = `
    5, 00:45, 00:60.758
    5, 00:32.052, 00:47.179
    5, 00:12.375, 00:14
    5, 00:10.15, 00:15.552
    5, 00:10.15, 00:15.552
`; /* UVT = 34108 */

const input6 = `
    6,03:03.365,03:40.038
    6,00:29.931,00:50.882
    6,00:39.555,01:07.243
    6,12:00.847,18:01.270
    6,13:57.719,22:20.350
    6,01:28.847,02:22.155
    6,20:13.905,38:26.419
    6,03:24.259,06:07.666
    6,11:04.264,21:02.101
`; /* UVT = 1917076 */

const input7 = `
    7,12:00.847,18:01.270
    7,13:57.719,22:20.350
    7,11:04.264,21:02.101
`; /* UVT = 676086 */

const input8 = `
    8,11:04.264,21:02.101
    8,12:00.847,18:01.270
    8,13:57.719,22:20.350
`; /* UVT = 676086 */

const input9 = `
    9,13:57.719,22:20.350
    9,11:04.264,21:02.101
    9,12:00.847,18:01.270
`; /* UVT = 676086 */

const input10 = `
    10,12:00.847,18:01.270
    10,13:57.719,22:20.350
    10,11:04.264,21:02.101
    10,21:01.719,22:40.350
`; /* UVT = 696086 */

test('UVT calculations', () => {
    let uvta2 = UvtAnalyzer.analyze(input.concat(input2, input5, input6, input7, input8, input9, input10)).analysis;
    let videos = uvta2['unnamed'].videos;
    expect(videos['1'].uvt.milliseconds).toBe(34108);
    expect(videos['2'].uvt.milliseconds).toBe(34108);
    expect(videos['5'].uvt.milliseconds).toBe(34108);
    expect(videos['6'].uvt.milliseconds).toBe(1917076);
    expect(videos['7'].uvt.milliseconds).toBe(676086);
    expect(videos['8'].uvt.milliseconds).toBe(676086);
    expect(videos['9'].uvt.milliseconds).toBe(676086);
    expect(videos['10'].uvt.milliseconds).toBe(696086);
});