"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = () => {
    const Dates = new Date();
    const Year = Dates.getFullYear();
    const Months = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
    const Day = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    const Hours = Dates.getHours() < 10 ? '0' + Dates.getHours() : Dates.getHours();
    const Minutes = Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();
    const Seconds = Dates.getSeconds() < 10 ? '0' + Dates.getSeconds() : Dates.getSeconds();
    return Year + '-' + Months + '-' + Day + '-' + Hours + ':' + Minutes + ':' + Seconds;
};
