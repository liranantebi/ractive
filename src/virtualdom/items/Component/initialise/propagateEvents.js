import circular from 'circular';
import fireEvent from 'Ractive/prototype/shared/fireEvent';
import log from 'utils/log';

// TODO how should event arguments be handled? e.g.
// <widget on-foo='bar:1,2,3'/>
// The event 'bar' will be fired on the parent instance
// when 'foo' fires on the child, but the 1,2,3 arguments
// will be lost

var Fragment;

circular.push( function () {
	Fragment = circular.Fragment;
});

export default function propagateEvents ( component, eventsDescriptor ) {
	var eventName;

	for ( eventName in eventsDescriptor ) {
		if ( eventsDescriptor.hasOwnProperty( eventName ) ) {
			propagateEvent( component.instance, component.root, eventName, eventsDescriptor[ eventName ] );
		}
	}
}

function propagateEvent ( childInstance, parentInstance, eventName, proxyEventName ) {

	if ( typeof proxyEventName !== 'string' ) {
		log.error({
			debug: parentInstance.debug,
			message: 'noComponentEventArguments'
		});
	}

	childInstance.on( eventName, function () {
		var options;

		// semi-weak test, but what else? tag the event obj ._isEvent ?
		if ( arguments[0].node ) {
			options = {
				event: Array.prototype.shift.call( arguments ),
				args: arguments
			};
		}
		else {
			options = {
				args: Array.prototype.slice.call( arguments )
			};
		}

		fireEvent( parentInstance, proxyEventName, options );

		// cancel bubbling
		return false;
	});
}
