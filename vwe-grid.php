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

error_log("gutengrid plugin loaded");
add_action('init', function () {
    $asset_file = include plugin_dir_path(__FILE__) . 'build/index.asset.php';
    wp_register_script(
        'gutengrid-editor-script',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );

    // TODO: JSON translations don't work. Dont know why, I've given up.

    wp_set_script_translations(
        'gutengrid-editor-script',
        'gutengrid',
        plugin_dir_path(__FILE__) . 'languages'
    );



    wp_register_style(
        'gutengrid-style',
        plugins_url('build/style-index.css', __FILE__),
        [],
        $asset_file['version']
    );

    wp_register_style(
        'gutengrid-editor-style',
        plugins_url('build/index.css', __FILE__),
        [],
        $asset_file['version']
    );

    register_block_type('gutengrid/grid', [
        'editor_script' => 'gutengrid-editor-script',
        'style' => 'gutengrid-style',
        'editor_style' => 'gutengrid-editor-style',
        'render_callback' => 'gutengrid_render_grid_block',
    ]);
});

add_filter(
    'excerpt_allowed_wrapper_blocks',
    function ($allowed_wrapper_blocks) {
        return array_merge($allowed_wrapper_blocks, ['gutengrid/grid', 'gutengrid/grid-column']);
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


function gutengrid_render_grid_block($attributes, $content, $block)
{
    if (empty($block->inner_blocks)) {
        return $content;
    }
    $parsed_content = '';
    $wrapper = '<div class="%s grid-block-wrapper">%s</div>';
    foreach ($block->inner_blocks as $inner) {
        $block_html = $inner->render();
        $wrapper_class = $inner->parsed_block['attrs']['wrapperClassname'] ?? '';
        
        if (!empty($wrapper_class)) {
            $parsed_content .= sprintf(
                $wrapper,
                $wrapper_class,
                $block_html
            );
        } else {
            $parsed_content .= $block_html;
        }
    }
    return $parsed_content;
}
