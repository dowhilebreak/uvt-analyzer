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
     * Finds if the passed fragment is entirely contained within the range of the current instance
     * @param fragment
     * @returns {boolean}
     */
    contains(fragment) {
        if(!(fragment instanceof ViewFragment)) {
            throw new Error('`contains` expects an argument of type `Fragment`.');
        }
        return (this.start.lte(fragment.start) && this.end.gte(fragment.end));
    }

    /**
     * Finds if the passed fragment has a range that overlaps the current instance
     * @param fragment
     * @returns {boolean}
     */
    overlaps(fragment) {
        if(!(fragment instanceof ViewFragment)) {
            throw new Error('`contains` expects an argument of type `Fragment`.');
        }

        return (
            (fragment.start.gte(this.start) && fragment.start.lt(this.end)) ||
            (fragment.end.lte(this.end) && fragment.end.gt(this.start))
        );
    }

    /**
     * Returns a new ViewFragment containing any time range shared by the arguments;
     * @param fragment1
     * @param fragment2
     * @returns {ViewFragment|null}
     */
    static getCommonFragment(fragment1, fragment2) {
        if(!fragment1.overlaps(fragment2)) {
            return null;
        }

        let start = fragment1.start.gte(fragment2.start) ? fragment1.start : fragment2.start;
        let end = fragment1.end.gte(fragment2.end) ? fragment2.end : fragment1.end;

        return new ViewFragment(fragment1.videoId || fragment2.videoId, start, end);
    }

}

module.exports = ViewFragment;