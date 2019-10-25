/***************************************************************
 *
 *  Copyright notice
 *
 *  (c) 2019 Alexander Bohn <alexander.bohn@hebotek.at>, HeBoTek OG
 *
 *  All rights reserved
 *
 *  This script is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on( 'unhandledRejection', err => {
	throw err;
} );

const ora = require( 'ora' );
const chalk = require( 'chalk' );
const webpack = require( 'webpack' );
const config = require( '../config/webpack.config.dev' );


// Don't run below node 8.
const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split( '.' );
const major = semver[ 0 ];

// If below Node 8.
if ( major < 8 ) {
	console.error(
		chalk.red(
			'You are running Node ' +
				currentNodeVersion +
				'.\n' +
				'Node 8 or higher is required. \n' +
				'Please, update your version of Node.'
		)
	);
	process.exit( 1 );
}


// Init the spinner.
const spinner = new ora( { text: '' } );

// Create the production build and print the deployment instructions.
async function build( webpackConfig ) {
	// Compiler Instance.
	const compiler = await webpack( webpackConfig );

	// Run the compiler.
	compiler.watch( {}, ( err, stats ) => {

		if ( err ) {
			return console.log( err );
		}

		// Start the build.
		console.log( `\n${ chalk.dim( 'Development deployment process started...' ) }` );
		console.log( '\n✅ ', chalk.black.bgGreen( 'Files compiled successfully! \n' ) );
		return spinner.start(
			`${ chalk.dim( 'Watching for changes... (Press CTRL + C to stop).' ) }`
		);
	} );
}

build( config );
