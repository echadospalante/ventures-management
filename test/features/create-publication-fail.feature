Feature: Create Venture

  Scenario: Create a new venture fail
    Given I am a registered user, I want to create a new publication
    When I fill in the publication create fields
    And I click the Create Publication button
    Then Since I am not the owner of the venture, so I cannot create a publication, I should receive a 403 status code