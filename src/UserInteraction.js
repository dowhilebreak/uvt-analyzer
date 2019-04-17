const ViewFragment = require('./ViewFragment');
const Timestamp = require('./Timestamp');

class UserInteraction {
    constructor(video_id, play_start, play_end, user_id = '1') {
        this._video_id = video_id;
        this._user_id = user_id;

        let start_ts = play_start instanceof Timestamp ? play_start : Timestamp.parse(play_start);
        let end_ts = play_end instanceof Timestamp ? play_end : Timestamp.parse(play_end);

        if(start_ts === null || end_ts === null) {
            throw new Error('Playback start and end must be valid timestamps.')
        }

        this._viewedFragment = new ViewFragment(video_id, start_ts, end_ts);
    }

    /**
     * Getter for the instance's video ID
     * @returns {string}
     */
    get videoId() {
        return this._video_id;
    }

    /**
     * Getter for the instance's user ID
     * @returns {string}
     */
    get userId() {
        return this._user_id;
    }

    /**
     * Getter for the instance's ViewFragment
     * @returns {ViewFragment}
     */
    get playback() {
        return this._viewedFragment;
    }
}

module.exports = UserInteraction;