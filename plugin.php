<?php
/**
 * Plugin Name: HeBo Bootstrap Slider Block
 * Plugin URI: https://github.com/abohntek/hebo-slider-block/
 * Text Domain: slider-block
 * Description: HeBo Bootstrap Slider Block is a Gutenberg plugin
 * Author: Alexander Bohn
 * Author URI: https://www.hebotek.at
 * Version: 1.0.0
 * License: GPLv3+
 * License URI: http://www.gnu.org/copyleft/gpl.html
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
