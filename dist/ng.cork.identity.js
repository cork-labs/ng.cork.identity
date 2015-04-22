/**
 * ng.cork.identity - v0.0.1 - 2015-04-22
 * https://github.com/cork-labs/ng.cork.identity
 *
 * Copyright (c) 2015 Cork Labs <http://cork-labs.org>
 * License: MIT <http://cork-labs.mit-license.org/2015>
 */
(function (angular) {
    'use strict';

    var module = angular.module('ng.cork.identity', [
        'ngRoute'
    ]);

    var isString = angular.isString;
    var isObject = angular.isObject;
    var isFunction = angular.isFunction;
    var isArray = angular.isArray;

    var copy = angular.copy;

    function isPromise(value) {
        return !!value && isFunction(value.then);
    }

    function isInjectable(value) {
        return isArray(value) && isFunction(value[value.length - 1]);
    }

    /**
     * ngdoc service
     * @name ng.cork.identity.corkIdentityProvider
     *
     * @description
     * Provides a way to configure the (@link ng.cork.identity.corkIdentity corkIdentity) service.
     */
    module.provider('corkIdentity', [
        function corkIdentityProvider() {
            var provider = this;

            /**
             * @type {Object} service configuration.
             */
            var serviceConfig = {};

            /**
             * ngdoc function
             * @name configure
             * @methodOf ng.cork.identity.corkIdentityProvider
             *
             * @description
             * Configures the {@link ng.cork.identity.corkIdentity corkIdentity} service.
             *
             * @param {Object} config Object with configuration options, extends base configuration. Ex:
             * ```
             * {
             *
             * }
             * ```
             */
            this.configure = function (config) {
                angular.extend(serviceConfig, config);
            };

            /**
             * @ngdoc service
             * @name ng.cork.identity.corkIdentity
             *
             * @description
             * Establishes and tracks user identity.
             *
             * @property {promise} ready A promise resolved when the identity has been established.
             * @property {object} current The current identity, if set.
             * @property {boolean} isSet True if the identity is set.
             */
            provider.$get = [
                '$rootScope',
                '$q',
                function corkIdentityFactory($rootScope, $q) {

                    var CorkIdentity = function () {
                        var self = this;

                        var acquireMethod;

                        var current = null;

                        var idDefer;

                        function acquire() {
                            var defer = $q.defer();
                            defer.$$pending = true;
                            acquireMethod().then(function (identity) {
                                if (defer.$$pending) {
                                    current = identity;
                                    onSet();
                                }
                            }).finally(function () {
                                defer.$$pending = false;
                                defer.resolve();
                            });
                            return defer;
                        }

                        function cancelPending() {
                            if (idDefer.$$pending) {
                                idDefer.$$pending = false;
                                idDefer.resolve();
                            }
                        }

                        function onSet() {
                            $rootScope.$broadcast('corkIdentity.onChange', self);
                            $rootScope.$broadcast('corkIdentity.onSet', self);
                        }

                        function onClear() {
                            $rootScope.$broadcast('corkIdentity.onChange', self);
                            $rootScope.$broadcast('corkIdentity.onClear', self);
                        }

                        /**
                         * @ngdoc function
                         * @name setAcquireMethod
                         * @methodOf ng.cork.identity.corkIdentity
                         *
                         * @description
                         * Sets the identification method. Provide a function that returns a promise and resolves it
                         * with the user identity.
                         *
                         * @param {Function} fn The identification method.
                         */
                        self.setAcquireMethod = function (fn) {
                            acquireMethod = fn;
                        };

                        /**
                         * @ngdoc function
                         * @name acquire
                         * @methodOf ng.cork.identity.corkIdentity
                         *
                         * @description
                         * Invokes the configured {@link ng.cork.identity.corkIdentity#methods_setAcquireMethod acquireMethod}
                         * to acquire a user identity.
                         *
                         * @returns {Promise} Always resolved when the identification process is finished, even if it is cancelled.
                         */
                        self.acquire = function () {
                            if (!idDefer || !idDefer.$$pending) {
                                idDefer = acquire();
                            }
                            return idDefer;
                        };

                        /**
                         * @ngdoc function
                         * @name clear
                         * @methodOf ng.cork.identity.corkIdentity
                         *
                         * @description
                         * Invalidates the current identity state. If there is a pending calls to the configured
                         * {@link ng.cork.identity.corkIdentity#methods_setAcquireMethod acquireMethod} it's resolution
                         * will be ignored.
                         */
                        self.clear = function () {
                            cancelPending();
                            if (current) {
                                current = null;
                                onClear();
                            }
                        };

                        /**
                         * @ngdoc function
                         * @name set
                         * @methodOf ng.cork.identity.corkIdentity
                         *
                         * @description
                         * Sets the user identity to the provided value. If there is a pending calls to the configured
                         * {@link ng.cork.identity.corkIdentity#methods_setAcquireMethod acquireMethod} it's resolutio
                         * will be ignored.
                         *
                         * @property {object} identity The new identity value.
                         */
                        self.set = function (identity) {
                            cancelPending();
                            current = identity;
                            onSet();
                        };

                        Object.defineProperty(self, 'ready', {
                            get: function () {
                                return idDefer.promise;
                            }
                        });

                        Object.defineProperty(self, 'isSet', {
                            get: function () {
                                return current !== null;
                            }
                        });

                        Object.defineProperty(self, 'current', {
                            get: function () {
                                return current;
                            }
                        });
                    };

                    return new CorkIdentity();
                }
            ];

        }

    ]);

})(angular);
