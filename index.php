<?php
/**
 * Plugin Name: GRID – Gutenberg Responsive Interface Designer
 * Plugin URI:  https://github.com/automattic/block-experiments
 * Description: GutenGRID is a Gutenberg block that gives you full control over layout structure through a CSS Breakout Grid system.
 * Version:     1.0.0
 * Author:      Xmedia
 * Author URI:  https://xmedia.nl
 * Text Domain: block-experiments
 * License:     GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

error_log("vwe-grid plugin loaded");
add_action( 'init', function() {
    $asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
    error_log(" editor_script: vwe-grid-editor-script " . plugins_url( 'build/index.js', __FILE__ ));
    wp_register_script(
        'vwe-grid-editor-script',
        plugins_url( 'build/index.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version']
    );

    error_log(" style: vwe-grid-style " . plugins_url( 'build/style-index.css', __FILE__ ));
    wp_register_style(
        'vwe-grid-style',
        plugins_url( 'build/style-index.css', __FILE__ ),
        [],
        $asset_file['version']
    );

    error_log(" editor_style: vwe-grid-editor-style " . plugins_url( 'build/index.css', __FILE__ ));
    wp_register_style(
        'vwe-grid-editor-style',
        plugins_url( 'build/index.css', __FILE__ ),
        [],
        $asset_file['version']
    );

    error_log(" register_block_type: vwe/grid ");
    register_block_type( 'vwe/grid', [
        'editor_script' => 'vwe-grid-editor-script',
        'style' => 'vwe-grid-style',
        'editor_style' => 'vwe-grid-editor-style',
    ] );

    wp_set_script_translations( 'vwe-grid-editor-script', 'layout-grid' );
} );

add_filter(
    'excerpt_allowed_wrapper_blocks',
    function( $allowed_wrapper_blocks ) {
        return array_merge( $allowed_wrapper_blocks, [ 'vwe/grid', 'vwe/grid-column' ] );
    }
);
