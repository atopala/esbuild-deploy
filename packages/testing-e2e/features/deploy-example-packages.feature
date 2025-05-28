Feature: Deploy Example Packages
  As a developer
  I want to test the esbuild-deploy command on all example packages
  So that I can verify the deployment output is correct

  Scenario: Deploy all example packages with default configuration
    Given Loading example packages from workspace
    When For each example package execute "tsc --build" with default config
      And For each example package execute "esbuild-deploy" with default config
    Then Each example package should have a "deploy" directory
    And Each deploy directory should contain bundled files
    And Each bundled file should match its module type