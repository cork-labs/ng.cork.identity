describe('ng.cork.identity', function () {
    'use strict';

    beforeEach(module('ng.cork.identity'));

    describe('corkIdentityProvider', function () {

        var corkIdentityProvider;
        beforeEach(module(function (_corkIdentityProvider_) {
            corkIdentityProvider = _corkIdentityProvider_;
        }));

        // kickstart the injector http://stackoverflow.com/questions/15391683/how-can-i-test-a-angularjs-provider
        beforeEach(inject(function (corkIdentity) {}));

        it('should be an object.', function () {

            expect(typeof corkIdentityProvider).toBe('object');
        });
    });

    describe('corkIdentity', function () {

        var corkIdentityProvider;
        beforeEach(module(function (_corkIdentityProvider_) {
            corkIdentityProvider = _corkIdentityProvider_;
        }));

        // kickstart the injector http://stackoverflow.com/questions/15391683/how-can-i-test-a-angularjs-provider
        beforeEach(inject(function (corkIdentity) {}));

        var resolveSpy;
        var rejectSpy;
        var ruleSpy;
        var ruleDefer;
        var rulePromise;
        beforeEach(inject(function ($q) {
            // spies attached to then()
            resolveSpy = jasmine.createSpy('resolveSpy');
            rejectSpy = jasmine.createSpy('rejectSpy');
            // mock rule
            ruleSpy = jasmine.createSpy('ruleSpy');
            ruleDefer = $q.defer();
            rulePromise = ruleDefer.promise;
        }));

        it('should be an object.', inject(function (corkIdentity) {

            expect(typeof corkIdentity).toBe('object');
        }));
    });
});
