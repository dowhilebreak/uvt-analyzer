const Timestamp = require('./Timestamp');

class ViewFragment {
    constructor(video_id, play_start, play_end) {
        if(!(play_start instanceof Timestamp) || !(play_end instanceof Timestamp)) {
            throw new Error('`Fragment` constructor expects `play_start` and `play_end` to be of type `Timestamp`.');
        }
        this._start = play_start;
        this._end = play_end;
        this._video_id = video_id;
    }

    get videoId() {
        return this._video_id;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    get duration() {
        return this.end.diff(this.start);
    }

    /**
     * TODO: not currently used
     * @param fragment
     * @returns {boolean}
     */
    contains(fragment) {
        if(!(fragment instanceof Fragment)) {
            throw new Error('`contains` expects an argument of type `Fragment`.');
        }
        return (this.start.lte(fragment.start) && this.end.gte(fragment.end));
    }

    /**
     * TODO: not currently used
     * @param fragment
     * @returns {boolean}
     */
    overlaps(fragment) {
        if(!(fragment instanceof Fragment)) {
            throw new Error('`contains` expects an argument of type `Fragment`.');
        }

        return (
            (fragment.start.gte(this.start) && fragment.start.lt(this.end)) ||
            (fragment.end.lt(this.end) && fragment.end.gt(this.start))
        );
    }

}

module.exports = ViewFragment;