const SECOND_MULTIPLIER = 1000;
const MINUTE_MULTIPLIER = (SECOND_MULTIPLIER*60);
const HOUR_MULTIPLIER = (MINUTE_MULTIPLIER*60);

/**
 * Basic timestamp handler for untethered times (no associated date or timezone).
 */
class Timestamp {
    static get MIN() { return 0; }
    static get MAX() { return 21600000; } /* Semi-arbitrary cap of 6 hours just for sanity. */

    constructor(milliseconds = 0) {
        if(!Number.isInteger(milliseconds) || milliseconds < Timestamp.MIN || milliseconds > Timestamp.MAX) {
            throw new Error(`Timestamp must be between ${Timestamp.MIN} and ${Timestamp.MAX}`);
        }
        this._value = milliseconds;
    }

    /**
     * Getter for the underlying millisecond value of this timestamp.
     * @returns {integer}
     */
    get milliseconds() {
        return this._value;
    }

    /**
     * Take a string in either integer millisecond or friendly format and manufacture a Timestamp
     * @param {String} string
     * @returns {null|Timestamp}
     */
    static fromString(string) {
        let numeric = /^(0|[1-9][0-9]*)$/;
        let formatted = /^(([0-9]{2}):)?([0-9]{2}):([0-9]{2})(\.([0-9]{1,3}))?$/;
        let value = -1;

        if(numeric.test(string)) {
            value = Number.parseInt(string);
        } else {
            let pieces = formatted.exec(string);
            if(pieces !== null) {
                let hours = Number.parseInt(pieces[2] || 0);
                let minutes = Number.parseInt(pieces[3] || 0);
                let seconds = Number.parseInt(pieces[4] || 0);
                let ms = Number.parseFloat(pieces[5] || 0);
                value = Timestamp.getMilliseconds(ms, seconds, minutes, hours);
            }
        }

        if(value >= Timestamp.MIN && value <= Timestamp.MAX) {
            return new Timestamp(value);
        }

        return null;
    }

    /**
     * Alias of `fromString`
     * @param {String} string
     * @returns {(Timestamp|null)}
     */
    static parse(string) {
        return Timestamp.fromString(string);
    }

    /**
     * Determine if the current instance is superficially equal (representing the same time point) as `compare_to`
     * @param {Timestamp} compare_to
     * @returns {boolean}
     */
    eq(compare_to) {
        return this.milliseconds === compare_to.milliseconds;
    }

    /**
     * Determine if the current instance is greater-than (`>`) `compare_to`
     * @param {Timestamp} compare_to
     * @returns {boolean}
     */
    gt(compare_to) {
        return this.milliseconds > compare_to.milliseconds;
    }

    /**
     * Determine if the current instance is greater-than or equal-to (`>=`) `compare_to`
     * @param {Timestamp} compare_to
     * @returns {boolean}
     */
    gte(compare_to) {
        return this.milliseconds >= compare_to.milliseconds;
    }

    /**
     * Determine if the current instance is less-than (`<`) `compare_to`
     * @param {Timestamp} compare_to
     * @returns {boolean}
     */
    lt(compare_to) {
        return this.milliseconds < compare_to.milliseconds;
    }

    /**
     * Determine if the current instance is less-than or equal-to (`<=`) `compare_to`
     * @param {Timestamp} compare_to
     * @returns {boolean}
     */
    lte(compare_to) {
        return this.milliseconds <= compare_to.milliseconds;
    }

    /**
     * Find the millisecond difference (subtraction) between this instance and `subtrahend`
     * @param {Timestamp} subtrahend
     * @returns {number}
     */
    diff(subtrahend) {
        return this.milliseconds - subtrahend.milliseconds;
    }

    /**
     * Find the millisecond sum (addition) of this instance and `addend`
     * @param {Timestamp} addend
     * @returns {*}
     */
    sum(addend) {
        return this.milliseconds + addend.milliseconds;
    }


    /**
     * Render the value of this instance as either a formatted time or as milliseconds.
     * @param {boolean} friendly defaults to `true` - outputs the value as a formatted time
     * @returns {string}
     */
    toString(friendly = true) {
        if(friendly) {
            let parts = Timestamp.toParts(this.milliseconds);
            const PADCHAR = '0';
            const PADLENGTH = 2;
            let hours = parts.hours.toString().padStart(PADLENGTH, PADCHAR);
            let minutes = parts.minutes.toString().padStart(PADLENGTH, PADCHAR);
            let seconds = parts.seconds.toString().padStart(PADLENGTH, PADCHAR);
            let ms = parts.milliseconds.toString().padStart(3, PADCHAR);

            let result = `${hours}:${minutes}:${seconds}`;
            result += parts.milliseconds > 0 ? `.${ms}` : '';
            return result;
        }

        return this.milliseconds.toString();
    }

    /**
     * Calculates hours, minutes, seconds and milliseconds from the passed millisecond value
     * @param milliseconds
     * @returns {object} an anonymous object containing the hours, minutes, seconds and milliseconds
     */
    static toParts(milliseconds) {
        let value = milliseconds;
        let parts = {};
        parts.hours   = Math.floor(value / HOUR_MULTIPLIER);
        value = (value % HOUR_MULTIPLIER);
        parts.minutes = Math.floor(value / MINUTE_MULTIPLIER);
        value = value % MINUTE_MULTIPLIER;
        parts.seconds = Math.floor(value / SECOND_MULTIPLIER);
        value = value % SECOND_MULTIPLIER;
        parts.milliseconds = (value % SECOND_MULTIPLIER);
        return parts;
    }

    /**
     * Calculate the millisecond value from the human-readable arguments
     * @param {float} ms - the decimal remainder from a formatted time
     * @param {integer} seconds
     * @param {integer} minutes
     * @param {integer} hours
     * @returns {number}
     */
    static getMilliseconds(ms, seconds = 0, minutes = 0, hours = 0) {
        if(Number(ms) === ms && Number.isInteger(seconds) && Number.isInteger(minutes) && Number.isInteger(hours)) {
            let result = 0;
            result += seconds * SECOND_MULTIPLIER;
            result += minutes * MINUTE_MULTIPLIER;
            result += hours * HOUR_MULTIPLIER;
            result += ms * SECOND_MULTIPLIER;

            return result;
        }

        throw new Error(`All time segments must be integers. Received: [${ms}, ${seconds}, ${minutes}, ${hours}]`);
    }
}

module.exports = Timestamp;