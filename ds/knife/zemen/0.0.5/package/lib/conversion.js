/**
 * @author መሃሪ <gmehari.edu@gmail.com>
 * @on APR 10 2017 , ነሃሴ 4 2009  ዓ/ም
 * Adopted from http://www.geez.org/Calendars/EthiopicCalendar.java
 */

const JD_EPOCH_OFFSET_AMETE_ALEM = -285019; //      ዓ/ዓ    
const JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856; //    ዓ/ም
const JD_EPOCH_OFFSET_GREGORIAN = 1721426;
const JD_EPOCH_OFFSET_UNSET = -1;

let JDN_OFFSET = JD_EPOCH_OFFSET_UNSET;
require('./apt');
const GREGORIAN_NUMBER_OF_MONTHS = 12;
const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** ERA HELPERS */
function setEra(era) {
    if ((era === JD_EPOCH_OFFSET_AMETE_ALEM) || (era === JD_EPOCH_OFFSET_AMETE_MIHRET)) {
        JDN_OFFSET = era;
    } else {
        throw (new Error("Unknown Era:", era));
    }
}

function isEraSet() {
    return (JD_EPOCH_OFFSET_UNSET === JDN_OFFSET) ? false : true;
}

function unsetEra() {
    JDN_OFFSET = JD_EPOCH_OFFSET_UNSET;
}

function guessEraFromJDN(jdn) {
    return (jdn >= (JD_EPOCH_OFFSET_AMETE_MIHRET + 365)) ?
        JD_EPOCH_OFFSET_AMETE_MIHRET : JD_EPOCH_OFFSET_AMETE_ALEM;
}

/** CONVERSION **/
function ethiopicToJDN(day, month, year) {
    let ERA = isEraSet() ? JDN_OFFSET : JD_EPOCH_OFFSET_AMETE_MIHRET;
    let jdn = (ERA + 365) +
        365 * (year - 1) +
        quotient(year, 4) +
        30 * month +
        day - 31;

    return jdn;
}

function jdnToEthiopic(jdn) {
    let ERA = isEraSet() ? JDN_OFFSET : guessEraFromJDN(jdn);
    let r = mod((jdn - ERA), 1461);
    let n = mod(r, 365) + 365 * quotient(r, 1460);
    let year = 4 * quotient((jdn - ERA), 1461) +
        quotient(r, 365) -
        quotient(r, 1460);
    let month = quotient(n, 30) + 1;
    let day = mod(n, 30) + 1;

    return [year, month, day];
}

function gregorianToJDN(day, month, year) {
    let s = quotient(year, 4) -
        quotient(year - 1, 4) -
        quotient(year, 100) +
        quotient(year - 1, 100) +
        quotient(year, 400) -
        quotient(year - 1, 400);

    let t = quotient(14 - month, 12);

    let n = 31 * t * (month - 1) +
        (1 - t) * (59 + s + 30 * (month - 3) + quotient((3 * month - 7), 5)) +
        day - 1;

    let j = JD_EPOCH_OFFSET_GREGORIAN +
        365 * (year - 1) +
        quotient(year - 1, 4) -
        quotient(year - 1, 100) +
        quotient(year - 1, 400) +
        n;

    return j;
}

function jdnToGregorian(jdn) {
    let r2000 = mod((jdn - JD_EPOCH_OFFSET_GREGORIAN), 730485);
    let r400 = mod((jdn - JD_EPOCH_OFFSET_GREGORIAN), 146097);
    let r100 = mod(r400, 36524);
    let r4 = mod(r100, 1461);
    let n = mod(r4, 365) + 365 * quotient(r4, 1460);
    let s = quotient(r4, 1095);
    let aprime = 400 * quotient((jdn - JD_EPOCH_OFFSET_GREGORIAN), 146097) +
        100 * quotient(r400, 36524) +
        4 * quotient(r100, 1461) +
        quotient(r4, 365) -
        quotient(r4, 1460) -
        quotient(r2000, 730484);
    let year = aprime + 1;
    let t = quotient((364 + s - n), 306);
    let month = t * (quotient(n, 31) + 1) + (1 - t) * (quotient((5 * (n - s) + 13), 153) + 1);
    n += 1 - quotient(r2000, 730484);
    let day = n;


    if ((r100 === 0) && (n === 0) && (r400 !== 0)) {
        month = 12;
        day = 31;
    } else {
        monthDays[2] = (isGregorianLeap(year)) ? 29 : 28;
        for (let i = 1; i <= GREGORIAN_NUMBER_OF_MONTHS; ++i) {
            if (n <= monthDays[i]) {
                day = n;
                break;
            }
            n -= monthDays[i];
        }
    }
    return [year, month, day];

}

function gregorianToEthiopic(day, month, year) {
    let jdn = gregorianToJDN(day, month, year);
    return jdnToEthiopic(jdn);
}

function ethioipicToGreg(day, month, year) {
    if (!isEraSet()) {
        if (year <= 0) {
            setEra(JD_EPOCH_OFFSET_AMETE_ALEM);
        } else {
            setEra(JD_EPOCH_OFFSET_AMETE_MIHRET);
        }
    }
    let jdn = ethiopicToJDN(day, month, year);
    return jdnToGregorian(jdn);
}

function ethioipicToGregorian(day, month, year, era) {
    setEra(era);
    let result = ethioipicToGreg(day, month, year);
    unsetEra();
    return result;
}

/** HELPERS **/
function quotient(i, j) {
    return Math.floor(i / j);
}

function mod(i, j) {
    return i % j;
}

function isGregorianLeap(year) {
    return (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0));
}



/** API **/

/** ethiopian to gregorian */
function toGC(dateArray) {
    let [y, m, d, era] = dateArray;
    if (d < 0 || d > 30 || m < 0 || m > 13) {
        throw new Error('Invalid Ethiopian Date');
    }
    if (!era) {
        era = JD_EPOCH_OFFSET_AMETE_MIHRET;
    }
    return ethioipicToGregorian(d, m, y, era);
}

/** gregorian to ethiopian */
function toEC(dateArray) {
    let [y, m, d] = dateArray;
    if (d < 0 || d > 31 || m < 0 || m > 12) {
        throw new Error('Invalid Gregorian Date');
    }
    return gregorianToEthiopic(d, m, y);
}



module.exports.toGC = toGC;
module.exports.toEC = toEC;