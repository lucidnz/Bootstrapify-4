/*
  
  THIS IS NOT THE BUILD TOOL YOU ARE LOOKING FOR.
  
  We have a Grunt task set up specifcally to run the theme settings generator because there is no Gulp version.
  This is called from inside Gulp so there is no need to run this here.
  
  Note: this can be removed when Shopify fully rolls out the new theme editor!
*/

module.exports = function(grunt) {
  
  grunt.initConfig({
    shopify_theme_settings: {
      settings: {
        options: {
          templates: ['settings/templates']
        },
        files: {
          'theme/config/settings.html': [
/*
            'settings/branding.yml',
            'settings/colour.yml',
            'settings/design.yml',
            'settings/layout.yml',
            'settings/homepage.yml',
            'settings/homepage-slider.yml',
            'settings/typography.yml',
            'settings/blog.yml',
            'settings/products.yml',
            'settings/collections.yml',
            'settings/sidebar.yml',
            'settings/navigation.yml',
            'settings/footer.yml',
            'settings/cart.yml',
            'settings/age-verification.yml',
            'settings/localization.yml',
            'settings/money.yml',
            'settings/social.yml',
            'settings/advanced.yml'
*/
          ]
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-shopify-theme-settings');
};