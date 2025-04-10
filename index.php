<?php

/**
 * Plugin Name: GutenGRID – Gutenberg Responsive Interface Designer
 * Plugin URI:  https://github.com/automattic/block-experiments
 * Description: GutenGRID is a Gutenberg block that gives you full control over layout structure through a CSS Breakout Grid system.
 * Version:     0.5.0
 * Author:      Xmedia
 * Author URI:  https://xmedia.nl
 * Text Domain: gutengrid
 * License:     GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

error_log("vwe-grid plugin loaded");
add_action('init', function () {
    $asset_file = include plugin_dir_path(__FILE__) . 'build/index.asset.php';
    wp_register_script(
        'vwe-grid-editor-script',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );
    
    // TODO: JSON translations don't work. Dont know why, I've given up.
    
    wp_set_script_translations(
        'vwe-grid-editor-script',
        'gutengrid',
        plugin_dir_path(__FILE__) . 'languages'
    );



    wp_register_style(
        'vwe-grid-style',
        plugins_url('build/style-index.css', __FILE__),
        [],
        $asset_file['version']
    );

    wp_register_style(
        'vwe-grid-editor-style',
        plugins_url('build/index.css', __FILE__),
        [],
        $asset_file['version']
    );

    register_block_type('vwe/grid', [
        'editor_script' => 'vwe-grid-editor-script',
        'style' => 'vwe-grid-style',
        'editor_style' => 'vwe-grid-editor-style',
    ]);


});

add_filter(
    'excerpt_allowed_wrapper_blocks',
    function ($allowed_wrapper_blocks) {
        return array_merge($allowed_wrapper_blocks, ['vwe/grid', 'vwe/grid-column']);
    }
);


function gutengrid_load_textdomain()
{
    load_plugin_textdomain(
        'gutengrid',
        false,
        plugin_basename(dirname(__FILE__)) . '/languages'
    );
}
add_action('init', 'gutengrid_load_textdomain');


