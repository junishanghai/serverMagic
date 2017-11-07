// vim:ts=4:sts=4:sw=4:
/*!
 * serverMagic.js
 *
 * Copyright 2017 Jun.I under the terms of the MIT
 *
 * Magic tool module implements for webPack
 * for node.js server side
 */
"use strict";
//let moment = require('moment');
//require('moment/locale/zh-cn');
//moment.locale('zh-ch');
    let _ = require('lodash');

    /** serverMagic **/
    /** serverMagic **/
    var serverMagic = (function() {
        function _ServerMagic() {
            this.id = Date.now();
            this.pluginSpace = {};
            this.topics = {};
            this.subUid = -1;
        };
        _ServerMagic.prototype.cancel = function(fn, data) {
            var deferred = (typeof fn === 'object') ? fn.deferred : fn;
            if (typeof deferred === 'undefined') return;
            deferred.reject(data);
        };
        _ServerMagic.prototype.continue = function(fn, data) {
            var deferred = (typeof fn === 'object') ? fn.deferred : fn;
            if (typeof deferred === 'undefined') return;
            deferred.resolve(data);
        };
        _ServerMagic.prototype.is = function is(type, obj) {
            var clas = Object.prototype.toString.call(obj).slice(8, -1);
            return obj !== undefined && obj !== null && clas === type;
        };
        _ServerMagic.prototype.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
        _ServerMagic.prototype.isValid = function(obj) {
            if (typeof obj === "undefined") return false;
            if (obj === null) return false;
            return true;
        };
        _ServerMagic.prototype.tag = function() {
            return this.id;
        };
        _ServerMagic.prototype.addPlugin = function(name, object) {
            this.pluginSpace[name] = object;
            return this;
        };
        _ServerMagic.prototype.plugin = function(name) {
            return this.pluginSpace[name];
        };
        _ServerMagic.prototype.publish = function(topic, args0, args1, args2, args3) {
            if (!this.topics[topic]) {
                return false;
            }
            var subscribers = this.topics[topic],
                len = subscribers ? subscribers.length : 0;
            while (len--) {
                subscribers[len].func(topic, args0, args1, args2, args3);
            }
            return this;
        };
        _ServerMagic.prototype.subscribe = function(topic, func) {
            function _subscribe(t, f) {
                if (!this.topics[t]) {
                    this.topics[t] = [];
                }
                var token = (++this.subUid).toString();
                this.topics[t].push({
                    token: token,
                    func: f
                });
                return token;
            };

            if (this.isArray(topic)) {
                var ret = [],
                    len = topic.length;
                for (var i = 0; i < len; i++) {
                    ret.push(_subscribe.call(this, topic[i], func));
                }
                return ret;
            }
            return _subscribe.call(this, topic, func);
        };
        _ServerMagic.prototype.unSubscribe = function(token) {
            for (var m in this.topics) {
                if (this.topics[m]) {
                    var j, i;
                    for (var i = 0, j = this.topics[m].length; i < j; i++) {
                        if (this.topics[m][i].token === token) {
                            this.topics[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return this;
        };
        _ServerMagic.prototype.isNil = function(value){
            return _.isNil(value);
        };
        _ServerMagic.prototype.isNaN = function(value){
            return _.isNaN(value);
        };
        _ServerMagic.prototype.extend = _.extend;
        // format or translate
        // format or translate
        _ServerMagic.prototype.toNumberSafe = function(value,defaultValue){
            var v = parseInt(value,10);
            defaultValue = _.isNil(defaultValue) ? 0 : defaultValue;
            if(_.isNaN(v)){
                return defaultValue;
            }
            return v;
        };

        // make singleton
        // make singleton
        var instance;
        return {
            getInstance: function() {
                if (instance == null) {
                    instance = new _ServerMagic();
                    // Hide the constructor so the returned objected can't be new'd...
                    instance.constructor = null;
                }
                return instance;
            }
        };
    })();

    module.exports = serverMagic.getInstance();
