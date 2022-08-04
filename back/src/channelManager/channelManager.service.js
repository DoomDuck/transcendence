"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChannelManagerService = exports.Channel = void 0;
var common_1 = require("@nestjs/common");
var Channel = /** @class */ (function () {
    function Channel(channelId, name, priv, protect, password, creator) {
        this.channelId = channelId;
        this.name = name;
        this.priv = priv;
        this.protect = protect;
        this.password = password;
        this.creator = creator;
        this.name = name;
        this.priv = priv;
        this.protect = protect;
        this.password = password;
        this.admin = [];
        this.member = [];
        this.admin.push(creator);
        this.member.push(creator);
        this.creator = creator;
    }
    return Channel;
}());
exports.Channel = Channel;
var ChannelManagerService = /** @class */ (function () {
    function ChannelManagerService() {
        this.arrayChannel = [];
    }
    ChannelManagerService.prototype.createChan = function (channelDto) {
        var found = this.arrayChannel.find(function (channel) { return channel.name === channelDto.name; });
        if (found === undefined) {
            if (this.arrayChannel === [])
                this.arrayChannel.push(new Channel(1, channelDto.name, channelDto.priv, channelDto.protec, channelDto.password, channelDto.creator));
            else {
                this.arrayChannel.push(new Channel(this.arrayChannel.length + 1, channelDto.name, channelDto.priv, channelDto.protec, channelDto.password, channelDto.creator));
            }
            return true;
        }
        else
            return false;
    };
    ChannelManagerService.prototype.findChanOne = function (chanName) {
        var tempChan = this.arrayChannel.find(function (element) { return element.name === chanName; });
        if (tempChan === undefined)
            return 'channel not found';
        else
            return tempChan;
    };
    ChannelManagerService.prototype.findChanAll = function () {
        if (this.arrayChannel === [])
            return 'no channel at all';
        else
            return this.arrayChannel;
    };
    //Return string is placeholder
    ChannelManagerService.prototype.joinChan = function (sender, channelId, password) {
        var tempChan = this.arrayChannel.find(function (element) { return element.channelId === channelId; });
        if (tempChan === undefined)
            return "chan doesn't exist";
        if (tempChan.member.find(function (element) { return element === sender; }))
            return 'user already in chan';
        // if(tempChan.banned.find(element => element == sender)!=undefined)
        // return "user is banned from this chan";
        if (tempChan.priv)
            return 'chan is privated';
        if (tempChan.protect) {
            if (password != tempChan.password)
                return 'wrong password';
        }
        tempChan.member.push(sender);
        return 'user added';
    };
    ChannelManagerService.prototype.setPrivate = function (sender, chanName) {
        var tempChan = this.arrayChannel.find(function (element) { return element.name === chanName; });
        if (tempChan === undefined)
            return "chan doesn't exist";
        if (tempChan.admin.find(function (element) { return element === sender; }) === undefined)
            return 'insuficient permission';
        tempChan.priv = true;
        return 'private mode set';
    };
    ChannelManagerService.prototype.setPassword = function (sender, chanName, password) {
        var tempChan = this.arrayChannel.find(function (element) { return element.name === chanName; });
        if (tempChan === undefined)
            return "chan doesn't exist";
        if (tempChan.admin.find(function (element) { return element === sender; }) === undefined)
            return 'insuficient permission';
        tempChan.protect = true;
        tempChan.password = password;
        return 'password set';
    };
    ChannelManagerService.prototype.setNewAdmin = function (sender, target, chanName) {
        var tempChan = this.arrayChannel.find(function (element) { return element.name === chanName; });
        if (tempChan === undefined)
            return "chan doesn't exist";
        if (tempChan.admin.find(function (element) { return element === sender; }) === undefined)
            return 'insuficient permission';
        if (tempChan.admin.find(function (element) { return element === target; }) != undefined)
            return 'target already admin';
        tempChan.admin.push(target);
        return 'new admin added ';
    };
    ChannelManagerService.prototype.getRoomName = function (channelId) {
        var tempChan = this.arrayChannel.find(function (element) { return element.channelId === channelId; });
        if (tempChan) {
            return tempChan.name;
        }
        return undefined;
    };
    //Send invitation
    ChannelManagerService.prototype.sendMessageToChannel = function (wss, messageInfo) {
        var tempChan = this.arrayChannel.find(function (channel) { return channel.channelId == messageInfo.channelId; });
        if (tempChan) {
            if (tempChan.member.find(function (member) { return member === messageInfo.sender; }) !=
                undefined)
                wss.to(tempChan.name).emit('userToChannel', messageInfo);
        }
    };
    ChannelManagerService = __decorate([
        (0, common_1.Injectable)()
    ], ChannelManagerService);
    return ChannelManagerService;
}());
exports.ChannelManagerService = ChannelManagerService;
