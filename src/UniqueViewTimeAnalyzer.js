const UserInteraction = require('./UserInteraction');
const Timestamp = require('./Timestamp');
const ViewFragment = require('./ViewFragment');

class UniqueViewTimeAnalyzer {
    constructor(input){
        this._interactions = String(input).length > 0 ? this.parseInput(String(input)) : [];
        this._users = null;
    }

    /**
     * Getter for the analysis object - will trigger analysis if it hasn't been run yet.
     * @returns {object}
     */
    get analysis() {
        if(this._users == null) {
            this.runAnalysis();
        }
        return this._users;
    }

    /**
     * Getter for the parsed interactions
     * @returns {Array}
     */
    get interactions() {
        return this._interactions;
    }

    /**
     * Takes the raw input and breaks it up into lines and individual interactions.
     * @param {string} input
     * @returns {UserInteraction[]}
     */
    parseInput(input) {
        let entries = [];
        if (input.trim().indexOf('\n') > -1) {
            let lines = input.trim().split(/\r?\n/);
            lines.forEach((el) => {
                let line = el.trim();
                if(line.length > 0) {
                    entries.push(el.trim());
                }
            });
        } else {
            entries.push(input.trim());
        }

        return entries.map((el) => {
            let columns = el.split(',');
            let video = columns[0].trim();
            let start = columns[1].trim();
            let end = columns[2].trim();
            let user = columns.length === 4 ? columns[3].trim() : 'unnamed';

            return new UserInteraction(video, start, end, user);
        }).sort((el1, el2) => {
            if(el1.playback.start.lt(el2.playback.start)) {
                return -1;
            }
            if(el1.playback.start.gt(el2.playback.start)) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Produces a textual report of the analysis and optionally prints it to the console.
     * @param {boolean} echo
     * @returns {Array}
     */
    generateReport(echo = false) {
        let report = [];
        for(let user in this.analysis) {
            if(this.analysis.hasOwnProperty(user)) {
                report.push(`user: ${user}`);
                for (let vid in this.analysis[user].videos) {
                    if(this.analysis[user].videos.hasOwnProperty(vid)) {
                        report.push(`    video: ${vid}`);
                        report.push(`        UVT: ${this.analysis[user].videos[vid].uvt.toString(false)}`);
                    }
                }
            }
        }

        if(echo) {
            if(report.length > 0) {
                console.log(report.join('\n'));
            } else {
                console.log('Nothing to report!');
            }
        }

        return report;
    }

    /**
     * Crawls the interactions and produces an object containing the unique view time and unique segments per user/video
     * @param analysis_start
     * @param analysis_end
     * @returns {UniqueViewTimeAnalyzer}
     */
    runAnalysis(analysis_start = null, analysis_end = null) {
        let analysis_period_start = analysis_start !== null ? Timestamp.parse(analysis_start) : null;
        let analysis_period_end = analysis_end !== null ? Timestamp.parse(analysis_end) : null;
        let analysis_period = null;
        if(analysis_period_start && analysis_period_end) {
            analysis_period = new ViewFragment(null, analysis_period_start, analysis_period_end);
        }

        let queue = Array.from(this.interactions);
        /* TODO: This could undeniably benefit from being de-anonymized. */
        let users = {};

        while(queue.length > 0) {
            let unqualified_interaction = queue.shift();
            let interaction = null;
            if(analysis_period) {
                if(analysis_period.overlaps(unqualified_interaction.playback)) {
                    let common = ViewFragment.getCommonFragment(analysis_period, unqualified_interaction.playback);
                    interaction = new UserInteraction(unqualified_interaction.videoId, common.start, common.end, unqualified_interaction.userId);
                } else {
                    continue; /* The interaction isn't within the desired range so we skip over it. */
                }
            } else {
                interaction = unqualified_interaction;
            }

            if(!interaction) { continue; }

            /* Since we're building the analysis object on the fly we have to check and add any new
             * user and video keys as we crawl the tree. */
            if(typeof users[interaction.userId] === 'undefined') {
                users[interaction.userId] = {
                    videos: {}
                };
            }
            if(typeof users[interaction.userId].videos[interaction.videoId] === 'undefined') {
                users[interaction.userId].videos[interaction.videoId] = {
                    uvt: 0,
                    viewed: [[interaction.playback.start, interaction.playback.end]]
                };
                /* If we're here then this is the first fragment of the video and a guaranteed unique range
                 * so we can skip the rest of the loop. */
                continue;
            }

            let video = users[interaction.userId].videos[interaction.videoId];

            let is_merged = false;
            for (let i = 0; i < video.viewed.length; i++) {
                let current = video.viewed[i];

                if((interaction.playback.start.gte(current[0]) && interaction.playback.end.lte(current[1]))) {
                    /* Already represented by a viewed range */
                    is_merged = true;
                    break;
                } else if(interaction.playback.start.lte(current[1]) && interaction.playback.end.gt(current[1])) {
                    video.viewed[i][1] = interaction.playback.end;
                    is_merged = true;
                    break;
                }
            }

            if(!is_merged) {
                /* The fragment isn't an extension of or contained in a currently identified range so we add it as new */
                video.viewed.push([interaction.playback.start, interaction.playback.end])
            }
        }


        for(let user in users) {
            if(users.hasOwnProperty(user)) {
                for (let vid in users[user].videos) {
                    if (users[user].videos.hasOwnProperty(vid)) {
                        let uvt = users[user].videos[vid].viewed.reduce((tally, next) => {
                            return tally + (next[1].diff(next[0]));
                        }, 0);
                        users[user].videos[vid].uvt = new Timestamp(uvt);
                    }
                }
            }
        }

        /* Save the analysis to the instance. */
        this._users = users;

        /* Return the instance for chaining */
        return this;
    }

    /**
     * Shorthand factory method to create a `UniqueViewTimeAnalyzer` and analyze the input.
     * @param {string} input
     * @param analysis_range_start
     * @param analysis_range_end
     * @returns {UniqueViewTimeAnalyzer}
     */
    static analyze(input, analysis_range_start = null, analysis_range_end = null){
        let instance = new UniqueViewTimeAnalyzer(input);
        return instance.runAnalysis(analysis_range_start, analysis_range_end);
    }
}

module.exports = UniqueViewTimeAnalyzer;