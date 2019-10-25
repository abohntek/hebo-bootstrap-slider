<?php
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

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function hebo_bootstrap_slider_block_assets() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'hebo-bootstrap-slider-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
	);

	$handle = 'bootstrap-script';
   	$list = 'enqueued';
    if (wp_script_is( $handle, $list )) {
    	return;
    } else {
    	wp_register_script( 'bootstrap-script', plugins_url('node_modules/bootstrap/dist/js/bootstrap.min.js', dirname( __FILE__ ) ));
    	wp_enqueue_script( 'bootstrap-script' );
    }
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'hebo_bootstrap_slider_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function hebo_bootstrap_slider_editor_assets() { // phpcs:ignore
	// Scripts.
	wp_enqueue_script(
		'hebo-bootstrap-slider-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ) // Dependencies, defined above.
	);

	// Styles.
	wp_enqueue_style(
		'hebo-bootstrap-slider-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'hebo_bootstrap_slider_editor_assets' );
