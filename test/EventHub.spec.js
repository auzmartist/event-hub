/* eslint-disable no-console */
import chai from 'chai';
import sinon from 'sinon';
import jsdomGlobal from 'jsdom-global';
import EventHub from '../src/EventHub.js';

jsdomGlobal();
chai.expect();
const expect = chai.expect;

let hub;

describe('Given a new instance of eventHub', () => {
	before(() => {
		hub = new EventHub({
			targetOrigin: 'http://localhost:8000',
		});
	});
	it('requires a targetOrigin option', () => {
		let stub = sinon.stub(console, 'error');
		hub = new EventHub(/* no target origin option */);
		expect(stub.calledOnce).to.be.true;
		let arg = stub.getCall(0).args[0];
		expect(arg).to.be.equal('[EventHub] targetOrigin not provided.');
		stub.restore();
	});
	it('assigns a hubId on _init_', () => {
		let postMessageStub = sinon.stub(window.parent, 'postMessage');
		let warnStub = sinon.stub(console, 'warn');
		hub.emit('foo', {bar: 'baz'});
		expect(warnStub.getCall(0).args[0]).to.be.equal('[EventHub] no hubId provided.');
		hub.publish('_init_', 4);
		hub.emit('foo', {bar: 'baz2'});
		expect(warnStub.notCalled);
		warnStub.restore();
		postMessageStub.restore();
	});
	it('returns a token on subscribe', () => expect(hub.subscribe('foo')).to.be.equal('1'));
	it('increments tokens', () => expect(hub.subscribe('foo')).to.be.equal('2'));
	it('returns token on unsubscribe', () => {
		expect(hub.unsubscribe('2')).to.be.equal('2');
	});
	it('returns false if cannot unsubscribe', () => expect(hub.unsubscribe('3')).to.be.false);
	it('calls func on publish', () => {
		let cb = sinon.spy();
		hub.subscribe('foo', cb);
		hub.publish('foo');
		hub.nextTick(() => expect(cb.calledOnce).to.be.true);
	});
	it('passes data to subscription callback', () => {
		let data = {bar: 'baz'};
		let func = (type, payload) => payload;
		let spy = sinon.spy(func);
		hub.subscribe('foo', func);
		hub.nextTick(() => {
			expect(spy.calledOnce).to.be.true;
		});
		hub.publish('foo', data);
	});
	it('does not call func if unsubscribed', () => {
		let func = (type, payload) => payload;
		let spy = sinon.spy(func);
		let token = hub.subscribe('foo', func);
		hub.publish('foo', {bar: 'baz'});
		hub.unsubscribe(token);
		hub.publish('foo', {bar: 'baz2'});
		hub.nextTick(() => {
			expect(spy.calledOnce).to.be.true;
		});
	});
	it('emits a publish and a postMessage', () => {
		hub.subscribe('foo', (type, payload) => expect(type).to.be.equal('foo'));
		let stub = sinon.stub(window.parent, 'postMessage');
		hub.emit('foo', {bar: 'baz'});
		hub.nextTick(() => {
			expect(stub.calledOnce).to.be.true;
		});
		stub.restore();
	});
});