const Converter = require('./ conversion');
const Formatter = require('./formating');
const Util = require('./util');
/**
 * @class Zemen
 */
class Zemen {

    /**
     * @param {number} val - A numeric year value if the second and third parameters ar provided,
     *                                        It should be a date string if not  
     * @param { Number } month A zero-based numeric value for the month (0 for መስከረም, 12 for ጳጉሜን)
     * @param { Number } day A numeric value equal for the day of the month.
     */
    constructor(val, month, day) {
        if (arguments.length === 0) {
            let ahun = Zemen.toEC(new Date());
            [this.year, this.month, this.date] = [ahun.getFullYear(), ahun.getMonth(), ahun.getDate()];
            this._gc = Zemen.toGC(this.year, this.month, this.date);

        } else if (arguments.length === 1) {
            if (typeof (val) === 'string') {
                let result = Zemen.parse(val);
                [this.year, this.month, this.date] = [result.getFullYear(), result.getMonth(), result.getDate()];
                this._gc = Zemen.toGC(this.year, this.month, this.date);
            }
            else if (typeof val === 'object' && val instanceof Date) {
                let result = Zemen.toEC(val.getFullYear(), val.getMonth() + 1, val.getDate());
                [this.year, this.month, this.date] = [result.getFullYear(), result.getMonth(), result.getDate()]
                this._gc = Zemen.toGC(this.year, this.month, this.date);
            }

            else {
                return new Error('Invalid Argument Exception');
            }
        } else if (arguments.length === 3) {
            this.year = parseInt(val);
            this.month = parseInt(month);
            this.date = parseInt(day);
            this._gc = Zemen.toGC(this.year, this.month + 1, this.date);
        } else {
            return new Error('Invalid Argument Exception');
        }


    }

    /**
     * Converts a Ethiopian date to Gregorian and returns Date instance representing Gregorian Date.
     * @param { String | Number  } val - A numeric year value if the second and third parameters ar provided,
     *                                        It should be a date string if not  
     * @param { Number } month A zero-based numeric value for the month (0 for January, 11 for December)
     * @param { Number } day A numeric value equal for the day of the month.
     * @return { Date}
     * @api public
     */
    static toGC(val, month, day) {
        let gc;
        if (arguments.length === 1) {
            if (typeof (val) === 'string') {
                let etDate = new Zemen(val);
                gc = Converter.toGC([etDate.getFullYear(), etDate.getMonth() + 1, etDate.getDate()]);
            }
            else if (typeof val === 'object' && val instanceof Zemen) {
                let [y, m, d] = [val.getFullYear(), val.getMonth() + 1, val.getDate()]
                gc = Converter.toGC([y, m, d]);
            }
            else {
                return new Error('Invalid Argument Exception');
            }
        } else if (arguments.length === 3) {
            gc = Converter.toGC([val, month + 1, day]);
        } else {
            return new Error('Invalid Argument Exception');
        }
        if (gc) {
            return new Date(gc[0], gc[1] - 1, gc[2]);
        } else {
            return new Error('Invalid Argument Exception');
        }

    }

    /**
     * Converts a Gregorian date to Ethiopian and returns Zemen instance representing Ethiopian Date.
     * @param { String | Number | Date } val - A numeric year value if the second and third parameters ar provided,
     *                                         It should be  either a date string or a Date object if not  
     * @param { Number } month A zero-based numeric value for the month (0 for January, 11 for December)
     * @param { Number } day A numeric value equal for the day of the month.
     * @return {Zemen}
     * @api public
     */
    static toEC(val, month, day) {
        let ec;
        if (arguments.length === 1) {
            if (typeof (val) === 'string') {
                let gcDate = new Date(val); // will use native date parsing
                ec = Converter.toEC([gcDate.getFullYear(), gcDate.getMonth() + 1, gcDate.getDate()]);
            } else if (typeof val === 'object' && val instanceof Date) {
                let [y, m, d] = [val.getFullYear(), val.getMonth() + 1, val.getDate()]
                ec = Converter.toEC([y, m, d]);
            } else {
                return new Error('Invalid Argument Exception');
            }
        } else if (arguments.length === 3) {
            ec = Converter.toEC([val, month + 1, day]);
        } else {
            return new Error('Invalid Argument Exception');
        }
        if (ec) {
            return new Zemen(ec[0], ec[1] - 1, ec[2]);
        } else {
            return new Error('Invalid Argument Exception');
        }
    }


    /**
     * Parses a string containing a date, and returns an array [year,month,date].
     * @param {String} dateString A date string with delimiter
     */
    static parse(dateString, pattern) {
        if (!dateString) {
            return "";
        }
        if (!pattern) {
            let result = dateString.split("-");
            if (result.length === 3) {
                let [y, m, d] = result;
                return new Zemen(y, m - 1, d);
            } else {
                throw new Error(`ParsingError: Can't parse ${dateString}`)
            }
        } else {
            throw new Error('Not implemented Exception :(');
        }

    }

    /**
     * returns formated string for zemen instance 
     */
    format(pattern) {
        return Formatter.format(this, pattern);
    }

    toString() {
        return `${this.year}-${this.month + 1}-${this.date}`;
    }

    getDate() {
        return this.date;
    }
    getMonth() {
        return this.month;
    }
    getFullYear() {
        return this.year;
    }
    getMonthName() {
        return Util.MONTHS_NAMES[this.month];
    }
    getShortMonthName() {
        return Util.SHORT_MONTHS_NAMES[this.month];
    }
    getDayOfWeek() {
        let weekDay = this.getGCWeekDay();
        return Util.WEEK_NAMES[weekDay];
    }

    getGCWeekDay() {
        return this._gc.getDay();
    }

}

module.exports = Zemen;