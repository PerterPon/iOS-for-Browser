
var fs   = require( 'fs' ),
    path = require( 'path' ),
    tarPath = 'F:/PHPNow/PHPnow-1.5.6/htdocs/iOS-for-Browser-iphone';

removeFolder( tarPath );
copyFile( __dirname, tarPath );

function removeFolder( folder ){
    var files  = fs.readdirSync( folder );
    for( var i = 0, stat, tarfile; i < files.length; i++ ){
        tarfile= path.join( folder, files[ i ]);
        stat   = fs.statSync( tarfile );
        if( stat.isDirectory() ){
            removeFolder( tarfile );
        } else {
            console.log( ' - delete: ' + tarfile );
            fs.unlinkSync( tarfile );
        }
    }
    if( folder !== tarPath ){
        fs.rmdirSync( folder );
        console.log( ' - delete: ' + folder );
    }
}

function copyFile( ori, tar ){
    var files  = fs.readdirSync( ori );
    for( var i = 0, stat, tarfile, orifile, out; i < files.length; i++ ){
        if( files[ i ] == '.git' || files[ i ] == 'move.js' || files[ i ] == 'move.bat' )
            continue;
        orifile= path.join( ori, files[ i ]);
        tarfile= path.join( tar, files[ i ]);
        stat   = fs.statSync( orifile );
        if( stat.isDirectory() ){
            fs.mkdirSync( tarfile );
            copyFile( orifile, tarfile );
        } else {
            out = fs.readFileSync( orifile );
            fs.writeFileSync( tarfile, out );
            console.log( ' - copy: ' + tarfile );
        }
    }
}