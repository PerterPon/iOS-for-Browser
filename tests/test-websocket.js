var expect = require( 'expect.js' );

describe( 'websocket test', function() {
    describe( 'test', function() {
        it( 'check websocket', function( done ) {
            expect( 33 ).to.eql( 33 );
            done();
        } );
        it( 'test websocket', function( done ) {
            expect( 44 ).to.eql( 44 );
            done();
        } );
    } );
} );