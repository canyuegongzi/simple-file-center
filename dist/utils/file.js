"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.fileType = (file) => {
    const typeList = file.originalname.split('.');
    const type = typeList.length ? typeList[typeList.length - 1] : '';
    let dir;
    if (/\.(png|jpe?g|gif|svg)(\?\S*)?$/.test(file.originalname)) {
        dir = 'images';
    }
    else if (/\.(mp3)(\?\S*)?$/.test(file.originalname)) {
        dir = 'audio';
    }
    else if (/\.mp4|avi/.test(file.originalname)) {
        dir = 'video';
    }
    else if (/\.(doc|txt)(\?\S*)?$/.test(file.originalname)) {
        dir = 'doc';
    }
    else {
        dir = 'other';
    }
    return dir;
};
function getStat(p) {
    return new Promise((resolve, reject) => {
        fs.stat(p, (err, stats) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(stats);
            }
        });
    });
}
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.dirExists = (dir) => __awaiter(this, void 0, void 0, function* () {
    const isExists = yield getStat(dir);
    if (isExists && isExists.isDirectory()) {
        return true;
    }
    else if (isExists) {
        return false;
    }
    const tempDir = path.parse(dir).dir;
    const status = yield exports.dirExists(tempDir);
    let mkdirStatus;
    if (status) {
        mkdirStatus = yield mkdir(dir);
    }
    return mkdirStatus;
});
